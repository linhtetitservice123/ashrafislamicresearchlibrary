import { AdminContact, Paper, PaperCategory, PaperRequest, SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteNameEn: 'ISLAMIC RESEARCH ACADEMY',
  siteNameMy: 'အစ္စလာမ့် သုတေသန အကယ်ဒမီ',
  heroTitleMy: 'သာသနာရေးရာ သုတေသနစာတမ်းများ ပလက်ဖောင်း',
  heroSubtitle:
    'ကုရ်အာန်၊ ဟဒီးစ်၊ ဖိကဟ် ဓမ္မသတ်နှင့် အစ္စလာမ့် သာသနာရေးရာ သုတေသနစာတမ်းများကို တစ်စုတစ်စည်းတည်း လေ့လာဖတ်ရှုနိုင်ပြီး ဖသ်ဝါဓမ္မသတ်များကို မေးမြန်းနိုင်ပါသည်။',
  searchPlaceholder: 'စာတမ်းခေါင်းစဉ်၊ ရေးသားသူပညာရှင်၊ သော့ချက်စကားလုံးဖြင့် ရှာဖွေပါ...',
  announcementEnabled: false,
  announcementText: '',
  announcementType: 'info',
  maintenanceMode: false,
  maintenanceMessage:
    'ဝဘ်ဆိုက်အား စနစ်ပိုင်းဆိုင်ရာ ပြင်ဆင်မွမ်းမံနေပါသဖြင့် ခေတ္တစောင့်ဆိုင်းပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။',
  enableFatwaSection: true,
  enableFatwaSubmission: true,
  enableContactTab: true,
  enableWhatsappFloat: true,
  enableTelegramButtons: true,
  showDefaultSampleFatwas: true,
  fatwaTitle: 'အစ္စလာမ့် ဓမ္မသတ် ဖသ်ဝါဌာန',
  fatwaSubtitle:
    'အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီဖိကဟ် ဓမ္မသတ်တော်များနှင့်အညီ ဖြေကြားထားပြီးသော ဖသ်ဝါများကို ကဏ္ဍအလိုက် အကန့်များဖြင့် လေ့လာဖတ်ရှုနိုင်သလို မိမိသိလိုသော သာသနာ့ဓမ္မသတ်များကိုလည်း တိုက်ရိုက်မေးမြန်းနိုင်ပါသည်။',
  fatwaNotice1:
    'မြန်မာပြည်၏ လက်ရှိအခြေအနေအရ လင်မယား ပျက်စဲခြင်းနှင့်လင်မယားပြသနာ, အမွေဆိုင်ရာ ပညတ်ချက်များကို သတ်ဆိုင်ရာ ပြင်ပ ဓမ္မသတ်ရုံးများတွင်မေးပါရန်',
  fatwaNotice2:
    'ဖိကဟ်ဓမ္မသတ်မှာ သတိပေးစာ - အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ်ဟနဖီ လမ်းစဉ်များအတွက်သာ',
  fatwaWhatsappNumber: '',
  footerDescription:
    'ကုရ်အာန်ကျမ်းတော်မြတ်၊ ဟဒီးစ်တော်များနှင့် စစ်မှန်သော ဓမ္မသတ်ပညာရှင်ကြီးများ၏ လမ်းညွှန်မှုဖြင့် သာသနာရေးရာ သုတေသနစာတမ်းများကို စုစည်းထိန်းသိမ်းဖြန့်ဝေပေးလျက်ရှိသော ပလက်ဖောင်း ဖြစ်ပါသည်။',
  contactEmail: 'contact@islamicresearch.org',
  footerCopyright: 'Islamic Research Academy (အစ္စလာမ့် သုတေသန အကယ်ဒမီ). All rights reserved.',
  footerTagline: 'အစ္စလာမ့် သုတေသန မော်ကွန်းတိုက်',
};

export const CATEGORIES_CONFIG: Record<
  PaperCategory,
  { nameMy: string; nameEn: string; iconName: string; color: string }
> = {
  quran_tafseer: {
    nameMy: 'ကုရ်အာန်နှင့် သဖ်စီးရ်',
    nameEn: 'Quran & Exegesis (Tafseer)',
    iconName: 'BookOpen',
    color: 'from-[#8B5A2B] to-[#5C361C]',
  },
  hadith_sunnah: {
    nameMy: 'ဟဒီးစ်နှင့် ဆွန္နသ်တော်',
    nameEn: 'Hadith & Prophetic Sunnah',
    iconName: 'Scroll',
    color: 'from-[#7A4B23] to-[#452410]',
  },
  fiqh_fatwa: {
    nameMy: 'ဖိကဟ်နှင့် ဖသ်ဝါ ဓမ္မသတ်',
    nameEn: 'Fiqh & Contemporary Fatawa',
    iconName: 'Scale',
    color: 'from-[#9C6634] to-[#603716]',
  },
  history_civilization: {
    nameMy: 'အစ္စလာမ့်သမိုင်းနှင့် ယဉ်ကျေးမှု',
    nameEn: 'Islamic History & Heritage',
    iconName: 'Landmark',
    color: 'from-[#845229] to-[#522F15]',
  },
  contemporary_issues: {
    nameMy: 'မျက်မှောက်ခေတ် လူမှုရေးရာနှင့် ဇီဝကျင့်ဝတ်',
    nameEn: 'Contemporary Issues & Bioethics',
    iconName: 'Compass',
    color: 'from-[#6E401F] to-[#3B1E08]',
  },
  spirituality_ethics: {
    nameMy: 'သဆဝ်ဝုဖ်နှင့် ကိုယ်ကျင့်တရား',
    nameEn: 'Spirituality & Akhlaq',
    iconName: 'HeartHandshake',
    color: 'from-[#8C5D30] to-[#593414]',
  },
  comparative_religion: {
    nameMy: 'ဘာသာနှိုင်းယှဉ်ချက်နှင့် ဒဿန',
    nameEn: 'Comparative Religion & Philosophy',
    iconName: 'Globe',
    color: 'from-[#784620] to-[#42210C]',
  },
};

export const DEFAULT_TELEGRAM_DB_URL = 'https://t.me/IslamicResearchAcademy_DB';

// Clean initial papers repository - Demo mock papers removed as requested
export const INITIAL_PAPERS: Paper[] = [];

// Sample template paper for Admin test-post if needed
export const SAMPLE_TEMPLATE_PAPER: Paper = {
  id: 'paper-sample-01',
  title: 'မျက်မှောက်ခေတ် ဒစ်ဂျစ်တယ်ဘဏ္ဍာရေးနှင့် အစ္စလာမ့်ဘဏ်လုပ်ငန်းဆိုင်ရာ သုတေသနစာတမ်း',
  titleOriginalScript: 'بحوث فقهية في المعاملات المالية الرقمية والمصرفية الإسلامية المعاصرة',
  author: 'မုဖ်သီ အုမရ် ဖာရူးက် (Mufti Umar Farooq)',
  authorTitle: 'ဥက္ကဋ္ဌ၊ ဖိကဟ် သုတေသနဘုတ်အဖွဲ့',
  category: 'fiqh_fatwa',
  language: 'myanmar',
  publicationYear: 2024,
  abstract:
    'ဤစာတမ်းတွင် ခေတ်သစ် ဒစ်ဂျစ်တယ်ငွေကြေးများ (Cryptocurrency)၊ အွန်လိုင်းအရောင်းအဝယ် စာချုပ်များနှင့် အစ္စလာမ့် ရှရီအသ်ဥပဒေဘောင်အတွင်း အတိုးမဲ့ဘဏ်လုပ်ငန်းများ လည်ပတ်ဆောင်ရွက်ပုံတို့ကို အသေးစိတ် သုတေသနပြု သုံးသပ်ထားပါသည်။',
  fullContent: `အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy)
သုတေသန စာတမ်းအမှတ်စဉ်: IRA-2024-FQ-089

စာတမ်းခေါင်းစဉ် - မျက်မှောက်ခေတ် ဒစ်ဂျစ်တယ်ဘဏ္ဍာရေးနှင့် အစ္စလာမ့်ဘဏ်လုပ်ငန်းဆိုင်ရာ သုတေသနစာတမ်း
စာရေးသူ - မုဖ်သီ အုမရ် ဖာရူးက် (Mufti Umar Farooq)

နိဒါန်း (Introduction):
အလ္လာဟ်အရှင်မြတ်၏ နာမတော်ဖြင့် အစပြုပါ၏။ မျက်မှောက် ၂၁ ရာစု နည်းပညာဖွံ့ဖြိုးတိုးတက်လာမှုနှင့်အတူ စီးပွားရေးနှင့် ဘဏ္ဍာရေးစနစ်များတွင် ဒစ်ဂျစ်တယ်စနစ်သည် မရှိမဖြစ် အခန်းကဏ္ဍသို့ ရောက်ရှိလာခဲ့သည်။`,
  tags: ['ဖိကဟ်', 'စီးပွားရေး', 'အစ္စလာမ့်ဘဏ်'],
  pages: 38,
  downloadCount: 0,
  readCount: 1,
  uploadedAt: new Date().toISOString().split('T')[0],
  fileFormat: 'PDF',
  fileSize: '3.4 MB',
  isVerifiedByAcademy: true,
  referenceNumber: 'IRA-FQ-2024-089',
  featured: true,
  telegramLink: 'https://t.me/IslamicResearchAcademy_DB/12',
};

// Requests are removed as requested by user
export const INITIAL_REQUESTS: PaperRequest[] = [];

// Organization Team Members & Contacts - Cleared of demo data, fully managed by Admin
export const INITIAL_ADMIN_CONTACTS: AdminContact[] = [];
export const ADMIN_CONTACTS: AdminContact[] = [];

export const SAMPLE_ADMIN_CONTACT: AdminContact = {
  id: 'admin-starter-01',
  name: 'Academy Central Helpline',
  nameMy: 'အစ္စလာမ့် သုတေသန အကယ်ဒမီ ဗဟိုရုံး',
  role: 'Central Helpline & Admin Desk',
  roleMy: 'ဗဟိုဆက်သွယ်ရေးနှင့် စီမံခန့်ခွဲရေးဌာန',
  whatsappNumber: '+959777112233',
  displayWhatsapp: '+95 9 777 112233',
  phoneNumber: '+959777112233',
  displayPhone: '09-777112233',
  email: 'contact@islamicresearch.org',
  activeHours: 'နေ့စဉ် မနက် ၉:၀၀ မှ ညနေ ၅:၀၀',
  specialization: 'ဖသ်ဝါ၊ သုတေသန စာအုပ်များနှင့် အထွေထွေ စုံစမ်းရေး',
  avatarSeed: 'scholar1',
};
