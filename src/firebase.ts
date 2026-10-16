import { initializeApp } from 'firebase/app';
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
  runTransaction
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

// CRITICAL: Must use firestoreDatabaseId for multi-database Firestore configurations
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

// Initial connection test per guidelines
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
  status: 'pending' | 'contacted' | 'approved' | 'confirmed' | 'cancelled' | 'Payment verified' | 'Rejected';
  adminNotes?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  delegateNames?: string[];
  delegateEmails?: string[];
  createdAt: string;
  updatedAt: string;
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
 * Submit a delegate, sponsor, exhibitor or free pass booking directly to Firebase Firestore.
 * Data is immediately universally available across all devices.
 */
export async function submitRegistration(
  registration: Omit<RegistrationRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const regId = 'reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();
  const path = `registrations/${regId}`;

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
    fullName: registration.fullName.trim().substring(0, 150),
    email: registration.email.trim().toLowerCase().substring(0, 150),
    phone: (registration.phone?.trim() || '').substring(0, 50),
    organization: (registration.organization?.trim() || '').substring(0, 150),
    passOrTier: registration.passOrTier.substring(0, 100),
    notes: formattedNotes,
    status: 'pending',
    adminNotes: '',
    delegateNames: registration.delegateNames || [],
    delegateEmails: registration.delegateEmails || [],
    createdAt: now,
    updatedAt: now,
  };

  if (registration.attachmentUrl) {
    firestoreData.attachmentUrl = registration.attachmentUrl;
  }
  if (registration.attachmentName) {
    firestoreData.attachmentName = registration.attachmentName;
  }

  try {
    await setDoc(doc(db, 'registrations', regId), firestoreData);
    return regId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Real-time subscription to registrations in Firestore.
 * Updates dynamically across all devices whenever any registration is added, edited or updated.
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
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString(),
        });
      });

      onData(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch all registrations from Firestore once.
 */
export async function fetchAllRegistrations(): Promise<RegistrationRecord[]> {
  const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
  try {
    const snapshot = await getDocs(q);
    const records: RegistrationRecord[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
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
        attachmentUrl: d.attachmentUrl,
        attachmentName: d.attachmentName,
        delegateNames: d.delegateNames || [],
        delegateEmails: d.delegateEmails || [],
        createdAt: d.createdAt || new Date().toISOString(),
        updatedAt: d.updatedAt || new Date().toISOString(),
      });
    });
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'registrations');
    throw error;
  }
}

/**
 * Update the status and optional admin note for a registration in Firestore.
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
 * Update delegate names on a team / corporate pack booking.
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
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Full update of registration fields in Firestore.
 */
export async function updateRegistrationRecord(
  id: string,
  updates: Partial<Omit<RegistrationRecord, 'id'>>
) {
  const path = `registrations/${id}`;
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(doc(db, 'registrations', id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete a registration document from Firestore.
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

// Ticket functions
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
        createdAt: d.createdAt,
        emailSent: d.emailSent || false,
      });
    });
    return tickets;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'tickets');
    return [];
  }
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
      console.warn('Counter transaction failed, using random sequence', e);
    }

    const fiveDigit = String(seqNum).padStart(5, '0');
    const passId = `BMIC-2026-${tierCode}-${fiveDigit}`;
    const token = 'tok_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const ticketId = 'tkt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const now = new Date().toISOString();

    const ticketData = {
      passId,
      token,
      bookingId: booking.id,
      delegateName: del.name.trim(),
      organizationName: booking.organization || '',
      tier: tierDisplayName,
      delegateEmail: del.email?.trim() || booking.email,
      status: 'Valid' as const,
      createdAt: now,
      emailSent: false,
    };

    try {
      await setDoc(doc(db, 'tickets', ticketId), ticketData);
      createdTickets.push({
        id: ticketId,
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
