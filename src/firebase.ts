import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  UploadMetadata
} from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Storage
export const storage = getStorage(
  app,
  firebaseConfig.storageBucket ? `gs://${firebaseConfig.storageBucket}` : undefined
);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

// Quick connection test per guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}

testFirestoreConnection();

export interface RegistrationRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  passOrTier: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'approved' | 'confirmed' | 'cancelled';
  adminNotes?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'bmic_2026_registrations_cache';

export function getLocalBackups(): RegistrationRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalBackup(record: RegistrationRecord) {
  try {
    const current = getLocalBackups();
    const updated = [record, ...current.filter(r => r.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save local backup:', e);
  }
}

/**
 * Submit a delegate or corporate booking.
 * CRITICAL FIRESTORE SCHEMA COMPLIANCE:
 * The live Firestore rules enforce data.keys().hasOnly(...) containing EXACTLY:
 * ['fullName', 'email', 'phone', 'organization', 'passOrTier', 'notes', 'status', 'adminNotes', 'createdAt', 'updatedAt']
 * The document 'id' is represented by the document key itself.
 */
export async function submitRegistration(
  registration: Omit<RegistrationRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const regId = 'reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();
  const path = `registrations/${regId}`;

  // If an attachment exists, encode it into notes so it complies with the live hasOnly rule
  let formattedNotes = registration.notes?.trim() || '';
  if (registration.attachmentUrl) {
    const attachTag = `[Attachment: ${registration.attachmentName || 'document'}] ${registration.attachmentUrl}`;
    formattedNotes = formattedNotes ? `${attachTag}\n${formattedNotes}` : attachTag;
  } else if (registration.attachmentName) {
    const attachTag = `[Attached file: ${registration.attachmentName}]`;
    formattedNotes = formattedNotes ? `${attachTag}\n${formattedNotes}` : attachTag;
  }
  if (formattedNotes.length > 950) {
    formattedNotes = formattedNotes.substring(0, 950);
  }

  // Exactly the 10 allowed keys accepted by the live database rules:
  const firestoreData: Record<string, string> = {
    fullName: registration.fullName.trim().substring(0, 150),
    email: registration.email.trim().toLowerCase().substring(0, 150),
    phone: (registration.phone?.trim() || '').substring(0, 50),
    organization: (registration.organization?.trim() || '').substring(0, 150),
    passOrTier: registration.passOrTier.substring(0, 100),
    notes: formattedNotes,
    status: 'pending',
    adminNotes: '',
    createdAt: now,
    updatedAt: now,
  };

  const clientRecord: RegistrationRecord = {
    id: regId,
    fullName: firestoreData.fullName,
    email: firestoreData.email,
    phone: firestoreData.phone,
    organization: firestoreData.organization,
    passOrTier: firestoreData.passOrTier,
    notes: firestoreData.notes,
    status: 'pending',
    adminNotes: '',
    attachmentUrl: registration.attachmentUrl,
    attachmentName: registration.attachmentName,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'registrations', regId), firestoreData);
    saveLocalBackup(clientRecord);
    return regId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    // Persist to local backup so delegate booking is never lost
    saveLocalBackup(clientRecord);
    return regId;
  }
}

export function subscribeToRegistrations(
  onData: (registrations: RegistrationRecord[]) => void,
  onError: (error: unknown) => void
) {
  const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: RegistrationRecord[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let attachmentUrl = d.attachmentUrl;
        let attachmentName = d.attachmentName;

        // Parse attachment from notes if embedded
        if (!attachmentUrl && typeof d.notes === 'string') {
          const match = d.notes.match(/\[Attachment:\s*(.*?)\]\s*(https?:\/\/[^\s\n]+)/);
          if (match) {
            attachmentName = match[1];
            attachmentUrl = match[2];
          }
        }

        records.push({
          id: docSnap.id,
          fullName: d.fullName || '',
          email: d.email || '',
          phone: d.phone || '',
          organization: d.organization || '',
          passOrTier: d.passOrTier || '',
          notes: d.notes || '',
          status: d.status || 'pending',
          adminNotes: d.adminNotes || '',
          attachmentUrl,
          attachmentName,
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString(),
        });
      });

      // Merge local backups (if any offline entries exist)
      const local = getLocalBackups();
      const existingIds = new Set(records.map(r => r.id));
      for (const loc of local) {
        if (!existingIds.has(loc.id)) {
          records.push(loc);
        }
      }

      onData(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
      // If list listener is restricted, provide local cached records
      onData(getLocalBackups());
      onError(err);
    }
  );
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationRecord['status'],
  adminNotes?: string
) {
  const path = `registrations/${id}`;
  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }

  // Update in local cache
  try {
    const local = getLocalBackups();
    const idx = local.findIndex(r => r.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      if (adminNotes !== undefined) local[idx].adminNotes = adminNotes;
      local[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    }
  } catch (e) {
    console.warn('Local cache update failed:', e);
  }

  try {
    await updateDoc(doc(db, 'registrations', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteRegistrationRecord(id: string) {
  const path = `registrations/${id}`;
  try {
    const local = getLocalBackups();
    const updated = local.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local cache delete failed:', e);
  }

  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Upload a document or proof-of-payment to Firebase Storage
 */
export async function uploadRegistrationAttachment(
  file: File,
  prefix: string = 'delegates'
): Promise<{ url: string; path: string; name: string; size: number }> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `bmic2026/${prefix}/${Date.now()}_${cleanName}`;
  const fileRef = storageRef(storage, filePath);

  const metadata: UploadMetadata = {
    contentType: file.type || 'application/octet-stream',
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      fileSize: String(file.size),
    },
  };

  const uploadResult = await uploadBytes(fileRef, file, metadata);
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  return {
    url: downloadUrl,
    path: filePath,
    name: file.name,
    size: file.size,
  };
}

export { signInWithPopup, signOut };
