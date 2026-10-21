import { AdminContact, Paper, PaperCategory, PaperRequest } from '../types';

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

export const INITIAL_PAPERS: Paper[] = [
  {
    id: 'paper-001',
    title: 'မျက်မှောက်ခေတ် ဒစ်ဂျစ်တယ်ဘဏ္ဍာရေးနှင့် အစ္စလာမ့်ဘဏ်လုပ်ငန်းဆိုင်ရာ သုတေသနစာတမ်း',
    titleOriginalScript: 'بحوث فقهية في المعاملات المالية الرقمية والمصرفية الإسلامية المعاصرة',
    author: 'မုဖ်သီ အုမရ် ဖာရူးက် (Mufti Umar Farooq)',
    authorTitle: 'ဥက္ကဋ္ဌ၊ ဖိကဟ် သုတေသနဘုတ်အဖွဲ့',
    category: 'fiqh_fatwa',
    language: 'myanmar',
    publicationYear: 2024,
    abstract:
      'ဤစာတမ်းတွင် ခေတ်သစ် ဒစ်ဂျစ်တယ်ငွေကြေးများ (Cryptocurrency)၊ အွန်လိုင်းအရောင်းအဝယ် စာချုပ်များနှင့် အစ္စလာမ့် ရှရီအသ်ဥပဒေဘောင်အတွင်း အတိုးမဲ့ဘဏ်လုပ်ငန်းများ လည်ပတ်ဆောင်ရွက်ပုံတို့ကို အသေးစိတ် သုတေသနပြု သုံးသပ်ထားပါသည်။ ခေတ်မီစီးပွားရေးဆိုင်ရာ ပြဿနာများအတွက် ကုရ်အာန်နှင့် ဟဒီးစ်တော်တို့မှ ထုတ်နုတ်ရှင်းလင်းချက်များ ပါဝင်သည်။',
    fullContent: `အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy)
သုတေသန စာတမ်းအမှတ်စဉ်: IRA-2024-FQ-089

စာတမ်းခေါင်းစဉ် - မျက်မှောက်ခေတ် ဒစ်ဂျစ်တယ်ဘဏ္ဍာရေးနှင့် အစ္စလာမ့်ဘဏ်လုပ်ငန်းဆိုင်ရာ သုတေသနစာတမ်း
စာရေးသူ - မုဖ်သီ အုမရ် ဖာရူးက် (Mufti Umar Farooq)

နိဒါန်း (Introduction):
အလ္လာဟ်အရှင်မြတ်၏ နာမတော်ဖြင့် အစပြုပါ၏။ မျက်မှောက် ၂၁ ရာစု နည်းပညာဖွံ့ဖြိုးတိုးတက်လာမှုနှင့်အတူ စီးပွားရေးနှင့် ဘဏ္ဍာရေးစနစ်များတွင် ဒစ်ဂျစ်တယ်စနစ်သည် မရှိမဖြစ် အခန်းကဏ္ဍသို့ ရောက်ရှိလာခဲ့သည်။ ရှရီအသ် (Shariah) ဥပဒေသည် အချိန်ကာလတိုင်း၊ နေရာဒေသတိုင်းအတွက် လမ်းညွှန်မှုပေးနိုင်သည့် ပြည့်စုံသော ဓမ္မသတ်စနစ်ဖြစ်သည့်အတိုင်း ခေတ်သစ်စီးပွားရေးဆိုင်ရာ စိန်ခေါ်မှုများကို ဓမ္မဓိဋ္ဌာန်ကျကျ လေ့လာသုံးသပ်ရန် လိုအပ်ပါသည်။

အခန်း (၁) - အစ္စလာမ့် စီးပွားရေး၏ အခြေခံမူများ
အစ္စလာမ့်ဘဏ္ဍာရေးစနစ်၏ အဓိက အုတ်မြစ်များမှာ-
၁။ ရိဗာ (Riba - အတိုး) ကို လုံးဝ ပိတ်ပင်တားမြစ်ခြင်း (ကုရ်အာန် ၂:၂၇၅)
၂။ ဃရရ် (Gharar - မရေရာမသေချာမှု၊ လှည့်ဖြားမှု) မှ ကင်းရှင်းစေခြင်း
၃။ မိုင်စီရ် (Maysir - လောင်းကစားဆန်သော စွန့်စားမှု) ရှောင်ရှားခြင်း
၄။ အကျိုးအမြတ်နှင့် အရှုံးကို မျှဝေခံစားသည့် မုဒါရဗဟ် (Mudarabah) နှင့် မုရှာရကဟ် (Musharakah) စနစ်များ ကျင့်သုံးခြင်း

အခန်း (၂) - ဒစ်ဂျစ်တယ်ငွေကြေးနှင့် Cryptocurrency သုံးသပ်ချက်
Crypto ပိုင်ဆိုင်မှုများအား 'မာလ်' (Mal - တန်ဖိုးရှိသောဥစ္စာ) အဖြစ် သတ်မှတ်နိုင်ခြင်း ရှိ၊ မရှိ ပညာရှင်များအကြား အသေးစိတ်ဆွေးနွေးချက်များ ရှိပါသည်။ စာတမ်းတွင် စစ်မှန်သော ကုန်စည်အခြေပြုသည့် ဒစ်ဂျစ်တယ်လွှဲပြောင်းမှုများနှင့် မရေရာသော ထင်ကြေးပေး ရင်းနှီးမြှုပ်နှံမှုများကို ခွဲခြားတင်ပြထားပါသည်။

နိဂုံးနှင့် အကြံပြုချက်များ:
မွတ်စလင်မ် စီးပွားရေးသမားများနှင့် ပြည်သူများအနေဖြင့် အတိုးကင်းစင်သော အစ္စလာမ့်ဘဏ္ဍာရေးဆိုင်ရာ ဝန်ဆောင်မှုများကို စနစ်တကျ အသုံးချနိုင်ရန်နှင့် သံသယဖြစ်ဖွယ် အပေးအယူများမှ ရှောင်ကြဉ်ရန် အလေးအနက် အကြံပြုအပ်ပါသည်။`,
    tags: ['ဖိကဟ်', 'စီးပွားရေး', 'အစ္စလာမ့်ဘဏ်', 'ဒစ်ဂျစ်တယ်ငွေကြေး', 'ရှရီအသ်'],
    pages: 38,
    downloadCount: 1420,
    readCount: 3890,
    uploadedAt: '2024-08-15',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-FQ-2024-089',
    featured: true,
  },
  {
    id: 'paper-002',
    title: 'اصول الشريعة الإسلامية في فقه المعاملات والقضاء المعاصر',
    titleOriginalScript: 'أصول الشريعة الإسلامية في فقه المعاملات والقضاء المعاصر - دراسة تأصيلية مقارنة',
    author: 'الشيخ الدكتور عبد الرحمن السعدي البورمي',
    authorTitle: 'أستاذ الفقه وأصوله، أكاديمية البحوث الإسلامية',
    category: 'fiqh_fatwa',
    language: 'arabic',
    publicationYear: 2023,
    abstract:
      'بحث فقهي معمق يتناول القواعد الفقهية الكلية وتطبيقاتها المعاصرة في المعاملات المالية وعقود التوثيق الحديثة، مع تحقيق فقهي مقارن بين المذاهب الفقهية الأربعة ورأي المحققين.',
    fullContent: `بسم الله الرحمن الرحيم
الحمد لله رب العالمين والصلاة والسلام على أشرف الأنبياء والمرسلين سيدنا محمد وعلى آله وصحبه أجمعين.

أكاديمية البحوث الإسلامية (Islamic Research Academy)
قسم الدراسات الفقهية والأصولية
رقم البحث: IRA-AR-2023-012

عنوان البحث: أصول الشريعة الإسلامية في فقه المعاملات والقضاء المعاصر
الباحث: الشيخ الدكتور عبد الرحمن السعدي البورمي

المقدمة:
إن من عظمة الشريعة الإسلامية الغراء صلاحيتها لكل زمان ومكان، وملاءمة قواعدها الكلية للنوازل والمستجدات التي لا تنقضي عبر العصور. وهذا البحث يسعى إلى تجلية القواعد الأصولية الحاكمة للمعاملات المعاصرة.

الفصل الأول: مقاصد الشريعة في حفظ المال
حفظ المال من الضروريات الخمس التي اتفقت عليها الشرائع السماوية. وتتحقق هذه المقاصد من خلال:
- تشريع المعاملات العادلة القائمة على التراضي.
- سد ذرائع الظلم وأكل أموال الناس بالباطل.
- مراعاة المصلحة العامة ودرء المفاسد المقدم على جلب المصالح.

الفصل الثاني: تطبيقات فقهية في العقود المستحدثة
تم في هذا الفصل بحث عقود التورق، والإجارة المنتهية بالتمليك، والبطاقات الائتمانية، مع بيان الضوابط الشرعية المعتمدة من المجامع الفقهية المعتبرة.

الخاتمة والنتائج:
تثبت هذه الدراسة أن الفقه الإسلامي يمتلك مرونة منضبطة قادرة على استيعاب أرقى النظم التعاقدية المعاصرة متى ما جُردت من الغرر والربا والاستغلال.`,
    tags: ['فقه المعاملات', 'القواعد الفقهية', 'أصول الفقه', 'الشريعة', 'المقاصد'],
    pages: 52,
    downloadCount: 2150,
    readCount: 5120,
    uploadedAt: '2023-11-20',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-AR-2023-012',
    featured: true,
  },
  {
    id: 'paper-003',
    title: 'قرآن مجید کے اعجاز اور علومِ حدیث کی جدید تناظر میں تحقیق',
    titleOriginalScript: 'قرآن مجید کے اعجازِ بیانی اور علومِ حدیث کی حجیت و تدوین کا تحقیقی و تجزیاتی مطالعہ',
    author: 'مولانا محمد اشرف ندوی صاحب',
    authorTitle: 'سابق صدر شعبہ علومِ اسلامیہ، محقق دار المصنفین',
    category: 'hadith_sunnah',
    language: 'urdu',
    publicationYear: 2024,
    abstract:
      'اس مقالے میں حدیث شریف کی تاریخی حجیت، اصولِ اسماء الرجال اور تدوینِ حدیث کے منظم قواعد کا علمی انداز میں اثبات کیا گیا ہے۔ دورِ حاضر کے شکوک و شبہات کا مسکت اور مدلل جواب دیا گیا ہے۔',
    fullContent: `نحمدہ و نصلی علی رسولہ الکریم، أما بعد:

اسلامک ریسرچ اکیڈمی (Islamic Research Academy)
شعبہ تحقیق و تصنیف علومِ قرآن و حدیث
مقالہ نمبر: IRA-UR-2024-045

مقالہ کا عنوان: قرآن مجید کے اعجاز اور علومِ حدیث کی جدید تناظر میں تحقیق
مقالہ نگار: مولانا محمد اشرف ندوی مدظلہ

پیش لفظ:
قرآن حکیم کا اعجازِ بلاغت اور رسول اللہ ﷺ کی سنت و احادیثِ مبارکہ دینِ مبین کے دو لازوال ستون ہیں۔ عصرِ حاضر میں جب مختلف علمی زاویوں سے احادیث کی حجیت پر سوالات اٹھائے جاتے ہیں تو ضروری معلوم ہوتا ہے کہ علمائے امت کے قائم کردہ اسناد اور نقد و نظر کے ضوابط کو از سرِ نو دنیا کے سامنے لایا جائے۔

باب اول: اصولِ جرح و تعدیل اور فنِ رجال
اس باب میں واضح کیا گیا ہے کہ مسلمانوں نے دنیا کی تاریخ میں سوانح نگاری اور ثقاہت کی جانچ کا وہ بے مثل نظام وضع کیا جس کی نظیر دنیا کی کسی قوم کے پاس موجود نہیں۔ ہر راوی کی سچائی، قوتِ حافظہ، عدالت اور ضبط کو کس باریک بینی سے پرکھا گیا۔

باب دوم: دورِ تدوینِ حدیث اور مستشرقین کے اعتراضات کا جائزہ
حدیث کی تدوین عہدِ نبوی ہی سے بصورتِ تحریر و حفظ جاری تھی۔ امام زہری، امام مالک، اور کتبِ ستہ کے ائمہ کرام کی مخلصانہ علمی خدمات کا تفصیلی ذکر۔

خلاصہ کلام:
احادیثِ طیبہ کی حفاظت کے لیے جو معیار مقرر کیے گئے وہ انسانی تاریخ کا سب سے مضبوط اور قابلِ اعتماد علمی سرمایہ ہیں۔ علمائے امت کو چاہیے کہ وہ جدید زبان و اسلوب میں ان حقائق کو نوجوان نسل تک پہنچائیں۔`,
    tags: ['علوم حدیث', 'تدوین حدیث', 'اسماء الرجال', 'اعجاز قرآن', 'سنت نبوی'],
    pages: 45,
    downloadCount: 1890,
    readCount: 4210,
    uploadedAt: '2024-02-10',
    fileFormat: 'PDF',
    fileSize: '3.9 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-UR-2024-045',
    featured: true,
  },
  {
    id: 'paper-004',
    title: 'The Principles of Islamic Medical Ethics and Modern Bioethics',
    titleOriginalScript: 'The Principles of Islamic Medical Ethics, Organ Transplantation, and Clinical Genetics',
    author: 'Dr. Tariq Al-Hashimi & Prof. Dawud Than',
    authorTitle: 'Senior Fellows in Bioethics & Islamic Jurisprudence',
    category: 'contemporary_issues',
    language: 'english',
    publicationYear: 2024,
    abstract:
      'A comprehensive scholarly treatise examining contemporary biomedical dilemmas through the lens of Maqasid al-Shariah (Higher Objectives of Islamic Law). Topics include organ transplantation, stem cell research, end-of-life care, and artificial reproductive technologies.',
    fullContent: `Islamic Research Academy (IRA)
Department of Contemporary Thought & Bioethics
Academic Monograph Ref: IRA-EN-2024-077

Title: The Principles of Islamic Medical Ethics and Modern Bioethics
Authors: Dr. Tariq Al-Hashimi & Prof. Dawud Than

Abstract & Executive Summary:
Rapid advancements in biotechnology and medical sciences have introduced unprecedented ethical quandaries into modern healthcare. Muslim jurists and medical practitioners face vital questions regarding clinical genomics, organ donation, assisted reproduction, and palliative withdrawal of life support.

1. Foundational Maxims in Bioethics:
Islamic bioethics is grounded upon five primary legal maxims (Al-Qawa'id al-Fiqhiyyah):
i. Matters are judged by their intentions (Al-Umur bi-Maqasidiha)
ii. Harm must be eliminated (Ad-Darar Yuzal)
iii. Hardship begets facility (Al-Mashaqqah Tajlib at-Taysir)
iv. Certainty is not superseded by doubt (Al-Yaqin la Yazulu bish-Shakk)
v. Custom is the basis of judgement (Al-'Adah Muhakkamah)

2. Organ Donation & Brain Death:
The consensus of prominent international Islamic Fiqh councils recognizes brainstem death as legal death, provided strict neurological diagnostic protocols are satisfied. Cadaveric organ donation represents an act of profound altruism (Ithar) aligned with the Quranic verse: "And whoever saves one life, it is as if he had saved all mankind" (Al-Ma'idah 5:32).

3. Genetic Engineering & Genome Editing:
Therapeutic gene editing for hereditary diseases is endorsed, whereas germline enhancement and human reproductive cloning remain strictly impermissible due to alteration of Divine creation (Taghyir khalq Allah).

Conclusion:
Islamic ethics offers a harmonious synthesis of empirical medical progress and sacred moral accountability.`,
    tags: ['Bioethics', 'Medical Ethics', 'Organ Donation', 'Genetics', 'Maqasid'],
    pages: 64,
    downloadCount: 3100,
    readCount: 7890,
    uploadedAt: '2024-05-18',
    fileFormat: 'PDF',
    fileSize: '5.2 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-EN-2024-077',
    featured: true,
  },
  {
    id: 'paper-005',
    title: 'သဖ်စီးရ်ပညာရှင်တို့၏ ကျမ်းစာရှင်းလင်းရေး နည်းစနစ်များနှင့် အနက်ဖွင့်ဆိုချက်များ',
    titleOriginalScript: 'مناهج المفسرين وقواعد التفسير بالمأثور وبالدراية',
    author: 'မော်လဝီ ဟာဖိဇ် အိဗ်ရာဟီးမ် (Mawlawi Hafiz Ibrahim)',
    authorTitle: 'ကထိက၊ ကုရ်အာန်နှင့် သဖ်စီးရ်ဘာသာရပ်ဌာန',
    category: 'quran_tafseer',
    language: 'myanmar',
    publicationYear: 2023,
    abstract:
      'ကုရ်အာန်ကျမ်းမြတ်အား အနက်ဖွင့်ဆိုရာတွင် ရှေးဦးဆွဟာဗာဟ်ကြီးများ၊ သာဘိအီးန်ပညာရှင်များနှင့် မျက်မှောက်ခေတ် သဖ်စီးရ်ပညာရှင်များ အသုံးပြုခဲ့သည့် စနစ်များဖြစ်သော သဖ်စီးရ် ဗိလ်မအ်ဆူရ် (ကျမ်းကိုးအခြေပြု) နှင့် သဖ်စီးရ် ဗိရ်ရအ်ယိ (ဆင်ခြင်တုံတရားအခြေပြု) နည်းစနစ်များကို စနစ်တကျ လေ့လာတင်ပြထားပါသည်။',
    fullContent: `အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy)
သုတေသန စာတမ်းအမှတ်စဉ်: IRA-2023-QT-033

စာတမ်းခေါင်းစဉ် - သဖ်စီးရ်ပညာရှင်တို့၏ ကျမ်းစာရှင်းလင်းရေး နည်းစနစ်များနှင့် အနက်ဖွင့်ဆိုချက်များ
စာရေးသူ - မော်လဝီ ဟာဖိဇ် အိဗ်ရာဟီးမ် (Mawlawi Hafiz Ibrahim)

အဖွင့်ကျေးဇူးတော်ချီးမွမ်းခြင်း:
အလ္လာဟ်အရှင်မြတ်၏ အမိန့်တော်ဖြင့် လောကသားတို့အတွက် လမ်းညွှန်မှုအဖြစ် ကျရောက်လာသော ကုရ်အာန်ကျမ်းတော်မြတ်အား စနစ်တကျ နားလည်နိုင်ရန် သဖ်စီးရ်ပညာရပ်သည် အလွန်အရေးကြီးပါသည်။

အဓိက သုတေသန အချက်များ:
၁။ ကုရ်အာန်ကျမ်းတော်မြတ်အား ကုရ်အာန်ကျမ်းတော်မြတ်ဖြင့် ပြန်လည်ရှင်းလင်းခြင်း (تفسير القرآن بالقرآن)
၂။ တမန်တော်မြတ်၏ ဟဒီးစ်တော်များဖြင့် ရှင်းလင်းဖွင့်ဆိုခြင်း (تفسير القرآن بالسنة)
၃။ အာရဗီစကားအသုံးအနှုန်းနှင့် ဘာသာဗေဒဆိုင်ရာ အနက်ဖွင့်ဆိုခြင်း
၄။ အိဗ်နုကစီရ် (Ibn Kathir)၊ အတ်သွဗရီ (Al-Tabari) နှင့် အလ်ကုရ်သွုဗီ (Al-Qurtubi) တို့၏ သဖ်စီးရ်ကျမ်းများအား နှိုင်းယှဉ်ချက်

နိဂုံးစကား:
ကုရ်အာန်အား ကိုယ်ပိုင်ထင်မြင်ချက်သက်သက်ဖြင့် အနက်ကောက်ယူခြင်းမှ ကင်းဝေးစေပြီး စစ်မှန်သော ဓမ္မသတ်ပညာရှင်တို့၏ အစဉ်အလာအတိုင်း လေ့လာကြရန် တိုက်တွန်းအပ်ပါသည်။`,
    tags: ['သဖ်စီးရ်', 'ကုရ်အာန်', 'အိဗ်နုကစီရ်', 'အာရဗီဘာသာဗေဒ', 'အနက်ဖွင့်ဆိုချက်'],
    pages: 42,
    downloadCount: 1650,
    readCount: 4100,
    uploadedAt: '2023-09-12',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-QT-2023-033',
    featured: false,
  },
  {
    id: 'paper-006',
    title: 'تاريخ الحضارة الإسلامية وأثرها في العلوم الإنسانية والنهضة الفكرية',
    titleOriginalScript: 'تاريخ الحضارة الإسلامية وأثرها في تطور العلوم التجريبية والفلسفة الطبيعية',
    author: 'الأستاذ الباحث نور الدين الأركاني',
    authorTitle: 'مدير مركز المخطوطات والتوثيق التاريخي',
    category: 'history_civilization',
    language: 'arabic',
    publicationYear: 2024,
    abstract:
      'دراسة تاريخية وثائقية توثق إسهامات العلماء المسلمين أمثال ابن الهيثم، وابن سينا، والبيروني، والخوارزمي في وضع أسس المنهج العلمي التجريبي وتأثير ذلك على الفكر الإنساني.',
    fullContent: `بسم الله الرحمن الرحيم
أكاديمية البحوث الإسلامية - قسم التاريخ والحضارة
رقم الإيداع الأكاديمي: IRA-AR-2024-061

عنوان الورقة: تاريخ الحضارة الإسلامية وأثرها في العلوم الإنسانية والنهضة الفكرية
المؤلف: الأستاذ الباحث نور الدين الأركاني

مقدمة:
لم تكن الحضارة الإسلامية مجرد حلقة وصل عابرة بين الحضارات القديمة والحديثة، بل كانت مركز إشعاع علمي وفلسفي طوّر المنهج الاستقرائي القائم على الملاحظة والتجربة.

المحاور الرئيسية:
أولاً: بيت الحكمة في بغداد وحركة الترجمة العلمية الكبرى.
ثانياً: رواد المنهج التجريبي:
- الحسن بن الهيثم في علم البصريات والمناظر، وهو المؤسس الفعلي للفيزياء التجريبية.
- الخوارزمي وتأسيسه لعلم الجبر وحساب اللوغاريتمات.
- ابن النفيس واكتشافه للدورة الدموية الصغرى.
ثالثاً: المستشفيات (البيمارستانات) والجامعات الإسلامية كأول مؤسسات أكاديمية منظمة في التاريخ.

خاتمة:
تؤكد الوثائق التاريخية أن التراث العلمي للمسلمين شكل رافداً جوهرياً للنهضة العلمية العالمية مع التمسك بالقيم الروحية والأخلاقية.`,
    tags: ['تاريخ العلوم', 'الحضارة الإسلامية', 'ابن الهيثم', 'الخوارزمي', 'المخطوطات'],
    pages: 58,
    downloadCount: 1980,
    readCount: 4890,
    uploadedAt: '2024-06-05',
    fileFormat: 'PDF',
    fileSize: '4.5 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-AR-2024-061',
    featured: false,
  },
  {
    id: 'paper-007',
    title: 'اخلاقِ حسنہ، تزکیہ نفس اور تصوفِ اسلامی کی حقیقی روح',
    titleOriginalScript: 'اخلاقِ حسنہ، تزکیہ نفس اور سلفِ صالحین کے منہج پر تصوفِ اسلامی کا تنقیدی جائزہ',
    author: 'حضرت مولانا پیر عبد الشکور صاحب',
    authorTitle: 'شیخ الحدیث و استادِ تصوف و اخلاقیات',
    category: 'spirituality_ethics',
    language: 'urdu',
    publicationYear: 2023,
    abstract:
      'دلوں کی صفائی، حسنِ اخلاق اور قربِ الٰہی کے حصول کے قرآنی و مسنون راستے کی جامع وضاحت۔ باطل رسومات اور غلو سے پاک اصل تصوفِ اسلامی کی تعلیمات۔',
    fullContent: `بسم اللہ الرحمن الرحیم
الحمد للہ والصلوۃ والسلام علی رسول اللہ۔

اسلامک ریسرچ اکیڈمی (Islamic Research Academy)
شعبہ اخلاقیات و روحانیات
ریفرنس کوڈ: IRA-UR-2023-019

مقالہ: اخلاقِ حسنہ، تزکیہ نفس اور تصوفِ اسلامی کی حقیقی روح
فاضل مصنف: حضرت مولانا پیر عبد الشکور صاحب

خلاصہ و تمہید:
دینِ اسلام صرف ظاہری احکام کا مجموعہ نہیں بلکہ باطن کی اصلاح اور روح کی پاکیزگی کا بھی ضامن ہے۔ قرآن مجید میں ارشاد فرمایا گیا: "قَدْ أَفْلَحَ مَن زَكَّاهَا" (بے شک وہ کامیاب ہوا جس نے اپنے نفس کو پاک کیا)۔

اہم مباحث:
۱۔ تزکیہ نفس کی شرعی ضرورت اور مقام احسان
۲۔ امام غزالی اور حضرت جنید بغدادی رحمۃ اللہ علیہما کا مسلک و منہج
۳۔ دل کے امراض: حسد، بغض، ریاکاری، کبر، اور حبِ جاہ کا علاج
۴۔ شریعت اور طریقت کی باہمی یکجہتی — بغیر اتباعِ سنت کوئی ولایت نہیں

نتیجہ:
حقیقی صوفی اور مخلص مومن وہی ہے جس کا ظاہر شریعت کے مطابق اور باطن دنیا کی حرص سے پاک اور اللہ کی محبت سے لبریز ہو۔`,
    tags: ['تزکیہ نفس', 'اخلاق حسنہ', 'احسان', 'تصوف اسلامی', 'سلوک'],
    pages: 36,
    downloadCount: 1720,
    readCount: 3950,
    uploadedAt: '2023-12-01',
    fileFormat: 'PDF',
    fileSize: '2.8 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-UR-2023-019',
    featured: false,
  },
  {
    id: 'paper-008',
    title: 'အစ္စလာမ်သာသနာတော်နှင့် ကမ္ဘာ့အဓိကဘာသာကြီးများအကြား ငြိမ်းချမ်းစွာ အတူယှဉ်တွဲနေထိုင်ရေး စာတမ်း',
    titleOriginalScript: 'Islamic Teachings on Peaceful Coexistence, Religious Harmony, and Human Dignity',
    author: 'ဒေါက်တာ ဇေယျာမင်း (Dr. Zay Yar Min)',
    authorTitle: 'ပါမောက္ခ၊ ဘာသာရေးနှင့် ယဉ်ကျေးမှုနှိုင်းယှဉ်လေ့လာရေးဌာန',
    category: 'comparative_religion',
    language: 'myanmar',
    publicationYear: 2024,
    abstract:
      'လူသားမျိုးနွယ်တို့၏ ဂုဏ်သိက္ခာ၊ အပြန်အလှန် လေးစားတန်ဖိုးထားမှု၊ တရားမျှတမှုနှင့် ကမ္ဘာ့ဘာသာကြီးများအကြား ငြိမ်းချမ်းစွာ ပူးပေါင်းဆောင်ရွက်ရေးဆိုင်ရာ အစ္စလာမ့်လမ်းညွှန်ချက်များကို မဒီနာစာချုပ် (Constitution of Medina) နှင့် သမိုင်းဝင် အထောက်အထားများဖြင့် ခွဲခြမ်းစိတ်ဖြာ တင်ပြထားသည်။',
    fullContent: `အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy)
သုတေသန စာတမ်းအမှတ်စဉ်: IRA-2024-CR-015

စာတမ်းခေါင်းစဉ် - အစ္စလာမ်သာသနာတော်နှင့် ကမ္ဘာ့အဓိကဘာသာကြီးများအကြား ငြိမ်းချမ်းစွာ အတူယှဉ်တွဲနေထိုင်ရေး စာတမ်း
စာရေးသူ - ဒေါက်တာ ဇေယျာမင်း (Dr. Zay Yar Min)

နိဒါန်း:
ကမ္ဘာပေါ်တွင် လူမျိုးဘာသာ မတူကွဲပြားမှုသည် ဖန်ဆင်းရှင်၏ သဘာဝနိယာမဖြစ်ပြီး (ကုရ်အာန် ၄၉:၁၃)၊ မတူကွဲပြားသူများအကြား တရားမျှတမှုနှင့် ကရုဏာတရားဖြင့် ဆက်ဆံရန် သာသနာတော်က ပြဋ္ဌာန်းထားပါသည်။

အဓိက သုတေသန အခန်းများ:
၁။ မဒီနာစာချုပ် (The Constitution of Medina / میثاق المدينة) ၏ သဘောသဘာဝနှင့် နိုင်ငံသားအခွင့်အရေး
၂။ အခြားဘာသာဝင်တို့၏ ကိုးကွယ်ယုံကြည်ခွင့်နှင့် ဝတ်ပြုကျောင်းများအား အကာအကွယ်ပေးခြင်း (ကုရ်အာန် ၂၂:၄၀)
၃။ အတင်းအကျပ် သာသနာသွတ်သွင်းခြင်း မရှိစေရဆိုသည့် မူဝါဒ (ကုရ်အာန် ၂:၂၅၆)
၄။ မျက်မှောက်ခေတ် လူ့အဖွဲ့အစည်းအတွင်း အမုန်းစကားများ တားဆီးရေးနှင့် လူမှုသဟဇာတဖြစ်ရေး အကြံပြုချက်များ

နိဂုံးချုပ်:
အစ္စလာမ်သည် လူသားအားလုံးအတွက် ငြိမ်းချမ်းရေး (Salam) နှင့် ကရုဏာ (Rahmah) သာဖြစ်ကြောင်း သမိုင်းနှင့် အဆုံးအမများက အခိုင်အမာ သက်သေခံလျက်ရှိသည်။`,
    tags: ['ငြိမ်းချမ်းရေး', 'မဒီနာစာချုပ်', 'ဘာသာပေါင်းစုံသဟဇာတ', 'လူ့အခွင့်အရေး', 'ကရုဏာ'],
    pages: 48,
    downloadCount: 2240,
    readCount: 5600,
    uploadedAt: '2024-07-02',
    fileFormat: 'PDF',
    fileSize: '3.7 MB',
    isVerifiedByAcademy: true,
    referenceNumber: 'IRA-CR-2024-015',
    featured: false,
  },
];

export const INITIAL_REQUESTS: PaperRequest[] = [
  {
    id: 'req-101',
    topic: 'ခေတ်သစ် အမွေဆက်ခံခွဲဝေမှု (Mawarith) တွက်ချက်ခြင်းဆိုင်ရာ လက်တွေ့လက်စွဲစာတမ်း',
    requesterName: 'ဦးမောင်မောင်လွင် (Yangon)',
    requesterContact: '+959798112233',
    contactType: 'whatsapp',
    language: 'myanmar',
    category: 'fiqh_fatwa',
    description:
      'လက်ရှိ မိသားစုများတွင် ကြုံတွေ့နေရသော အမွေခွဲဝေမှုပြဿနာများ၊ ရှယ်ယာရှင်များနှင့် အစ္စလာမ့်ဖိကဟ်အရ အသေးစိတ် တွက်ချက်မှုဇယားများ ပါဝင်သော စာတမ်းတစ်ခုကို ဖတ်ရှုလိုပါသည်။',
    status: 'in_research',
    submittedAt: '2024-10-02',
    adminNotes: 'ဖိကဟ်သုတေသီ မုဖ်သီအဖွဲ့မှ ဇယားများဖြင့် ပြုစုလျက်ရှိပါသည်။ မကြာမီ အကယ်ဒမီတွင် တင်ပေးပါမည်။',
  },
  {
    id: 'req-102',
    topic: 'تحقيق مخطوطة نادرة في أصول التفسير للإمام السيوطي رحمه الله',
    requesterName: 'الباحث أحمد رضوان (مصر / باحث زائر)',
    requesterContact: '+201098765432',
    contactType: 'whatsapp',
    language: 'arabic',
    category: 'quran_tafseer',
    description:
      'أبحث عن دراسة موثقة للمخطوطات التفسيرية النادرة المحفوظة لدى مركز المخطوطات في جنوب شرق آسيا.',
    status: 'fulfilled',
    submittedAt: '2024-09-15',
    adminNotes: 'تمت إتاحة الورقة البحثية وفهرس المخطوطات برقم مرجعي: IRA-AR-2024-061.',
    fulfilledPaperId: 'paper-006',
  },
  {
    id: 'req-103',
    topic: 'مسائلِ قربانی اور ذبیحہ کے شرعی احکام پر تفصیلی فتویٰ مجموعہ',
    requesterName: 'حافظ محمد بلال (Mandalay)',
    requesterContact: '+959450998877',
    contactType: 'phone',
    language: 'urdu',
    category: 'fiqh_fatwa',
    description:
      'قربانی کے جانوروں کی شرائط، ایامِ نحر، اور مشینی ذبیحہ کے متعلق علماء کا متفقہ فتویٰ مقالہ مطلوب ہے۔',
    status: 'fulfilled',
    submittedAt: '2024-06-10',
    adminNotes: 'مقالہ دار الافتاء کی جانب سے اپلوڈ کر دیا گیا ہے۔',
  },
  {
    id: 'req-104',
    topic: 'Environmental Ethics in Islam: Water Conservation and Climate Stewardship',
    requesterName: 'Dr. Sarah Greenfield (Independent Researcher)',
    requesterContact: '+447700900123',
    contactType: 'whatsapp',
    language: 'english',
    category: 'contemporary_issues',
    description:
      'Seeking research paper analyzing Quranic teachings on water preservation, Himā (conservation zones), and sustainability.',
    status: 'pending',
    submittedAt: '2024-10-10',
    adminNotes: 'Assigned to Contemporary Ethics research division.',
  },
];

export const ADMIN_CONTACTS: AdminContact[] = [
  {
    id: 'admin-1',
    name: 'Mufti Umar Farooq Al-Balkhi',
    nameMy: 'မုဖ်သီ အုမရ် ဖာရူးက် (ဥက္ကဋ္ဌ / ပညာရေးဒါရိုက်တာ)',
    role: 'Academic Director & Head of Fatawa Council',
    roleMy: 'ပညာရေးဒါရိုက်တာ နှင့် ဖသ်ဝါကောင်စီ အကြီးအကဲ',
    whatsappNumber: '+959777112233',
    displayWhatsapp: '+95 9 777 112233',
    phoneNumber: '+959777112233',
    displayPhone: '09-777112233',
    email: 'academic.director@islamicresearch.org',
    activeHours: 'နေ့စဉ် မနက် ၉:၀၀ မှ ညနေ ၅:၀၀ (တနင်္လာ - စနေ)',
    specialization: 'ဖိကဟ်၊ ဖသ်ဝါမေးမြန်းချက်များ၊ သုတေသနကြီးကြပ်မှု',
    avatarSeed: 'scholar1',
  },
  {
    id: 'admin-2',
    name: 'Mawlawi Hafiz Muhammad Bilal',
    nameMy: 'မော်လဝီ ဟာဖိဇ် မုဟမ္မဒ် ဘိလာလ် (စာကြည့်တိုက်တာဝန်ခံ)',
    role: 'Chief Librarian & Research Archive Manager',
    roleMy: 'စာကြည့်တိုက်မှူးချုပ် နှင့် စာတမ်းမော်ကွန်းထိန်း',
    whatsappNumber: '+959450889900',
    displayWhatsapp: '+95 9 450 889900',
    phoneNumber: '+959450889900',
    displayPhone: '09-450889900',
    email: 'library@islamicresearch.org',
    activeHours: 'တနင်္လာ - သောကြာ မနက် ၈:၃၀ မှ ညနေ ၆:၀၀',
    specialization: 'စာတမ်းများတောင်းဆိုမှု၊ စာအုပ်ရှာဖွေရေး၊ PDF မော်ကွန်း',
    avatarSeed: 'scholar2',
  },
  {
    id: 'admin-3',
    name: 'Ustadha Amina Rashid & Editorial Team',
    nameMy: 'ဆရာမကြီး ဒေါ်အာမိနာ ရရှီးဒ် (စာတမ်းစိစစ်ရေးမှူး)',
    role: 'Paper Submissions & Editorial Review Secretary',
    roleMy: 'စာတမ်းလက်ခံရေးနှင့် တည်းဖြတ်ရေးအတွင်းရေးမှူး',
    whatsappNumber: '+959965223344',
    displayWhatsapp: '+95 9 965 223344',
    phoneNumber: '+959965223344',
    displayPhone: '09-965223344',
    email: 'submissions@islamicresearch.org',
    activeHours: 'နေ့စဉ် နေ့လယ် ၁:၀၀ မှ ည ၈:၀၀',
    specialization: 'စာတမ်းတင်သွင်းမှုစစ်ဆေးခြင်း၊ စာတမ်းပြုစုမှုလမ်းညွှန်',
    avatarSeed: 'scholar3',
  },
  {
    id: 'admin-4',
    name: 'Academy Central Helpline (General Desk)',
    nameMy: 'အကယ်ဒမီ ဗဟိုဆက်သွယ်ရေးဌာန (အထွေထွေ စုံစမ်းရေး)',
    role: 'General Inquiries & Community Outreach',
    roleMy: 'အထွေထွေ ဆက်သွယ်မေးမြန်းရေးနှင့် အများပြည်သူဆက်ဆံရေး',
    whatsappNumber: '+959250114477',
    displayWhatsapp: '+95 9 250 114477',
    phoneNumber: '+959250114477',
    displayPhone: '09-250114477',
    email: 'contact@islamicresearch.org',
    activeHours: '၂၄ နာရီ WhatsApp မက်ဆေ့ခ်ျ လက်ခံပေးပါသည်',
    specialization: 'အလှူငွေ၊ သင်တန်း၊ အထွေထွေ ဝန်ဆောင်မှုနှင့် ကူညီရေး',
    avatarSeed: 'scholar4',
  },
];
