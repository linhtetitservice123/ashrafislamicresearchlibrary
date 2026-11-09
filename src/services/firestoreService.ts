import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Paper, PaperRequest, UserSubmittedFatwa, AdminContact } from '../types';

export const PAPERS_COLLECTION = 'papers';
export const REQUESTS_COLLECTION = 'requests';
export const FATWA_INQUIRIES_COLLECTION = 'fatwa_inquiries';
export const TEAM_MEMBERS_COLLECTION = 'team_members';
export const SETTINGS_COLLECTION = 'settings';

/**
 * Save or update a research paper in Firestore
 */
export async function savePaperToFirestore(paper: Paper): Promise<void> {
  const path = `${PAPERS_COLLECTION}/${paper.id}`;
  try {
    await setDoc(doc(db, PAPERS_COLLECTION, paper.id), {
      ...paper,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a research paper from Firestore
 */
export async function deletePaperFromFirestore(paperId: string): Promise<void> {
  const path = `${PAPERS_COLLECTION}/${paperId}`;
  try {
    await deleteDoc(doc(db, PAPERS_COLLECTION, paperId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Update a paper's Telegram post link specifically in Firestore
 */
export async function updatePaperTelegramLinkInFirestore(paperId: string, telegramLink: string): Promise<void> {
  const path = `${PAPERS_COLLECTION}/${paperId}`;
  try {
    await updateDoc(doc(db, PAPERS_COLLECTION, paperId), {
      telegramLink,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribe to papers in Firestore
 */
export function subscribeToPapers(
  onUpdate: (papers: Paper[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, PAPERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: Paper[] = [];
          snapshot.forEach((d) => {
            fetched.push(d.data() as Paper);
          });
          onUpdate(fetched);
        }
      },
      (error) => {
        console.error('Papers snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, PAPERS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PAPERS_COLLECTION);
    return () => {};
  }
}

/**
 * Save a new paper request to Firestore
 */
export async function savePaperRequestToFirestore(request: PaperRequest): Promise<void> {
  const path = `${REQUESTS_COLLECTION}/${request.id}`;
  try {
    await setDoc(doc(db, REQUESTS_COLLECTION, request.id), {
      ...request,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update a paper request status / admin notes in Firestore
 */
export async function updatePaperRequestStatusInFirestore(
  requestId: string,
  status: 'pending' | 'in_research' | 'fulfilled',
  adminNotes?: string
): Promise<void> {
  const path = `${REQUESTS_COLLECTION}/${requestId}`;
  try {
    await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
      status,
      adminNotes: adminNotes ?? '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a paper request from Firestore
 */
export async function deletePaperRequestFromFirestore(requestId: string): Promise<void> {
  const path = `${REQUESTS_COLLECTION}/${requestId}`;
  try {
    await deleteDoc(doc(db, REQUESTS_COLLECTION, requestId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to paper requests in Firestore
 */
export function subscribeToPaperRequests(
  onUpdate: (requests: PaperRequest[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, REQUESTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: PaperRequest[] = [];
          snapshot.forEach((d) => {
            fetched.push(d.data() as PaperRequest);
          });
          onUpdate(fetched);
        }
      },
      (error) => {
        console.error('Requests snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, REQUESTS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, REQUESTS_COLLECTION);
    return () => {};
  }
}

/**
 * Save a new Fatwa inquiry to Firestore
 */
export async function saveFatwaInquiryToFirestore(inquiry: UserSubmittedFatwa): Promise<void> {
  const path = `${FATWA_INQUIRIES_COLLECTION}/${inquiry.id}`;
  try {
    await setDoc(doc(db, FATWA_INQUIRIES_COLLECTION, inquiry.id), {
      ...inquiry,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update a Fatwa inquiry status in Firestore
 */
export async function updateFatwaInquiryStatusInFirestore(
  inquiryId: string,
  status: 'pending' | 'answered'
): Promise<void> {
  const path = `${FATWA_INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await updateDoc(doc(db, FATWA_INQUIRIES_COLLECTION, inquiryId), {
      status,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Answer a Fatwa inquiry in Firestore
 */
export async function answerFatwaInquiryInFirestore(
  inquiryId: string,
  answerText: string,
  kitabReference?: string,
  scholarName?: string
): Promise<void> {
  const path = `${FATWA_INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await updateDoc(doc(db, FATWA_INQUIRIES_COLLECTION, inquiryId), {
      status: 'answered',
      answerText,
      kitabReference: kitabReference || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ',
      scholarName: scholarName || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့',
      answeredAt: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a Fatwa inquiry from Firestore
 */
export async function deleteFatwaInquiryFromFirestore(inquiryId: string): Promise<void> {
  const path = `${FATWA_INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await deleteDoc(doc(db, FATWA_INQUIRIES_COLLECTION, inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to Fatwa inquiries in Firestore
 */
export function subscribeToFatwaInquiries(
  onUpdate: (inquiries: UserSubmittedFatwa[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, FATWA_INQUIRIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: UserSubmittedFatwa[] = [];
          snapshot.forEach((d) => {
            fetched.push(d.data() as UserSubmittedFatwa);
          });
          onUpdate(fetched);
        }
      },
      (error) => {
        console.error('Fatwa inquiries snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, FATWA_INQUIRIES_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, FATWA_INQUIRIES_COLLECTION);
    return () => {};
  }
}

/**
 * Save Telegram Channel URL to global Firestore settings
 */
export async function saveTelegramChannelUrlToFirestore(url: string): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/telegram_channel`;
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, 'telegram_channel'), {
      key: 'telegram_channel_url',
      value: url,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to Telegram Channel URL in Firestore
 */
export function subscribeToTelegramChannelUrl(
  onUpdate: (url: string) => void,
  onError?: (err: Error) => void
) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'telegram_channel');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.value) {
            onUpdate(data.value);
          }
        }
      },
      (error) => {
        console.error('Telegram channel setting snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/telegram_channel`);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/telegram_channel`);
    return () => {};
  }
}

/**
 * Save Admin PIN to Firestore settings
 */
export async function saveAdminPinToFirestore(pin: string): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/admin_pin`;
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, 'admin_pin'), {
      key: 'admin_security_pin',
      value: pin,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to Admin PIN in Firestore
 */
export function subscribeToAdminPin(
  onUpdate: (pin: string) => void,
  onError?: (err: Error) => void
) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'admin_pin');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.value) {
            onUpdate(data.value);
          }
        }
      },
      (error) => {
        console.error('Admin PIN snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/admin_pin`);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/admin_pin`);
    return () => {};
  }
}

/**
 * Save or update an organization team member / admin contact in Firestore
 */
export async function saveTeamMemberToFirestore(member: AdminContact): Promise<void> {
  const path = `${TEAM_MEMBERS_COLLECTION}/${member.id}`;
  try {
    await setDoc(doc(db, TEAM_MEMBERS_COLLECTION, member.id), {
      ...member,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an organization team member / admin contact from Firestore
 */
export async function deleteTeamMemberFromFirestore(memberId: string): Promise<void> {
  const path = `${TEAM_MEMBERS_COLLECTION}/${memberId}`;
  try {
    await deleteDoc(doc(db, TEAM_MEMBERS_COLLECTION, memberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to organization team members in Firestore
 */
export function subscribeToTeamMembers(
  onUpdate: (members: AdminContact[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, TEAM_MEMBERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: AdminContact[] = [];
          snapshot.forEach((d) => {
            fetched.push(d.data() as AdminContact);
          });
          onUpdate(fetched);
        }
      },
      (error) => {
        console.error('Team members snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, TEAM_MEMBERS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, TEAM_MEMBERS_COLLECTION);
    return () => {};
  }
}
