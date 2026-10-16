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

const LOCAL_STORAGE_KEY = 'bmic_registrations_local';

function getLocalRegistrations(): RegistrationRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const defaultSamples: RegistrationRecord[] = [
        {
          id: 'reg_sample_1',
          fullName: 'Kagiso Molaodi',
          email: 'kagiso@orange.co.bw',
          phone: '+267 71 234 567',
          organization: 'Orange Botswana',
          passOrTier: 'Corporate Delegate',
          notes: 'VIP delegation seat requested',
          status: 'confirmed',
          adminNotes: 'Payment verified via bank EFT',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'reg_sample_2',
          fullName: 'Thabo Raleaka',
          email: 'thabo.raleaka@mascom.bw',
          phone: '+267 72 987 654',
          organization: 'Mascom Wireless',
          passOrTier: 'Exhibition Stand',
          notes: '3m x 3m Shell Scheme Booth C4',
          status: 'approved',
          adminNotes: 'Stand assigned near entrance',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'reg_sample_3',
          fullName: 'Neo Sebotho',
          email: 'nsebotho@gov.bw',
          phone: '+267 74 111 222',
          organization: 'Ministry of Communications, Knowledge & Technology',
          passOrTier: 'Standard Delegate',
          notes: 'Government institutional pass',
          status: 'pending',
          adminNotes: 'Invoice dispatched',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSamples));
      return defaultSamples;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalRegistration(record: RegistrationRecord) {
  try {
    const existing = getLocalRegistrations();
    const index = existing.findIndex(r => r.id === record.id);
    if (index >= 0) {
      existing[index] = record;
    } else {
      existing.unshift(record);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Local storage save error:', err);
  }
}

function updateLocalRegistrationStatus(id: string, status: RegistrationRecord['status'], adminNotes?: string) {
  try {
    const existing = getLocalRegistrations();
    const updated = existing.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Local storage status update error:', err);
  }
}

function updateLocalRegistrationFull(id: string, updates: Partial<Omit<RegistrationRecord, 'id'>>) {
  try {
    const existing = getLocalRegistrations();
    const updated = existing.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Local storage full update error:', err);
  }
}

function deleteLocalRegistration(id: string) {
  try {
    const existing = getLocalRegistrations();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Local storage delete error:', err);
  }
}

/**
 * Submit a delegate, sponsor, exhibitor or free pass booking directly to Firebase Firestore and local storage.
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

  const newRecord: RegistrationRecord = {
    id: regId,
    fullName: firestoreData.fullName,
    email: firestoreData.email,
    phone: firestoreData.phone,
    organization: firestoreData.organization,
    passOrTier: firestoreData.passOrTier,
    notes: firestoreData.notes,
    status: 'pending',
    adminNotes: '',
    attachmentUrl: firestoreData.attachmentUrl,
    attachmentName: firestoreData.attachmentName,
    delegateNames: firestoreData.delegateNames,
    delegateEmails: firestoreData.delegateEmails,
    createdAt: now,
    updatedAt: now,
  };

  // Save to local storage immediately
  saveLocalRegistration(newRecord);

  try {
    await setDoc(doc(db, 'registrations', regId), firestoreData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  return regId;
}

/**
 * Real-time subscription to registrations in Firestore and local storage.
 */
export function subscribeToRegistrations(
  onData: (registrations: RegistrationRecord[]) => void,
  onError?: (error: unknown) => void
) {
  // Emit local records immediately so admin panel is never blank
  onData(getLocalRegistrations());

  const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: RegistrationRecord[] = [];
      const seenIds = new Set<string>();

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        seenIds.add(docSnap.id);
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

      // Merge local records that aren't in Firestore yet
      const currentLocal = getLocalRegistrations();
      for (const loc of currentLocal) {
        if (!seenIds.has(loc.id)) {
          records.push(loc);
        }
      }

      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'registrations');
      onData(getLocalRegistrations());
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch all registrations.
 */
export async function fetchAllRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const records: RegistrationRecord[] = [];
    const seenIds = new Set<string>();

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      seenIds.add(docSnap.id);
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

    const currentLocal = getLocalRegistrations();
    for (const loc of currentLocal) {
      if (!seenIds.has(loc.id)) {
        records.push(loc);
      }
    }

    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'registrations');
    return getLocalRegistrations();
  }
}

/**
 * Update status and admin note.
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationRecord['status'],
  adminNotes?: string
) {
  updateLocalRegistrationStatus(id, status, adminNotes);
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
  }
}

/**
 * Full update of registration fields.
 */
export async function updateRegistrationRecord(
  id: string,
  updates: Partial<Omit<RegistrationRecord, 'id'>>
) {
  updateLocalRegistrationFull(id, updates);
  const path = `registrations/${id}`;
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(doc(db, 'registrations', id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a registration document.
 */
export async function deleteRegistrationRecord(id: string) {
  deleteLocalRegistration(id);
  const path = `registrations/${id}`;
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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
