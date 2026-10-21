import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookMarked,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { LanguageType, Paper, PaperCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface UploadPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperUploaded: (newPaper: Paper) => void;
}

export const UploadPaperModal: React.FC<UploadPaperModalProps> = ({
  isOpen,
  onClose,
  onPaperUploaded,
}) => {
  const [title, setTitle] = useState('');
  const [titleOriginalScript, setTitleOriginalScript] = useState('');
  const [author, setAuthor] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [category, setCategory] = useState<PaperCategory>('fiqh_fatwa');
  const [language, setLanguage] = useState<LanguageType>('myanmar');
  const [abstract, setAbstract] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [filePages, setFilePages] = useState(25);
  const [telegramLink, setTelegramLink] = useState('');
  const [submitterContact, setSubmitterContact] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
      // Estimated pages based on size
      setFilePages(Math.max(12, Math.min(120, Math.floor(file.size / 50000))));

      // If user uploaded a text file, prefill content
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFullContent(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('ကျေးဇူးပြု၍ စာတမ်းခေါင်းစဉ် ထည့်သွင်းပေးပါ');
      return;
    }
    if (!author.trim()) {
      setError('ကျေးဇူးပြု၍ စာရေးသူ/သုတေသီအမည် ထည့်သွင်းပေးပါ');
      return;
    }
    if (!abstract.trim()) {
      setError('ကျေးဇူးပြု၍ စာတမ်းအကျဉ်းချုပ် (Abstract) ရေးသားပေးပါ');
      return;
    }

    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['သာသနာရေးရာ', 'သုတေသန'];

    const newPaper: Paper = {
      id: `paper-user-${Date.now()}`,
      title: title.trim(),
      titleOriginalScript: titleOriginalScript.trim() || undefined,
      author: author.trim(),
      authorTitle: authorTitle.trim() || 'အစ္စလာမ့် သုတေသီ',
      category,
      language,
      publicationYear: new Date().getFullYear(),
      abstract: abstract.trim(),
      fullContent:
        fullContent.trim() ||
        `${title}\n\nစာရေးသူ - ${author}\n\n${abstract}\n\n(ဤစာတမ်းအား အစ္စလာမ့် သုတေသန အကယ်ဒမီသို့ တိုက်ရိုက်တင်သွင်းထားပြီး မကြာမီ စာကြည့်တိုက်မှူးမှ စိစစ်အတည်ပြုချက် ထုတ်ပြန်ပေးမည် ဖြစ်ပါသည်။)`,
      tags,
      pages: filePages || 20,
      downloadCount: 0,
      readCount: 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileFormat: fileName.endsWith('.docx') ? 'DOCX' : 'PDF',
      fileSize: fileName ? fileSize : '1.8 MB',
      isVerifiedByAcademy: false, // will show as newly uploaded
      referenceNumber: `IRA-SUB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      telegramLink: telegramLink.trim() || undefined,
    };

    onPaperUploaded(newPaper);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in font-burmese">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2C1810] to-[#422312] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B5A2B]/40 rounded-xl border border-[#D9A86B]/30">
              <Upload className="w-5 h-5 text-[#F5E2C8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">သာသနာရေးရာ သုတေသနစာတမ်း တင်သွင်းရန်</h2>
              <p className="text-xs text-[#D9C4AC]">Submit Religious Research Treatise & Papers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D9C4AC] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DEC9] text-xs text-[#6E4F38] space-y-1">
            <div className="font-semibold text-[#8B5A2B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> စာတမ်းတင်သွင်းရာတွင် လိုက်နာရမည့် စည်းကမ်းချက်များ
            </div>
            <p>
              • အစ္စလာမ်သာသနာတော်နှင့် သက်ဆိုင်သော ကုရ်အာန်၊ ဟဒီးစ်၊ ဖိကဟ်၊ သမိုင်းနှင့် အသိပညာပေး စာတမ်းများကို
              မြန်မာ၊ အာရဗီ၊ အူရ်ဒူ သို့မဟုတ် အင်္ဂလိပ်ဘာသာဖြင့် တင်သွင်းနိုင်ပါသည်။
            </p>
            <p>• တင်သွင်းပြီးပါက အကယ်ဒမီ စာတမ်းစိစစ်ရေးမှူးများက စစ်ဆေး၍ မော်ကွန်းတိုက်တွင် ထည့်သွင်းပေးပါမည်။</p>
          </div>

          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              စာတမ်းခေါင်းစဉ် (Paper Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ဥပမာ - မျက်မှောက်ခေတ် အစ္စလာမ့်စီးပွားရေးဆိုင်ရာ သုတေသနစာတမ်း..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
            />
          </div>

          {/* Row 1.5: Original Title (Arabic/Urdu) */}
          <div>
            <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
              မူရင်းဘာသာစကားဖြင့် ခေါင်းစဉ် (Original Arabic / Urdu Title - ရွေးချယ်နိုင်သည်)
            </label>
            <input
              type="text"
              value={titleOriginalScript}
              onChange={(e) => setTitleOriginalScript(e.target.value)}
              placeholder="مثال: بحوث فقهية معاصرة / جدید فقہی مسائل اور حل"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] font-arabic"
            />
          </div>

          {/* Row 2: Author & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                စာရေးသူ / သုတေသီ အမည် (Author Name) *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="ဥပမာ - မော်လဝီ မုဟမ္မဒ် အာရစ်ဖ်..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
                ရာထူး / ပညာရေးဘွဲ့ (Designation / Title)
              </label>
              <input
                type="text"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                placeholder="ဥပမာ - ဖသ်ဝါကောင်စီဝင် / အစ္စလာမ့်ဓမ္မပါရဂူ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>
          </div>

          {/* Row 3: Category & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                ကဏ္ဍ / ဘာသာရပ်ခွဲ (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PaperCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] bg-white"
              >
                {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.nameMy} ({config.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                အဓိက ဘာသာစကား (Language & Font) *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] bg-white"
              >
                <option value="myanmar">မြန်မာဘာသာ (Myanmar Unicode)</option>
                <option value="arabic">العربية (Al Qalam Font)</option>
                <option value="urdu">اردو (Jameel Noori Nastaleeq)</option>
                <option value="english">English (Scholarly Typography)</option>
              </select>
            </div>
          </div>

          {/* Row 4: File Upload Simulation */}
          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              စာတမ်းဖိုင်ရွေးချယ်ရန် (Attach PDF / DOCX file)
            </label>
            <div className="border-2 border-dashed border-[#D9C8B4] rounded-xl p-4 text-center hover:border-[#8B5A2B] transition-colors bg-[#FAF7F2]">
              <input
                type="file"
                id="paper-file-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />
              <label
                htmlFor="paper-file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <Upload className="w-6 h-6 text-[#8B5A2B]" />
                <span className="text-xs sm:text-sm font-semibold text-[#663A14]">
                  {fileName ? `ရွေးချယ်ထားသောဖိုင်: ${fileName} (${fileSize})` : 'ဖိုင်ရွေးရန် နှိပ်ပါ (သို့မဟုတ် ဖိုင်ဆွဲထည့်ပါ)'}
                </span>
                <span className="text-[11px] text-[#8C7667]">PDF, DOCX, DOC, TXT (အများဆုံး 25MB)</span>
              </label>
            </div>
          </div>

          {/* Row 5: Abstract */}
          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              စာတမ်းအကျဉ်းချုပ် (Abstract / Summary) *
            </label>
            <textarea
              required
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="စာတမ်း၏ အဓိက လေ့လာဆွေးနွေးချက်၊ ရလဒ်များနှင့် အနှစ်ချုပ်ကို အကျဉ်းချုပ်ဖော်ပြပါ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
            ></textarea>
          </div>

          {/* Row 6: Full Text Content (Optional or paste text) */}
          <div>
            <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
              စာတမ်းအပြည့်အစုံ (သို့မဟုတ် နိဒါန်းအစပိုင်း ကူးထည့်ရန်)
            </label>
            <textarea
              rows={4}
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              placeholder="စာဖတ်သူများ online တွင် ချက်ချင်းဖတ်ရှုနိုင်ရန် စာတမ်းစာသားများကို ဤနေရာတွင် ထည့်သွင်းနိုင်ပါသည်..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] font-sans"
            ></textarea>
          </div>

          {/* Row 7: Tags & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
                သော့ချက်စကားလုံးများ (Keywords/Tags - ကော်မာခြား၍)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ဥပမာ - ဖိကဟ်, အတိုးမဲ့ဘဏ်, ရှရီအသ်"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
                တင်သွင်းသူ ဆက်သွယ်ရန် ဖုန်း / WhatsApp
              </label>
              <input
                type="text"
                value={submitterContact}
                onChange={(e) => setSubmitterContact(e.target.value)}
                placeholder="09-xxxxxxxxx သို့မဟုတ် +959xxxxxxxxx"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>
          </div>

          {/* Row 8: Telegram Database Direct Link */}
          <div className="bg-[#EBF7FD] p-3.5 rounded-xl border border-[#BCE4F7]">
            <label className="block text-xs font-bold text-[#0D628B] mb-1 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#229ED9]" />
              <span>Telegram Database Link (Telegram စာအုပ်ဒေတာဘေ့စ် တိုက်ရိုက်လင့်ခ်)</span>
            </label>
            <input
              type="url"
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/IslamicResearchAcademy_DB/... သို့မဟုတ် Telegram Post Link"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#A6D8F0] focus:outline-none focus:border-[#229ED9] text-xs font-mono text-[#0D4460] bg-white"
            />
            <p className="text-[11px] text-[#2B799E] mt-1">
              * စာဖတ်သူများသည် ဤစာအုပ်ကို နှိပ်လိုက်သည်နှင့် သင်ထည့်ထားသော Telegram Database သို့ တန်းရောက်သွားပါမည်။
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#DFD1BF] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#735A46] hover:text-[#3B1E08] font-medium"
          >
            ပယ်ဖျက်မည်
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5A2B] hover:bg-[#6E421C] text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>စာတမ်းတင်သွင်းမည် (Submit Paper)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
