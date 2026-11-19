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
import { db, handleFirestoreError, OperationType, OWNER_ADMIN_EMAIL } from '../lib/firebase';
import { Paper, PaperRequest, UserSubmittedFatwa, AdminContact, AdminUser, SiteConfig, FatwaItem } from '../types';

export const PAPERS_COLLECTION = 'papers';
export const REQUESTS_COLLECTION = 'requests';
export const FATWA_INQUIRIES_COLLECTION = 'fatwa_inquiries';
export const PUBLISHED_FATWAS_COLLECTION = 'published_fatwas';
export const TEAM_MEMBERS_COLLECTION = 'team_members';
export const SETTINGS_COLLECTION = 'settings';
export const SITE_CONFIG_COLLECTION = 'site_config';
export const ADMIN_USERS_COLLECTION = 'admin_users';

function stripUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      clean[key] = value;
    }
  });
  return clean;
}

/**
 * Save or update a research paper in Firestore
 */
export async function savePaperToFirestore(paper: Paper): Promise<void> {
  const path = `${PAPERS_COLLECTION}/${paper.id}`;
  try {
    await setDoc(doc(db, PAPERS_COLLECTION, paper.id), stripUndefined(paper));
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
        const fetched: Paper[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as Paper);
        });
        onUpdate(fetched);
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
    await setDoc(doc(db, FATWA_INQUIRIES_COLLECTION, inquiry.id), stripUndefined(inquiry));
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
        const fetched: UserSubmittedFatwa[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as UserSubmittedFatwa);
        });
        onUpdate(fetched);
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
    await setDoc(doc(db, TEAM_MEMBERS_COLLECTION, member.id), stripUndefined(member));
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
        const fetched: AdminContact[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as AdminContact);
        });
        onUpdate(fetched);
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

/**
 * Subscribe to whether a specific user email has Admin access in Firestore
 */
export function subscribeToUserAdminStatus(
  email: string,
  onUpdate: (isListedAdmin: boolean) => void,
  onError?: (err: Error) => void
) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    onUpdate(false);
    return () => {};
  }
  if (normalizedEmail === OWNER_ADMIN_EMAIL) {
    onUpdate(true);
    return () => {};
  }

  const path = `${ADMIN_USERS_COLLECTION}/${normalizedEmail}`;
  try {
    const docRef = doc(db, ADMIN_USERS_COLLECTION, normalizedEmail);
    return onSnapshot(
      docRef,
      (docSnap) => {
        onUpdate(docSnap.exists());
      },
      (error) => {
        console.error('Admin status check error:', error);
        if (onError) onError(error);
        onUpdate(false);
      }
    );
  } catch (error) {
    console.error('Admin status subscription error:', path, error);
    onUpdate(false);
    return () => {};
  }
}

/**
 * Save or grant Admin access to a Gmail account in Firestore
 */
export async function saveAdminUserToFirestore(adminUser: AdminUser): Promise<void> {
  const normalizedEmail = adminUser.email.trim().toLowerCase();
  const path = `${ADMIN_USERS_COLLECTION}/${normalizedEmail}`;
  try {
    await setDoc(doc(db, ADMIN_USERS_COLLECTION, normalizedEmail), {
      email: normalizedEmail,
      name: adminUser.name?.trim() || '',
      role: normalizedEmail === OWNER_ADMIN_EMAIL ? 'owner' : 'admin',
      addedAt: adminUser.addedAt || new Date().toISOString().split('T')[0],
      addedBy: adminUser.addedBy.trim().toLowerCase(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Revoke Admin access from a Gmail account in Firestore
 */
export async function deleteAdminUserFromFirestore(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === OWNER_ADMIN_EMAIL) {
    throw new Error('ပင်မပိုင်ရှင် Admin အကောင့်ကို ဖယ်ရှား၍မရပါ။');
  }
  const path = `${ADMIN_USERS_COLLECTION}/${normalizedEmail}`;
  try {
    await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, normalizedEmail));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to all authorized Admin Gmail accounts (only call when authenticated as Admin)
 */
export function subscribeToAdminUsers(
  onUpdate: (admins: AdminUser[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, ADMIN_USERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const fetched: AdminUser[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as AdminUser);
        });
        onUpdate(fetched);
      },
      (error) => {
        console.error('Admin users snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, ADMIN_USERS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ADMIN_USERS_COLLECTION);
    return () => {};
  }
}

/**
 * Save global site configuration to Firestore (real-time synced to all visitors)
 */
export async function saveSiteConfigToFirestore(config: SiteConfig): Promise<void> {
  const path = `${SITE_CONFIG_COLLECTION}/main`;
  const sanitizeStr = (val: string | undefined, max: number) => (val ?? '').trim().slice(0, max);

  const payload: SiteConfig = {
    siteNameEn: sanitizeStr(config.siteNameEn, 120) || 'ISLAMIC RESEARCH ACADEMY',
    siteNameMy: sanitizeStr(config.siteNameMy, 150) || 'အစ္စလာမ့် သုတေသန အကယ်ဒမီ',
    heroTitleMy: sanitizeStr(config.heroTitleMy, 200),
    heroSubtitle: sanitizeStr(config.heroSubtitle, 1000),
    searchPlaceholder: sanitizeStr(config.searchPlaceholder, 200),
    announcementEnabled: Boolean(config.announcementEnabled),
    announcementText: sanitizeStr(config.announcementText, 500),
    announcementType:
      config.announcementType === 'warning' || config.announcementType === 'success'
        ? config.announcementType
        : 'info',
    maintenanceMode: Boolean(config.maintenanceMode),
    maintenanceMessage: sanitizeStr(config.maintenanceMessage, 1000),
    enableFatwaSection: Boolean(config.enableFatwaSection),
    enableFatwaSubmission: Boolean(config.enableFatwaSubmission),
    enableContactTab: Boolean(config.enableContactTab),
    enableWhatsappFloat: Boolean(config.enableWhatsappFloat),
    enableTelegramButtons: Boolean(config.enableTelegramButtons),
    showDefaultSampleFatwas: Boolean(config.showDefaultSampleFatwas),
    fatwaTitle: sanitizeStr(config.fatwaTitle, 200),
    fatwaSubtitle: sanitizeStr(config.fatwaSubtitle, 1000),
    fatwaNotice1: sanitizeStr(config.fatwaNotice1, 1000),
    fatwaNotice2: sanitizeStr(config.fatwaNotice2, 1000),
    fatwaWhatsappNumber: sanitizeStr(config.fatwaWhatsappNumber, 64),
    footerDescription: sanitizeStr(config.footerDescription, 1000),
    contactEmail: sanitizeStr(config.contactEmail, 200),
    footerCopyright: sanitizeStr(config.footerCopyright, 200),
    footerTagline: sanitizeStr(config.footerTagline, 200),
    updatedAt: new Date().toISOString(),
    updatedBy: sanitizeStr(config.updatedBy, 254),
  };

  try {
    await setDoc(doc(db, SITE_CONFIG_COLLECTION, 'main'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to global site configuration in Firestore (real-time sync across all clients)
 */
export function subscribeToSiteConfig(
  onUpdate: (config: Partial<SiteConfig> | null) => void,
  onError?: (err: Error) => void
) {
  const path = `${SITE_CONFIG_COLLECTION}/main`;
  try {
    const docRef = doc(db, SITE_CONFIG_COLLECTION, 'main');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as Partial<SiteConfig>);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.error('Site config snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Save or update an official published Fatwa in Firestore
 */
export async function savePublishedFatwaToFirestore(fatwa: FatwaItem): Promise<void> {
  const path = `${PUBLISHED_FATWAS_COLLECTION}/${fatwa.id}`;
  const sanitizeStr = (val: string | undefined, max: number) => (val ?? '').trim().slice(0, max);

  const payload = stripUndefined({
    id: sanitizeStr(fatwa.id, 128),
    fatwaNumber: sanitizeStr(fatwa.fatwaNumber, 64),
    category: fatwa.category,
    question: sanitizeStr(fatwa.question, 4000),
    questionerName: sanitizeStr(fatwa.questionerName, 150),
    location: sanitizeStr(fatwa.location, 100),
    askedDate: sanitizeStr(fatwa.askedDate, 64),
    answeredDate: sanitizeStr(fatwa.answeredDate, 64),
    answerSummary: sanitizeStr(fatwa.answerSummary, 2000),
    answerDetail: sanitizeStr(fatwa.answerDetail, 15000),
    arabicReference: sanitizeStr(fatwa.arabicReference, 2000),
    kitabReference: sanitizeStr(fatwa.kitabReference, 500),
    scholarName: sanitizeStr(fatwa.scholarName, 200),
    scholarTitle: sanitizeStr(fatwa.scholarTitle, 200),
    isVerified: Boolean(fatwa.isVerified),
    viewsCount: Number(fatwa.viewsCount) || 0,
    tags: Array.isArray(fatwa.tags) ? fatwa.tags.slice(0, 20).map((t) => String(t).trim()).filter(Boolean) : [],
  });

  try {
    await setDoc(doc(db, PUBLISHED_FATWAS_COLLECTION, fatwa.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an official published Fatwa from Firestore
 */
export async function deletePublishedFatwaFromFirestore(fatwaId: string): Promise<void> {
  const path = `${PUBLISHED_FATWAS_COLLECTION}/${fatwaId}`;
  try {
    await deleteDoc(doc(db, PUBLISHED_FATWAS_COLLECTION, fatwaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to official published Fatwas in Firestore (real-time sync)
 */
export function subscribeToPublishedFatwas(
  onUpdate: (fatwas: FatwaItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, PUBLISHED_FATWAS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const fetched: FatwaItem[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as FatwaItem);
        });
        onUpdate(fetched);
      },
      (error) => {
        console.error('Published fatwas snapshot error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, PUBLISHED_FATWAS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PUBLISHED_FATWAS_COLLECTION);
    return () => {};
  }
}


