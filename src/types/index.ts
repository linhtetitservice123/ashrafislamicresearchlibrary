export type LanguageType = 'myanmar' | 'arabic' | 'urdu' | 'english';

export type PaperCategory =
  | 'quran_tafseer'
  | 'hadith_sunnah'
  | 'fiqh_fatwa'
  | 'history_civilization'
  | 'contemporary_issues'
  | 'spirituality_ethics'
  | 'comparative_religion';

export interface Paper {
  id: string;
  title: string;
  titleOriginalScript?: string;
  author: string;
  authorTitle?: string;
  category: PaperCategory;
  language: LanguageType;
  publicationYear: number | string;
  abstract: string;
  fullContent: string;
  tags: string[];
  pages: number;
  downloadCount: number;
  readCount: number;
  uploadedAt: string;
  fileFormat: 'PDF' | 'DOCX' | 'EPUB';
  fileSize: string;
  isVerifiedByAcademy: boolean;
  referenceNumber: string;
  featured?: boolean;
  telegramLink?: string;
}

export type RequestStatus = 'pending' | 'in_research' | 'fulfilled';

export interface PaperRequest {
  id: string;
  topic: string;
  requesterName: string;
  requesterContact: string;
  contactType: 'whatsapp' | 'phone' | 'email';
  language: LanguageType | 'any';
  category: PaperCategory;
  description: string;
  status: RequestStatus;
  submittedAt: string;
  adminNotes?: string;
  fulfilledPaperId?: string;
}

export interface AdminContact {
  id: string;
  name: string;
  nameMy: string;
  role: string;
  roleMy: string;
  whatsappNumber: string; // international format without spaces, e.g. +959777123456
  displayWhatsapp: string;
  phoneNumber: string;
  displayPhone: string;
  email: string;
  activeHours: string;
  specialization: string;
  avatarSeed?: string;
}

export type FatwaCategory =
  | 'namaz'
  | 'roza'
  | 'hajj'
  | 'zakat'
  | 'trade_business'
  | 'amal';

export interface FatwaItem {
  id: string;
  fatwaNumber: string;
  category: FatwaCategory;
  question: string;
  questionerName?: string;
  location?: string;
  askedDate: string;
  answeredDate: string;
  answerSummary: string;
  answerDetail: string;
  arabicReference?: string;
  kitabReference: string;
  scholarName: string;
  scholarTitle: string;
  isVerified: boolean;
  viewsCount: number;
  tags: string[];
}

export interface UserSubmittedFatwa {
  id: string;
  category: FatwaCategory;
  question: string;
  inquirerName: string;
  contactNumber: string;
  contactType: 'whatsapp' | 'telegram' | 'phone';
  city?: string;
  isAnonymous: boolean;
  submittedAt: string;
  status: 'pending' | 'answered';
}

