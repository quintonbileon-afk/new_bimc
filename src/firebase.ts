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
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
  throw new Error(JSON.stringify(errInfo));
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
  createdAt: string;
  updatedAt: string;
}

export async function submitRegistration(registration: Omit<RegistrationRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const regId = 'reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();
  const path = `registrations/${regId}`;

  const payload: RegistrationRecord = {
    id: regId,
    fullName: registration.fullName.trim(),
    email: registration.email.trim().toLowerCase(),
    phone: registration.phone?.trim() || '',
    organization: registration.organization?.trim() || '',
    passOrTier: registration.passOrTier,
    notes: registration.notes?.trim() || '',
    status: 'pending',
    adminNotes: '',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'registrations', regId), payload);
    return regId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
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
        records.push(docSnap.data() as RegistrationRecord);
      });
      onData(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
      onError(err);
    }
  );
}

export async function updateRegistrationStatus(id: string, status: RegistrationRecord['status'], adminNotes?: string) {
  const path = `registrations/${id}`;
  const updates: Partial<RegistrationRecord> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }

  try {
    await updateDoc(doc(db, 'registrations', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteRegistrationRecord(id: string) {
  const path = `registrations/${id}`;
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export { signInWithPopup, signOut };
