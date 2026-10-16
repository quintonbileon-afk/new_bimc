import { initializeApp, getApps, getApp } from 'firebase/app';
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
  getDocFromServer,
  getDocs,
  where,
  runTransaction,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  UploadMetadata
} from 'firebase/storage';
import fallbackConfig from '../firebase-applet-config.json';

/**
 * 1. Central Firebase Configuration
 * Priority order:
 *  a. Environment variables (VITE_FIREBASE_*)
 *  b. Fallback to firebase-applet-config.json for seamless local/preview execution
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  (firebaseConfig.projectId === fallbackConfig.projectId ? fallbackConfig.firestoreDatabaseId : undefined);

// Single, idempotent Firebase App initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Cloud Firestore instance (supports named databases or default)
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

// Firebase Authentication instance
export const auth = getAuth(app);

// Firebase Storage instance
export const storage = getStorage(
  app,
  firebaseConfig.storageBucket ? `gs://${firebaseConfig.storageBucket}` : undefined
);

// Standard Operation Types for Diagnostics
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Initial connection test
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

/**
 * Registration Record Schema
 * Saved directly in Cloud Firestore "registrations" collection.
 * No localStorage or in-memory mock storage is used.
 */
export interface RegistrationRecord {
  id: string;
  type?: 'delegate' | 'exhibition' | 'sponsorship' | 'free_pass' | 'general' | 'enquiry';
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  passOrTier: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'approved' | 'confirmed' | 'cancelled' | 'Payment verified' | 'Rejected';
  adminNotes?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  delegateNames?: string[];
  delegateEmails?: string[];
  createdAt: string; // ISO string for robust client-side display & sorting
  updatedAt: string;
  serverTimestamp?: any;
}

export interface TicketRecord {
  id: string;
  passId: string;
  token: string;
  bookingId: string;
  delegateName: string;
  organizationName: string;
  tier: string;
  delegateEmail?: string;
  status: 'Valid' | 'Checked in' | 'Cancelled';
  createdAt: string;
  emailSent?: boolean;
}

/**
 * 3. Save Registration directly to Cloud Firestore
 * Creates a unique document ID, records serverTimestamp(), and persists in the cloud.
 */
export async function submitRegistration(
  registration: Omit<RegistrationRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'> & {
    status?: RegistrationRecord['status'];
  }
): Promise<string> {
  const regCol = collection(db, 'registrations');
  const docRef = doc(regCol); // Auto-generate clean, unique Firestore document ID
  const regId = docRef.id;
  const now = new Date().toISOString();

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

  const firestoreData: Record<string, any> = {
    id: regId,
    type: registration.type || 'general',
    fullName: registration.fullName.trim().substring(0, 200),
    email: registration.email.trim().toLowerCase().substring(0, 200),
    phone: (registration.phone?.trim() || '').substring(0, 80),
    organization: (registration.organization?.trim() || '').substring(0, 200),
    passOrTier: registration.passOrTier.substring(0, 150),
    notes: formattedNotes,
    status: registration.status || 'pending',
    adminNotes: '',
    delegateNames: registration.delegateNames || [],
    delegateEmails: registration.delegateEmails || [],
    createdAt: now,
    updatedAt: now,
    serverCreatedAt: serverTimestamp(),
  };

  if (registration.attachmentUrl) {
    firestoreData.attachmentUrl = registration.attachmentUrl;
  }
  if (registration.attachmentName) {
    firestoreData.attachmentName = registration.attachmentName;
  }

  try {
    await setDoc(docRef, firestoreData);

    // Fire confirmation email request non-blockingly
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: registration.fullName,
        email: registration.email,
        registrationType: registration.passOrTier,
        referenceId: regId,
        organization: registration.organization,
        phone: registration.phone,
      }),
    }).catch((err) => {
      console.warn('Confirmation email dispatch notice:', err);
    });

    return regId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `registrations/${regId}`);
    throw error;
  }
}

/**
 * Helper to normalize Firestore Timestamp / ISO strings
 */
function parseTimestampToIso(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (typeof val.seconds === 'number') return new Date(val.seconds * 1000).toISOString();
  return new Date().toISOString();
}

/**
 * 4. Real-time subscription to registrations in Firestore.
 * Listen directly to Cloud Firestore using onSnapshot.
 */
export function subscribeToRegistrations(
  onData: (registrations: RegistrationRecord[]) => void,
  onError?: (error: unknown) => void
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

        if (!attachmentUrl && typeof d.notes === 'string') {
          const match = d.notes.match(/\[Attachment:\s*(.*?)\]\s*(https?:\/\/[^\s\n]+)/);
          if (match) {
            attachmentName = match[1];
            attachmentUrl = match[2];
          }
        }

        records.push({
          id: docSnap.id,
          type: d.type || 'general',
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
          delegateNames: d.delegateNames || [],
          delegateEmails: d.delegateEmails || [],
          createdAt: parseTimestampToIso(d.createdAt),
          updatedAt: parseTimestampToIso(d.updatedAt),
        });
      });

      // Sort newest first
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch all registrations directly from Firestore
 */
export async function fetchAllRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const records: RegistrationRecord[] = [];

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      records.push({
        id: docSnap.id,
        type: d.type || 'general',
        fullName: d.fullName || '',
        email: d.email || '',
        phone: d.phone || '',
        organization: d.organization || '',
        passOrTier: d.passOrTier || '',
        notes: d.notes || '',
        status: d.status || 'pending',
        adminNotes: d.adminNotes || '',
        attachmentUrl: d.attachmentUrl,
        attachmentName: d.attachmentName,
        delegateNames: d.delegateNames || [],
        delegateEmails: d.delegateEmails || [],
        createdAt: parseTimestampToIso(d.createdAt),
        updatedAt: parseTimestampToIso(d.updatedAt),
      });
    });

    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'registrations');
    throw error;
  }
}

/**
 * Update registration status and optional admin notes in Firestore
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationRecord['status'],
  adminNotes?: string
) {
  const path = `registrations/${id}`;
  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
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

/**
 * Update delegate names on a team / corporate pack booking
 */
export async function updateBookingDelegateNames(
  bookingId: string,
  delegateNames: string[],
  delegateEmails: string[]
) {
  const path = `registrations/${bookingId}`;
  try {
    await updateDoc(doc(db, 'registrations', bookingId), {
      delegateNames,
      delegateEmails,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Full update of registration fields in Firestore
 */
export async function updateRegistrationRecord(
  id: string,
  updates: Partial<Omit<RegistrationRecord, 'id'>>
) {
  const path = `registrations/${id}`;
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, 'registrations', id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete a registration document in Firestore
 */
export async function deleteRegistrationRecord(id: string) {
  const path = `registrations/${id}`;
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Ticket Generation & Management
export async function getTicketsForBooking(bookingId: string): Promise<TicketRecord[]> {
  try {
    const q = query(collection(db, 'tickets'), where('bookingId', '==', bookingId));
    const snapshot = await getDocs(q);
    const tickets: TicketRecord[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      tickets.push({
        id: docSnap.id,
        passId: d.passId,
        token: d.token,
        bookingId: d.bookingId,
        delegateName: d.delegateName,
        organizationName: d.organizationName,
        tier: d.tier,
        delegateEmail: d.delegateEmail,
        status: d.status || 'Valid',
        createdAt: parseTimestampToIso(d.createdAt),
        emailSent: d.emailSent || false,
      });
    });
    return tickets;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'tickets');
    return [];
  }
}

export function subscribeToAllTickets(
  onData: (tickets: TicketRecord[]) => void,
  onError?: (error: unknown) => void
) {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const tickets: TicketRecord[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        tickets.push({
          id: docSnap.id,
          passId: d.passId,
          token: d.token,
          bookingId: d.bookingId,
          delegateName: d.delegateName,
          organizationName: d.organizationName,
          tier: d.tier,
          delegateEmail: d.delegateEmail,
          status: d.status || 'Valid',
          createdAt: parseTimestampToIso(d.createdAt),
          emailSent: d.emailSent || false,
        });
      });
      onData(tickets);
    },
    (err) => {
      console.warn('Tickets live subscription notice:', err);
      onError?.(err);
    }
  );
}

export async function generateTicketsForBooking(
  booking: RegistrationRecord,
  delegateDetails: { name: string; email?: string }[]
): Promise<TicketRecord[]> {
  const existing = await getTicketsForBooking(booking.id);
  if (existing.length > 0) {
    return existing;
  }

  const tierLower = booking.passOrTier.toLowerCase();
  let tierCode = 'STD';
  let tierDisplayName = booking.passOrTier;

  if (tierLower.includes('free pass') || tierLower.includes('exhibition floor')) {
    tierCode = 'EXPO';
    tierDisplayName = 'Free Pass';
  } else if (tierLower.includes('student') || tierLower.includes('developer')) {
    tierCode = 'DEV';
    tierDisplayName = 'Student / Developer';
  } else if (tierLower.includes('standard')) {
    tierCode = 'STD';
    tierDisplayName = 'Standard Delegate';
  } else if (tierLower.includes('corporate delegate')) {
    tierCode = 'CORP';
    tierDisplayName = 'Corporate Delegate';
  } else if (tierLower.includes('corporate pack') || tierLower.includes('3 delegates') || tierLower.includes('team')) {
    tierCode = 'TEAM';
    tierDisplayName = 'Corporate Pack';
  } else if (tierLower.includes('gold') || tierLower.includes('silver')) {
    tierCode = 'CORP';
    tierDisplayName = booking.passOrTier;
  } else if (tierLower.includes('exhibitor')) {
    tierCode = 'EXPO';
    tierDisplayName = 'Exhibitor';
  }

  const createdTickets: TicketRecord[] = [];
  const counterRef = doc(db, 'counters', 'ticket_counter');

  for (const del of delegateDetails) {
    let seqNum = Math.floor(1000 + Math.random() * 90000);
    try {
      seqNum = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let nextVal = 1000;
        if (counterDoc.exists()) {
          nextVal = (counterDoc.data().currentValue || 1000) + 1;
        }
        transaction.set(counterRef, { currentValue: nextVal }, { merge: true });
        return nextVal;
      });
    } catch (e) {
      console.warn('Counter transaction notice:', e);
    }

    const fiveDigit = String(seqNum).padStart(5, '0');
    const passId = `BMIC-2026-${tierCode}-${fiveDigit}`;
    const token = 'tok_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const ticketDocRef = doc(collection(db, 'tickets'));
    const ticketId = ticketDocRef.id;
    const now = new Date().toISOString();

    const ticketData = {
      id: ticketId,
      passId,
      token,
      bookingId: booking.id,
      delegateName: del.name.trim(),
      organizationName: booking.organization || '',
      tier: tierDisplayName,
      delegateEmail: del.email?.trim() || booking.email,
      status: 'Valid' as const,
      createdAt: now,
      serverCreatedAt: serverTimestamp(),
      emailSent: false,
    };

    try {
      await setDoc(ticketDocRef, ticketData);
      createdTickets.push({
        ...ticketData,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tickets/${ticketId}`);
    }
  }

  await updateRegistrationStatus(booking.id, 'Payment verified');
  return createdTickets;
}

export async function updateTicketStatus(ticketId: string, status: 'Valid' | 'Checked in' | 'Cancelled') {
  try {
    await updateDoc(doc(db, 'tickets', ticketId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
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

/**
 * Communique Newsletter Signup in Firestore
 */
export async function subscribeToCommunique(email: string): Promise<string> {
  const docRef = doc(collection(db, 'communique_subscribers'));
  const subId = docRef.id;
  await setDoc(docRef, {
    id: subId,
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  });
  return subId;
}

/**
 * Authentication Helpers for Secretariat Admin Panel
 */
export async function adminSignInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function adminSignInWithEmail(email: string, pass: string): Promise<User> {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function adminSignInAnonymously(): Promise<User> {
  const res = await signInAnonymously(auth);
  return res.user;
}

export async function adminSignOut(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
