import React, { useState } from 'react';
import {
  Compass,
  Moon,
  Landmark,
  Coins,
  Scale,
  Sparkles,
  Search,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageCircle,
  PhoneCall,
  Copy,
  Check,
  Share2,
  BookOpen,
  Filter,
  Eye,
  PlusCircle,
  FileQuestion,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  MapPin,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import { FatwaCategory, FatwaItem, UserSubmittedFatwa } from '../types';
import {
  FATWA_CATEGORIES_CONFIG,
  MANDATORY_FATWA_NOTICES,
  INITIAL_ANSWERED_FATWAS,
} from '../data/fatwaData';
import { FatwaDetailModal } from './FatwaDetailModal';

interface FatwaSectionProps {
  telegramDbUrl: string;
  onOpenTelegramModal?: () => void;
}

export const FatwaSection: React.FC<FatwaSectionProps> = ({
  telegramDbUrl,
  onOpenTelegramModal,
}) => {
  // State for answered fatwas
  const [fatwas] = useState<FatwaItem[]>(INITIAL_ANSWERED_FATWAS);
  const [selectedCategory, setSelectedCategory] = useState<FatwaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalFatwa, setActiveModalFatwa] = useState<FatwaItem | null>(null);
  const [expandedFatwaId, setExpandedFatwaId] = useState<string | null>(null);
  const [copiedFatwaId, setCopiedFatwaId] = useState<string | null>(null);

  // View mode: 'shelves' (အကန့်လေးတွေနဲ့ ပြပေးခြင်း) vs 'all'
  const [viewMode, setViewMode] = useState<'shelves' | 'single_category'>('shelves');

  // State for Ask Fatwa Form
  const [formCategory, setFormCategory] = useState<FatwaCategory>('namaz');
  const [formQuestion, setFormQuestion] = useState('');
  const [formName, setFormName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formContact, setFormContact] = useState('');
  const [formContactType, setFormContactType] = useState<'whatsapp' | 'telegram' | 'phone'>('whatsapp');
  const [formCity, setFormCity] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // User submitted questions list in localStorage
  const [submittedList, setSubmittedList] = useState<UserSubmittedFatwa[]>(() => {
    try {
      const saved = localStorage.getItem('ira_user_fatwas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Moon':
        return <Moon className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'Coins':
        return <Coins className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <BookMarked className="w-5 h-5" />;
    }
  };

  // Filtered Fatwas
  const filteredFatwas = fatwas.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.question.toLowerCase().includes(q) ||
      item.answerSummary.toLowerCase().includes(q) ||
      item.answerDetail.toLowerCase().includes(q) ||
      item.kitabReference.toLowerCase().includes(q) ||
      item.fatwaNumber.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Group fatwas by category for shelves view
  const categorizedFatwasMap: Record<FatwaCategory, FatwaItem[]> = {
    namaz: [],
    roza: [],
    hajj: [],
    zakat: [],
    trade_business: [],
    amal: [],
  };

  filteredFatwas.forEach((f) => {
    if (categorizedFatwasMap[f.category]) {
      categorizedFatwasMap[f.category].push(f);
    }
  });

  // Handle Form Submission
  const handleAskFatwaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) return;

    const newQuestion: UserSubmittedFatwa = {
      id: `usr-ftw-${Date.now()}`,
      category: formCategory,
      question: formQuestion.trim(),
      inquirerName: isAnonymous ? 'အမည်မဖော်လိုသူ' : (formName.trim() || 'အမည်မဖော်လိုသူ'),
      contactNumber: formContact.trim(),
      contactType: formContactType,
      city: formCity.trim(),
      isAnonymous,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const updated = [newQuestion, ...submittedList];
    setSubmittedList(updated);
    try {
      localStorage.setItem('ira_user_fatwas', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setFormSubmitted(true);
  };

  // Direct WhatsApp dispatch for Fatwa Question
  const handleSendViaWhatsApp = () => {
    const categoryName = FATWA_CATEGORIES_CONFIG[formCategory]?.nameMy || formCategory;
    const nameStr = isAnonymous ? 'အမည်မဖော်လိုသူ' : (formName || 'မေးမြန်းသူ');
    const msg = encodeURIComponent(
      `*အစ္စလာမ် ဓမ္မသတ် ဖသ်ဝါ မေးမြန်းလွှာ*\n\n` +
      `📌 *ကဏ္ဍ:* ${categoryName}\n` +
      `👤 *မေးမြန်းသူ:* ${nameStr} (${formCity || 'မြန်မာ'})\n` +
      `📞 *ဆက်သွယ်ရန်:* ${formContact || 'မဖော်ပြပါ'}\n\n` +
      `❓ *မေးခွန်း:*\n${formQuestion}\n\n` +
      `_Islamic Research Academy ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့သို့ မေးမြန်းအပ်ပါသည်။_`
    );
    window.open(`https://wa.me/959777112233?text=${msg}`, '_blank');
  };

  const handleCopyAnswer = (fatwa: FatwaItem) => {
    const text = `[${fatwa.fatwaNumber}] ${FATWA_CATEGORIES_CONFIG[fatwa.category].nameMy}\n\nမေးခွန်း: ${fatwa.question}\n\nဓမ္မသတ်အဖြေ: ${fatwa.answerDetail}\n\nကျမ်းကိုး: ${fatwa.kitabReference}\nဖြေကြားသူ: ${fatwa.scholarName}\nအစ္စလာမ့် သုတေသန အကယ်ဒမီ`;
    navigator.clipboard.writeText(text);
    setCopiedFatwaId(fatwa.id);
    setTimeout(() => setCopiedFatwaId(null), 2500);
  };

  return (
    <div className="space-y-10 pb-16 font-burmese text-[#2C1810]">
      {/* 1. TOP HERO BANNER & MANDATORY WARNINGS */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#24130B] via-[#351C0F] to-[#1C0E07] text-[#FAF7F2] p-6 sm:p-8 md:p-10 border-2 border-[#5C381E] shadow-2xl overflow-hidden">
        {/* Subtle Islamic Motif Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D9A86B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#8B5A2B]/40 text-[#EAD8B5] text-xs font-semibold border border-[#D9A86B]/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D9A86B]" />
              <span>ဒါရုလ်အိဖ်တာအ် (ဓမ္မသတ်ဌာန)</span>
            </span>
            <span className="font-arabic text-xs text-[#D9A86B]">دار الإفتاء والبحوث الشرعية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFF9F2] tracking-wide mb-3 leading-snug">
            အစ္စလာမ့် ဓမ္မသတ် ဖသ်ဝါဌာန
          </h1>

          <p className="text-sm sm:text-base text-[#DEC8AF] leading-relaxed mb-6 max-w-3xl">
            အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီဖိကဟ် ဓမ္မသတ်တော်များနှင့်အညီ ဖြေကြားထားပြီးသော ဖသ်ဝါများကို ကဏ္ဍအလိုက် အကန့်များဖြင့် လေ့လာဖတ်ရှုနိုင်သလို မိမိသိလိုသော သာသနာ့ဓမ္မသတ်များကိုလည်း တိုက်ရိုက်မေးမြန်းနိုင်ပါသည်။
          </p>

          {/* TWO MANDATORY NOTICES AS REQUESTED BY USER */}
          <div className="space-y-3.5 pt-2">
            {/* Notice 1: Myanmar Marriage & Inheritance Special Notice */}
            <div className="bg-[#B91C1C]/15 border-2 border-[#EF4444] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-md">
              <AlertTriangle className="w-6 h-6 text-[#FCA5A5] shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#EF4444] text-white text-[11px] font-bold">
                    အထူးသတိပေးချက်
                  </span>
                  <span className="text-xs text-[#FCA5A5] font-semibold">
                    (မိသားစု၊ လင်မယားနှင့် အမွေဆိုင်ရာ)
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#FEE2E2] leading-relaxed">
                  {MANDATORY_FATWA_NOTICES.marriageInheritanceNotice}
                </p>
                <p className="text-xs text-[#FCA5A5]/90 leading-relaxed pt-1">
                  * ရှင်းလင်းချက် - လင်မယားကွာရှင်းပြတ်စဲမှုနှင့် အမွေခွဲဝေမှုများသည် နှစ်ဖက်သက်သေထွက်ဆိုချက်နှင့် စာရွက်စာတမ်း အထောက်အထားများအား လူကိုယ်တိုင်တိုက်ရိုက်စစ်ဆေးရန် လိုအပ်သဖြင့် အွန်လိုင်းမှ ဖြေကြားခွင့်မပြုဘဲ ပြင်ပတရားဝင် ဓမ္မသတ်ရုံးများသို့သာ လူကိုယ်တိုင်ကြွရောက် မေးမြန်းဆုံးဖြတ်ချက် ခံယူရမည်ဖြစ်ပါသည်။
                </p>
              </div>
            </div>

            {/* Notice 2: Hanafi Mazhab Warning Notice */}
            <div className="bg-[#D97706]/15 border-2 border-[#F59E0B] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-md">
              <Info className="w-6 h-6 text-[#FDE68A] shrink-0 mt-0.5" />
              <div>
                <span className="px-2 py-0.5 rounded bg-[#D97706] text-white text-[11px] font-bold inline-block mb-1">
                  မဇ်ဟဗ် လမ်းစဉ်သတ်မှတ်ချက်
                </span>
                <p className="text-sm sm:text-base font-bold text-[#FEF3C7] leading-relaxed">
                  {MANDATORY_FATWA_NOTICES.hanafiWarningNotice}
                </p>
                <p className="text-xs text-[#FDE68A]/90 pt-1 leading-relaxed">
                  ဤဌာနမှ ဖြေကြားထားသော ဓမ္မသတ်များနှင့် မေးမြန်းချက်အားလုံးသည် အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် အေမာမ်အအ်ဇမ် အဘူဟနီဖာဟ် (ရဟ်မသုလ္လာဟိအလိုင်းဟ်) ၏ ဟနဖီဖိကဟ်ကျမ်းဂန်များ (ရဒ်ဒုလ်မုဟ်တာရ်၊ ဖတာဝါဟိန္ဒီယာ၊ အလ်ဟိဒါယာဟ်၊ နူးရုလ်အီဒွာဟ်) အပေါ် အခြေခံထားပါသည်။
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASK FATWA SECTION ("ဖသ်ဝါနေရာကိုဝင်တာနဲ့မေးမဲ့နေရာရှိရမယ်") */}
      <section
        id="ask-fatwa-section"
        className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D9C4AC] shadow-lg relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header of Ask Fatwa Form */}
          <div className="border-b border-[#EADFCF] pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#543014] text-white flex items-center justify-center shadow-md">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#34180A]">
                    အစ္စလာမ် ဓမ္မသတ် ဖသ်ဝါ မေးမြန်ရန်
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A604D]">
                    မေးမြန်းလိုသည့် ဖသ်ဝါ ဓမ္မသတ် မေးခွန်းများကို ဤနေရာတွင် တင်သွင်းမေးမြန်းနိုင်ပါသည်
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Call/Chat with Mufti Button */}
              <a
                href="https://wa.me/959777112233"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#2E7D4E] shadow-sm transition-all"
                title="မုဖ်သီထံ WhatsApp ဖြင့် တိုက်ရိုက်မေးမည်"
              >
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span>WhatsApp ဓမ္မသတ်ရုံး တိုက်ရိုက်မေးမည်</span>
              </a>
            </div>
          </div>

          {/* Success Banner if just submitted */}
          {formSubmitted && (
            <div className="bg-[#ECFDF5] border-2 border-[#10B981] p-5 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold">
                    သင်၏ ဖသ်ဝါ မေးခွန်းကို အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်မှူးများက စိစစ်ပြီး ဟနဖီဖိကဟ်ကျမ်းကိုးနှင့်တကွ ဖြေကြားပေးပါမည်။
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSendViaWhatsApp}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>မုဖ်သီ WhatsApp သို့ ချက်ချင်းပေးပို့မည်</span>
                </button>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormQuestion('');
                  }}
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-50 transition-colors"
                >
                  အခြားမေးခွန်း အသစ်မေးမည်
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAskFatwaSubmit} className="space-y-5">
            {/* 1. Category Selection Radio/Pills */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#4A2810] mb-2">
                ၁။ သက်ဆိုင်ရာ ဓမ္မသတ် ကဏ္ဍ ရွေးချယ်ပါ <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {(Object.entries(FATWA_CATEGORIES_CONFIG) as [FatwaCategory, typeof FATWA_CATEGORIES_CONFIG[FatwaCategory]][]).map(
                  ([catKey, config]) => {
                    const isSelected = formCategory === catKey;
                    return (
                      <button
                        type="button"
                        key={catKey}
                        onClick={() => setFormCategory(catKey)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-[#402312] text-[#F3E5D0] border-[#8B5A2B] shadow-md ring-2 ring-[#8B5A2B]/40'
                            : 'bg-[#FAF6F0] text-[#543825] border-[#E0D3C1] hover:bg-[#F2E8DB]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`${isSelected ? 'text-[#D9A86B]' : 'text-[#8B5A2B]'}`}>
                            {getCategoryIcon(config.iconName)}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D9A86B]" />}
                        </div>
                        <span className="text-xs font-bold leading-tight line-clamp-2">
                          {config.nameMy.replace(' ဆိုင်ရာ ဓမ္မသတ်များ', '')}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* 2. Question Textarea */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#4A2810] mb-2">
                ၂။ မေးမြန်းလိုသည့် ဖသ်ဝါ ဓမ္မသတ် မေးခွန်း (ရှင်းလင်းပြည့်စုံစွာ ရေးသားပါ) <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                placeholder="ဥပမာ - ခရီးထွက်ရာတွင် မိုင်မည်မျှဝေးပါက ကဆရ်ပြုရမည်နည်း သို့မဟုတ် ရိုဇာထားစဉ် ဆေးထိုးခွင့်ရှိမရှိ ဓမ္မသတ် သိလိုပါသည်..."
                className="w-full px-4 py-3 bg-[#FCFAF7] border-2 border-[#D9C4AC] rounded-2xl text-sm text-[#2C1810] placeholder-[#A08875] focus:outline-none focus:border-[#8B5A2B] transition-all"
              />
              <p className="text-[11px] text-[#8C6D53] mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>သတိပေးချက် - လင်မယားကွာရှင်းခြင်းနှင့် အမွေဆိုင်ရာကိစ္စများကို ပြင်ပဓမ္မသတ်ရုံးများသို့သာ လူကိုယ်တိုင်သွားရောက် မေးမြန်းရပါမည်။</span>
              </p>
            </div>

            {/* 3. Inquirer Details (Name, Contact, City, Anonymous) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#4A2810] mb-1.5">
                  မေးမြန်းသူ အမည်
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={isAnonymous ? 'အမည်မဖော်လိုသူ' : formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="ဥပမာ - ကိုမုဟမ္မဒ်"
                    className="w-full px-3.5 py-2.5 bg-[#FCFAF7] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] placeholder-[#A08875] focus:outline-none focus:border-[#8B5A2B] disabled:bg-[#ECE4D8] disabled:text-[#7A604D]"
                  />
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#8B5A2B] accent-[#8B5A2B] cursor-pointer"
                    />
                    <label htmlFor="anonCheck" className="text-[11px] text-[#633A18] cursor-pointer">
                      အမည်မဖော်လိုပါ (Anonymous)
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-bold text-[#4A2810] mb-1.5">
                  အဖြေပြန်လည်ပို့ပေးရန် ဖုန်း/WhatsApp
                </label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="09-xxxxxxxxx သို့မဟုတ် WhatsApp"
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF7] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] placeholder-[#A08875] focus:outline-none focus:border-[#8B5A2B]"
                />
                <div className="mt-1 flex items-center gap-3 text-[11px] text-[#633A18]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="contactType"
                      checked={formContactType === 'whatsapp'}
                      onChange={() => setFormContactType('whatsapp')}
                      className="accent-[#8B5A2B]"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="contactType"
                      checked={formContactType === 'telegram'}
                      onChange={() => setFormContactType('telegram')}
                      className="accent-[#8B5A2B]"
                    />
                    <span>Telegram</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="contactType"
                      checked={formContactType === 'phone'}
                      onChange={() => setFormContactType('phone')}
                      className="accent-[#8B5A2B]"
                    />
                    <span>ဖုန်းခေါ်ဆိုရန်</span>
                  </label>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-[#4A2810] mb-1.5">
                  မြို့နယ် / ဒေသ
                </label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="ဥပမာ - ရန်ကုန်မြို့၊ မန္တလေးမြို့"
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF7] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] placeholder-[#A08875] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EADFCF]">
              <div className="flex items-center gap-2 text-xs text-[#8C6D53]">
                <ShieldCheck className="w-4 h-4 text-[#8B5A2B]" />
                <span>အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်အတိုင်း စိစစ်ဖြေကြားပါသည်</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  disabled={!formQuestion.trim()}
                  className="px-4 py-2.5 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#2E7D4E] transition-all disabled:opacity-50"
                  title="မုဖ်သီထံ WhatsApp ဖြင့် တိုက်ရိုက်မေးမည်"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                  <span>WhatsApp ဖြင့် မေးမည်</span>
                </button>

                <button
                  type="submit"
                  disabled={!formQuestion.trim()}
                  className="px-6 py-2.5 bg-[#8B5A2B] hover:bg-[#6E421B] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ဖသ်ဝါမေးခွန်း တင်သွင်းမည်</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 3. ANSWERED FATWAS DISPLAY ("ဖြေထားပြီးသားတွေကိုလဲအကန့်လေးတွေနဲ့ပြပေးရမယ်") */}
      <section className="space-y-6">
        {/* Section Header with Controls */}
        <div className="bg-[#FAF6F0] rounded-3xl p-5 sm:p-6 border border-[#E0D3C1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#8B5A2B]"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#34180A]">
                ဖြေထားပြီးသော ဓမ္မသတ် ဖသ်ဝါများ
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B5A2B]/10 text-[#7A491C] border border-[#D9C4AC]">
                {filteredFatwas.length} ခု
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A604D] mt-1">
              နမားဇ်၊ ရိုဇာ၊ ဟဂ်ျ၊ ဇကားသ်၊ စီးပွားရောင်းဝယ်ရေးနှင့် အအ်မာလ် ကဏ္ဍအကန့်များအလိုက် ရှာဖွေဖတ်ရှုနိုင်ပါသည်
            </p>
          </div>

          {/* View mode toggle: Shelves (အကန့်များ) vs Filtered Single Category */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setViewMode('shelves');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                viewMode === 'shelves' && selectedCategory === 'all'
                  ? 'bg-[#402312] text-[#F3E5D0] border-[#8B5A2B] shadow-inner'
                  : 'bg-white text-[#543825] border-[#D9C4AC] hover:bg-[#F2E8DB]'
              }`}
            >
              အကန့်အလိုက် ကြည့်မည် (Shelves)
            </button>
            <a
              href={telegramDbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Telegram Database တွင် ဖသ်ဝါများ ရှာဖွေရန်"
            >
              <Send className="w-3.5 h-3.5 fill-white" />
              <span>Telegram ဓမ္မသတ် Database</span>
            </a>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6D53]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ဖသ်ဝါမေးခွန်းများ၊ ဓမ္မသတ်အဖြေများ၊ ကျမ်းကိုးများ (ဥပမာ - ကဆရ်၊ ရိုဇာပျက်၊ အတိုး၊ ဇကားသ်၊ ဟိန္ဒီယာ)..."
              className="w-full pl-11 pr-24 py-3.5 bg-white border-2 border-[#D9C4AC] rounded-2xl text-xs sm:text-sm text-[#2C1810] placeholder-[#9C826E] focus:outline-none focus:border-[#8B5A2B] shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded bg-[#EAE0D2] text-[#543825] hover:bg-[#DFD1BF]"
              >
                ရှင်းလင်းမည်
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setViewMode('shelves');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-sm'
                  : 'bg-white text-[#5C3B24] border-[#D9C4AC] hover:bg-[#FAF6F0]'
              }`}
            >
              ကဏ္ဍအားလုံး ({fatwas.length})
            </button>

            {(Object.entries(FATWA_CATEGORIES_CONFIG) as [FatwaCategory, typeof FATWA_CATEGORIES_CONFIG[FatwaCategory]][]).map(
              ([catKey, config]) => {
                const count = fatwas.filter((f) => f.category === catKey).length;
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      setSelectedCategory(catKey);
                      setViewMode('single_category');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-sm'
                        : 'bg-white text-[#5C3B24] border-[#D9C4AC] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span>{config.nameMy.replace(' ဆိုင်ရာ ဓမ္မသတ်များ', '')}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* 4. FATWAS RENDERING: SHELVES COMPARTMENTS ("အကန့်လေးတွေနဲ့ပြပေးရမယ်") */}
        {filteredFatwas.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D9C4AC] text-[#8C6D53] space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-[#D4C1AC]" />
            <h3 className="text-base font-bold text-[#3B2211]">
              ကိုက်ညီသော ဖသ်ဝါ ဓမ္မသတ် မတွေ့ရှိပါ
            </h3>
            <p className="text-xs text-[#7A604D]">
              အကယ်၍ သင်သိလိုသော အကြောင်းအရာအတွက် ဓမ္မသတ်အဖြေ မရှိသေးပါက အထက်ပါမေးခွန်းမေးမြန်းလွှာတွင် မေးမြန်းနိုင်ပါသည်။
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#8B5A2B] text-white rounded-xl text-xs font-semibold shadow"
            >
              ရှာဖွေမှု အားလုံးပြန်ပြမည်
            </button>
          </div>
        ) : viewMode === 'shelves' && selectedCategory === 'all' ? (
          /* SHELVES COMPARTMENT VIEW (အကန့်လေးများဖြင့် ပြသခြင်း) */
          <div className="space-y-10">
            {(Object.entries(FATWA_CATEGORIES_CONFIG) as [FatwaCategory, typeof FATWA_CATEGORIES_CONFIG[FatwaCategory]][]).map(
              ([catKey, config]) => {
                const catFatwas = categorizedFatwasMap[catKey] || [];
                if (catFatwas.length === 0) return null;

                return (
                  <div
                    key={catKey}
                    className="bg-[#FCFAF7] rounded-3xl p-5 sm:p-7 border-2 border-[#E3D6C5] shadow-sm relative overflow-hidden space-y-5"
                  >
                    {/* Shelf Compartment Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3D6C5]">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.color} text-white flex items-center justify-center shadow-md`}
                        >
                          {getCategoryIcon(config.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg sm:text-xl font-bold text-[#34180A]">
                              {config.nameMy}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B5A2B]/10 text-[#7A491C] border border-[#D9C4AC]">
                              {catFatwas.length} ခု
                            </span>
                          </div>
                          <p className="text-xs text-[#7A604D]">
                            {config.description}
                          </p>
                        </div>
                      </div>

                      {/* Compartment Quick Actions */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            setSelectedCategory(catKey);
                            setViewMode('single_category');
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-[#F2E8DB] text-[#633A18] rounded-xl border border-[#D9C4AC] text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>ဤအကန့်သီးသန့်ကြည့်မည်</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Fatwas in this Compartment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {catFatwas.map((item) => (
                        <FatwaCard
                          key={item.id}
                          fatwa={item}
                          isExpanded={expandedFatwaId === item.id}
                          isCopied={copiedFatwaId === item.id}
                          onToggleExpand={() =>
                            setExpandedFatwaId(expandedFatwaId === item.id ? null : item.id)
                          }
                          onOpenModal={() => setActiveModalFatwa(item)}
                          onCopy={() => handleCopyAnswer(item)}
                          telegramDbUrl={telegramDbUrl}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          /* SINGLE CATEGORY GRID VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredFatwas.map((item) => (
              <FatwaCard
                key={item.id}
                fatwa={item}
                isExpanded={expandedFatwaId === item.id}
                isCopied={copiedFatwaId === item.id}
                onToggleExpand={() =>
                  setExpandedFatwaId(expandedFatwaId === item.id ? null : item.id)
                }
                onOpenModal={() => setActiveModalFatwa(item)}
                onCopy={() => handleCopyAnswer(item)}
                telegramDbUrl={telegramDbUrl}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. RECENTLY ASKED QUESTIONS LOG (User submissions) */}
      {submittedList.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border-2 border-[#D9C4AC] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EADFCF]">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#8B5A2B]" />
              <h3 className="text-base sm:text-lg font-bold text-[#34180A]">
                မကြာသေးမီက မေးမြန်းထားသော ဖသ်ဝါမေးခွန်းများ
              </h3>
            </div>
            <span className="text-xs text-[#7A604D]">
              တင်သွင်းထားပြီး: {submittedList.length} ခု
            </span>
          </div>

          <div className="space-y-3">
            {submittedList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#E3D6C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#8B5A2B]/10 text-[#7A491C] font-bold">
                      {FATWA_CATEGORIES_CONFIG[item.category]?.nameMy || item.category}
                    </span>
                    <span className="text-[#8C6D53]">
                      ရက်စွဲ: {item.submittedAt}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                      မုဖ်သီထံ စိစစ်ဆဲ
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#2C1810]">
                    {item.question}
                  </p>
                  <div className="text-[11px] text-[#7A604D]">
                    မေးမြန်းသူ: {item.inquirerName} {item.city ? `(${item.city})` : ''}
                  </div>
                </div>

                <a
                  href={`https://wa.me/959777112233?text=${encodeURIComponent(
                    `မေးမြန်းထားသော ဖသ်ဝါမေးခွန်း အခြေအနေစုံစမ်းရန်:\n${item.question}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1B3F2B] text-[#4ADE80] hover:text-white rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>အခြေအနေ စုံစမ်းမည်</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detail Modal */}
      <FatwaDetailModal
        fatwa={activeModalFatwa}
        isOpen={!!activeModalFatwa}
        onClose={() => setActiveModalFatwa(null)}
        telegramDbUrl={telegramDbUrl}
      />
    </div>
  );
};

// COMPACT / ACCORDION FATWA CARD
interface FatwaCardProps {
  fatwa: FatwaItem;
  isExpanded: boolean;
  isCopied: boolean;
  onToggleExpand: () => void;
  onOpenModal: () => void;
  onCopy: () => void;
  telegramDbUrl: string;
}

const FatwaCard: React.FC<FatwaCardProps> = ({
  fatwa,
  isExpanded,
  isCopied,
  onToggleExpand,
  onOpenModal,
  onCopy,
  telegramDbUrl,
}) => {
  const categoryConfig = FATWA_CATEGORIES_CONFIG[fatwa.category];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#DFD1BF] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Top Bar: Fatwa ID & Verified Seal */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#8C6D53] pb-2 mb-2 border-b border-[#F0E6D8]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF6F0] text-[#7A491C] border border-[#E3D6C5]">
              {fatwa.fatwaNumber}
            </span>
            <span className="text-[11px] text-[#2E6F40] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>စိစစ်ပြီး</span>
            </span>
          </div>

          <span className="text-[11px] text-[#8C7667]">
            {fatwa.answeredDate}
          </span>
        </div>

        {/* Question */}
        <h4
          onClick={onOpenModal}
          className="text-sm sm:text-base font-bold text-[#34180A] hover:text-[#8B5A2B] transition-colors cursor-pointer leading-snug mb-2"
        >
          {fatwa.question}
        </h4>

        {/* Short Summary */}
        <p className="text-xs sm:text-[13px] text-[#5C4033] leading-relaxed line-clamp-3">
          {fatwa.answerSummary}
        </p>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-[#F0E6D8] space-y-3 animate-fadeIn">
            <div className="p-3.5 bg-[#FAF6F0] rounded-xl text-xs sm:text-sm text-[#34180A] leading-relaxed whitespace-pre-line border border-[#E3D6C5]">
              {fatwa.answerDetail}
            </div>

            {/* Kitab Citation */}
            <div className="text-[11px] text-[#7A604D] bg-[#F5EFE6] p-2.5 rounded-lg border border-[#D9C4AC]">
              <span className="font-bold text-[#543014]">ကျမ်းကိုး: </span>
              <span>{fatwa.kitabReference}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#F0E6D8] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenModal}
            className="px-3 py-1.5 bg-[#8B5A2B] hover:bg-[#6E421B] text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>အပြည့်အစုံဖတ်မည်</span>
          </button>

          <button
            onClick={onToggleExpand}
            className="px-2.5 py-1.5 bg-[#FAF6F0] hover:bg-[#F2E8DB] text-[#543825] rounded-lg border border-[#D9C4AC] font-semibold flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>ခေါက်သိမ်းမည်</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>အမြန်ကြည့်</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="p-1.5 text-[#7A604D] hover:text-[#3B1F0E] hover:bg-[#FAF6F0] rounded-lg transition-colors"
            title="အဖြေ ကူးယူမည်"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            href={telegramDbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#229ED9] hover:bg-[#229ED9]/10 rounded-lg transition-colors"
            title="Telegram Database တွင် ကြည့်မည်"
          >
            <Send className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>
    </div>
  );
};
