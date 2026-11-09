import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Link2,
  BookOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  Share2,
  FileText,
  Bookmark,
  Layers,
} from 'lucide-react';
import { Paper, PaperCategory, LanguageType } from '../types';
import { CATEGORIES_CONFIG, DEFAULT_TELEGRAM_DB_URL } from '../data/initialData';

interface TelegramPostLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  papers: Paper[];
  initialPaperId?: string | null;
  onAddNewPaperFromTelegram: (paper: Paper) => void;
  onSelectPaperToRead: (paper: Paper) => void;
  onUpdatePaperTelegramLink?: (paperId: string, telegramLink: string) => void;
  telegramDbUrl: string;
}

export const TelegramPostLinkModal: React.FC<TelegramPostLinkModalProps> = ({
  isOpen,
  onClose,
  papers,
  initialPaperId,
  onAddNewPaperFromTelegram,
  onSelectPaperToRead,
  onUpdatePaperTelegramLink,
  telegramDbUrl,
}) => {
  const [mode, setMode] = useState<'existing' | 'new_telegram'>('existing');

  // Existing paper selector state
  const [selectedPaperId, setSelectedPaperId] = useState<string>(
    initialPaperId || (papers[0]?.id ?? '')
  );
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [customTelegramPostLink, setCustomTelegramPostLink] = useState('');

  // New telegram book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<PaperCategory>('fiqh_fatwa');
  const [newLanguage, setNewLanguage] = useState<LanguageType>('myanmar');
  const [newTelegramLink, setNewTelegramLink] = useState('');
  const [newPages, setNewPages] = useState<number>(35);
  const [newAbstract, setNewAbstract] = useState('');
  const [rawTelegramPost, setRawTelegramPost] = useState('');

  // Copy success states
  const [copiedWebLink, setCopiedWebLink] = useState(false);
  const [copiedTelegramPost, setCopiedTelegramPost] = useState(false);
  const [copiedTelegramLinkOnly, setCopiedTelegramLinkOnly] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Sync initialPaperId when modal opens
  useEffect(() => {
    if (initialPaperId) {
      setSelectedPaperId(initialPaperId);
      setMode('existing');
    } else if (papers.length > 0 && !selectedPaperId) {
      setSelectedPaperId(papers[0].id);
    }
  }, [initialPaperId, isOpen, papers]);

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  // Update custom link when current paper changes
  useEffect(() => {
    if (currentPaper) {
      setCustomTelegramPostLink(currentPaper.telegramLink || '');
    }
  }, [currentPaper?.id, currentPaper?.telegramLink]);

  if (!isOpen) return null;

  const handleSaveCustomTelegramLink = () => {
    if (!currentPaper) return;
    const linkToSave = customTelegramPostLink.trim();
    if (onUpdatePaperTelegramLink) {
      onUpdatePaperTelegramLink(currentPaper.id, linkToSave);
    }
    setSuccessBanner(
      linkToSave
        ? `"${currentPaper.title}" အတွက် Telegram Post Link အား အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ ✓`
        : `"${currentPaper.title}" အတွက် Telegram Link အား ပင်မ Channel လင့်ခ်အဖြစ် သတ်မှတ်ပြီးပါပြီ ✓`
    );
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  // Helper to compute direct web link
  const getDirectWebLink = (paperId: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?paper=${encodeURIComponent(paperId)}`;
  };

  // Build the Telegram broadcast caption
  const generateTelegramCaption = (paper: Paper) => {
    const directWebUrl = getDirectWebLink(paper.id);
    const categoryName = CATEGORIES_CONFIG[paper.category]?.nameMy || paper.category;
    const tgUrl = paper.telegramLink || telegramDbUrl;

    return `📚 စာအုပ်အမည် - ${paper.title}
✍️ ရေးသားသူ - ${paper.author}${paper.authorTitle ? ` (${paper.authorTitle})` : ''}
📂 ကဏ္ဍ - ${categoryName}
📖 စာမျက်နှာ - ${paper.pages} မျက်နှာ (${paper.fileSize || 'PDF'})
🔖 မှတ်ပုံတင်အမှတ် - ${paper.referenceNumber}

🌐 ဝဘ်ဆိုက်တွင် စာအုပ်အား တိုက်ရိုက်ဖတ်ရှုရန် Web Link:
👉 ${directWebUrl}

📥 Telegram Database မှ တိုက်ရိုက်ဒေါင်းလုဒ်ရယူရန် Link:
👉 ${tgUrl}

အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy)`;
  };

  const handleCopyWebLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedWebLink(true);
    setTimeout(() => setCopiedWebLink(false), 2200);
  };

  const handleCopyTelegramPost = (postText: string) => {
    navigator.clipboard.writeText(postText);
    setCopiedTelegramPost(true);
    setTimeout(() => setCopiedTelegramPost(false), 2200);
  };

  const handleCopyTelegramLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedTelegramLinkOnly(true);
    setTimeout(() => setCopiedTelegramLinkOnly(false), 2200);
  };

  const handleShareDirectlyToTelegram = (postText: string) => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      getDirectWebLink(currentPaper?.id || '')
    )}&text=${encodeURIComponent(postText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Smart parser: Extract book info from pasted raw telegram post text
  const handleSmartParseRawText = () => {
    if (!rawTelegramPost.trim()) return;

    const text = rawTelegramPost;

    // Extract title
    const titleMatch =
      text.match(/(?:စာအုပ်အမည်|ခေါင်းစဉ်|ကျမ်းအမည်|Title|Book)[\s:=-]+([^\n\r]+)/i) ||
      text.match(/^[1-9]\.?\s*([^\n\r]+)/m);
    if (titleMatch && titleMatch[1]) {
      setNewTitle(titleMatch[1].trim());
    }

    // Extract author
    const authorMatch = text.match(/(?:ရေးသားသူ|စာရေးသူ|မုဖ်သီ|Author|Writer)[\s:=-]+([^\n\r]+)/i);
    if (authorMatch && authorMatch[1]) {
      setNewAuthor(authorMatch[1].trim());
    }

    // Extract telegram link
    const tgMatch = text.match(/(https?:\/\/t\.me\/[a-zA-Z0-9_+/]+)/i);
    if (tgMatch && tgMatch[1]) {
      setNewTelegramLink(tgMatch[1].trim());
    }

    // Extract pages
    const pagesMatch = text.match(/([0-9]{1,4})\s*(?:မျက်နှာ|Pages|page)/i);
    if (pagesMatch && pagesMatch[1]) {
      setNewPages(parseInt(pagesMatch[1], 10));
    }

    setSuccessBanner('တယ်လီဂရမ် စာသားမှ အချက်အလက်များအား အလိုအလျောက် ခွဲခြမ်းဖြည့်သွင်းပြီးပါပြီ ✓');
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  // Create new paper from telegram input
  const handleCreateFromTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) {
      alert('ကျေးဇူးပြု၍ စာအုပ်အမည်နှင့် စာရေးသူအမည် ထည့်သွင်းပေးပါ');
      return;
    }

    const uniqueId = `paper-tg-${Date.now()}`;
    const newPaper: Paper = {
      id: uniqueId,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      authorTitle: 'အစ္စလာမ့် သုတေသီ / စာရေးဆရာ',
      category: newCategory,
      language: newLanguage,
      publicationYear: new Date().getFullYear(),
      abstract:
        newAbstract.trim() ||
        `${newTitle} စာအုပ်သည် Telegram Database မှ တိုက်ရိုက်တင်သွင်းထားပြီး စာဖတ်သူများ ဝဘ်နှင့် တယ်လီဂရမ် နှစ်ခုစလုံးမှ အလွယ်တကူ ဖတ်ရှုဒေါင်းလုဒ် ရယူနိုင်ပါသည်။`,
      fullContent: `${newTitle}\n\nရေးသားသူ: ${newAuthor}\n\nTelegram Link: ${
        newTelegramLink || telegramDbUrl
      }\n\n(ဤစာအုပ်အား Telegram Database ချိတ်ဆက်မှုဖြင့် အစ္စလာမ့် သုတေသန အကယ်ဒမီ စာကြည့်တိုက်သို့ တိုက်ရိုက်တင်သွင်းထားပါသည်။)`,
      tags: ['Telegram စာအုပ်', CATEGORIES_CONFIG[newCategory]?.nameMy || 'သုတေသန'],
      pages: newPages || 30,
      downloadCount: 0,
      readCount: 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileFormat: 'PDF',
      fileSize: '3.2 MB',
      isVerifiedByAcademy: true,
      referenceNumber: `IRA-TG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      telegramLink: newTelegramLink.trim() || telegramDbUrl,
    };

    onAddNewPaperFromTelegram(newPaper);
    setSelectedPaperId(newPaper.id);
    setMode('existing');
    setSuccessBanner(
      `"${newPaper.title}" အား ဝဘ်ဆိုက်ထဲသို့ ထည့်သွင်းပြီး တိုက်ရိုက်လင့်ခ် ထုတ်ပေးလိုက်ပါပြီ ✓`
    );
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const filteredPapers = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in font-burmese">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#006699] via-[#229ED9] to-[#0E5276] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Send className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Telegram Post & Web တိုက်ရိုက်လင့်ခ် ထုတ်ပေးစနစ်
                </h2>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  Direct Link Engine
                </span>
              </div>
              <p className="text-xs text-white/90">
                တယ်လီဂရမ်တွင် တင်လိုက်သည်နှင့် Web စာအုပ်ဆီ တန်းရောက်မည့် Link နှင့် Post Caption ထုတ်ပေးခြင်း
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8DEC9] bg-[#FAF7F2] p-1.5 gap-1.5">
          <button
            onClick={() => setMode('existing')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'existing'
                ? 'bg-white text-[#0B4F6C] shadow-sm border border-[#CFE4F0]'
                : 'text-[#6B5A4D] hover:bg-[#F2ECE1]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#229ED9]" />
            <span>စာကြည့်တိုက်ရှိ စာအုပ်များမှ Link ထုတ်ယူရန်</span>
            <span className="text-[11px] bg-[#E8F4FD] text-[#0B4F6C] px-2 py-0.5 rounded-full font-mono">
              {papers.length}
            </span>
          </button>

          <button
            onClick={() => setMode('new_telegram')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'new_telegram'
                ? 'bg-white text-[#0B4F6C] shadow-sm border border-[#CFE4F0]'
                : 'text-[#6B5A4D] hover:bg-[#F2ECE1]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#229ED9]" />
            <span>Telegram Post မှ Web သို့ ထည့်ပြီး Link ထုတ်မည်</span>
          </button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="mx-6 mt-4 p-3 bg-[#E8F8F0] border border-[#A7E8C4] rounded-xl flex items-center gap-2 text-xs sm:text-sm text-[#1B5E34] animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {mode === 'existing' ? (
            /* Mode 1: Existing Book Link & Post Generator */
            <div className="space-y-5">
              {/* Book Selector */}
              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1.5 flex items-center justify-between">
                  <span>၁။ စာအုပ်ရွေးချယ်ပါ (Select Book)</span>
                  <span className="text-[11px] text-[#7A6353] font-normal">
                    စာအုပ် {papers.length} အုပ် ရရှိနိုင်ပါသည်
                  </span>
                </label>

                {/* Quick Search inside modal */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#998375]" />
                  <input
                    type="text"
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    placeholder="စာအုပ်အမည် သို့မဟုတ် စာရေးသူအမည်ဖြင့် ရှာဖွေပါ..."
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#DECCB5] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>

                <select
                  value={selectedPaperId}
                  onChange={(e) => setSelectedPaperId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9] shadow-sm"
                >
                  {filteredPapers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.author} ({CATEGORIES_CONFIG[p.category]?.nameMy || p.category})
                    </option>
                  ))}
                </select>
              </div>

              {currentPaper && (
                <>
                  {/* Generated Direct Web Link Box */}
                  <div className="p-4 bg-gradient-to-br from-[#F0F8FD] to-[#E5F3FC] rounded-2xl border border-[#BCE1F6] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#0088CC]" />
                        <span className="text-xs font-bold text-[#0B4F6C]">
                          ဤစာအုပ်သို့ တန်းရောက်မည့် Direct Web Link
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#0088CC] text-white px-2 py-0.5 rounded-full font-mono">
                        Instant Web Direct
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#B8DDF2] p-1.5 shadow-inner">
                      <input
                        type="text"
                        readOnly
                        value={getDirectWebLink(currentPaper.id)}
                        className="flex-1 px-2 text-xs sm:text-sm font-mono text-[#0B4F6C] bg-transparent outline-none truncate"
                      />
                      <button
                        onClick={() => handleCopyWebLink(getDirectWebLink(currentPaper.id))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          copiedWebLink
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#229ED9] hover:bg-[#1B8BBF] text-white'
                        }`}
                        title="Web Link ကူးယူရန်"
                      >
                        {copiedWebLink ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>ကူးပြီး ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Link ကူးမည်</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-[11px] text-[#296D8C] leading-relaxed">
                      💡 ဤ Link အား နှိပ်လိုက်သူတိုင်း Web စာမျက်နှာဖွင့်ပြီးသည်နှင့် ဤစာအုပ်အသေးစိတ် ဖတ်ရှုရန်နေရာသို့ တန်းရောက်ရှိပါမည်။
                    </p>
                  </div>

                  {/* Two-Way Sync: Telegram Channel Post Link Manager */}
                  <div className="p-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-2xl border border-[#86EFAC] shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#16A34A]" />
                        <span className="text-xs font-bold text-[#14532D]">
                          Telegram Channel Post Link ထည့်သွင်းသိမ်းဆည်းရန်
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full font-semibold">
                        Two-Way Sync (Web ↔ Telegram)
                      </span>
                    </div>

                    <p className="text-[11px] text-[#166534] mb-2.5 leading-relaxed">
                      Telegram Channel တွင် ပို့စ်တင်ပြီးပါက ထို Post ၏ Link (ဥပမာ <span className="font-mono font-semibold">https://t.me/channel_name/123</span>) ကို ဤနေရာတွင် သိမ်းထားနိုင်ပါသည်။ ဝဘ်ဆိုက်ရှိ ခလုတ်နှိပ်သူတိုင်း Telegram Channel ရှိ ဤပို့စ်ဆီသို့ တိုက်ရိုက်ရောက်သွားပါမည်။
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="url"
                        value={customTelegramPostLink}
                        onChange={(e) => setCustomTelegramPostLink(e.target.value)}
                        placeholder="https://t.me/channel_name/123 သို့မဟုတ် Channel Link..."
                        className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono text-[#14532D] bg-white border border-[#86EFAC] rounded-xl outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] shadow-inner"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveCustomTelegramLink}
                          className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                          title="ဤစာအုပ်အတွက် Telegram Link ကို သိမ်းမည်"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>လင့်ခ် သိမ်းမည်</span>
                        </button>

                        <a
                          href={customTelegramPostLink.trim() || currentPaper.telegramLink || telegramDbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-[#229ED9] hover:bg-[#1B8BBF] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                          title="Telegram Channel/Post သို့ တိုက်ရိုက်သွားရောက် စမ်းသပ်ရန်"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Channel သို့ သွားမည်</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-Post Telegram Broadcast Caption */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DFD1BF]">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#229ED9]" />
                        <span className="text-xs font-bold text-[#3B2211]">
                          Telegram တွင် တင်ရန် အသင့်ရေးသားပြီး Post Caption
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyTelegramPost(generateTelegramCaption(currentPaper))}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            copiedTelegramPost
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#8B5A2B] hover:bg-[#70421B] text-white'
                          }`}
                        >
                          {copiedTelegramPost ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Post စာသား ကူးပြီးပါပြီ ✓</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Telegram Post အပြည့်အစုံ ကူးမည်</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleShareDirectlyToTelegram(generateTelegramCaption(currentPaper))
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#229ED9] hover:bg-[#1B8BBF] text-white shadow-sm transition-all"
                          title="Telegram App သို့ တိုက်ရိုက်ပို့စ်တင်ရန်"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Telegram သို့ တန်းတင်မည်</span>
                        </button>
                      </div>
                    </div>

                    {/* Formatted Text Box */}
                    <div className="relative">
                      <pre className="p-3.5 bg-white rounded-xl border border-[#D9C4AC] text-xs sm:text-sm text-[#2C1810] font-burmese whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-sans select-all">
                        {generateTelegramCaption(currentPaper)}
                      </pre>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E8DEC9] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#7A6353]">
                        <span>Telegram Database Link:</span>
                        <a
                          href={currentPaper.telegramLink || telegramDbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#229ED9] hover:underline font-mono truncate max-w-[200px] sm:max-w-xs flex items-center gap-1"
                        >
                          <span>{currentPaper.telegramLink || telegramDbUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          onSelectPaperToRead(currentPaper);
                          onClose();
                        }}
                        className="text-[#8B5A2B] hover:text-[#5C361C] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>ဝဘ်ဆိုက်တွင် ဤစာအုပ်အား ဖွင့်ကြည့်မည်</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Mode 2: Quick Add from Telegram and Generate Link */
            <form onSubmit={handleCreateFromTelegram} className="space-y-4">
              {/* Smart Auto Parse Box */}
              <div className="p-4 bg-[#F2F8FD] rounded-2xl border border-[#CCE5F7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F6C]">
                    <Sparkles className="w-4 h-4 text-[#229ED9]" />
                    <span>Telegram Post မှ စာသားကူးထည့်ပြီး အလိုအလျောက် ခွဲထုတ်ယူပါ (Auto Parse)</span>
                  </div>
                  <span className="text-[10px] text-[#0088CC] bg-white px-2 py-0.5 rounded-md font-medium border border-[#BDE0FE]">
                    အမြန်ဖတ်စနစ်
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={rawTelegramPost}
                  onChange={(e) => setRawTelegramPost(e.target.value)}
                  placeholder="Telegram မှ စာသားကို ဤနေရာတွင် paste လုပ်ပါ (ဥပမာ- စာအုပ်အမည် - ... / ရေးသူ - ... / Link - https://t.me/...)"
                  className="w-full p-2.5 bg-white border border-[#BDE0FE] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                />
                <button
                  type="button"
                  onClick={handleSmartParseRawText}
                  className="px-3.5 py-1.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>စာသားမှ အချက်အလက်များကို အလိုအလျောက် ဖြည့်သွင်းပါ</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာအုပ်အမည် (Book Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ဥပမာ- နမားဇ်ဆိုင်ရာ ဓမ္မသတ်ကျမ်း"
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာရေးသူ / ဆရာကြီးအမည် (Author) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="ဥပမာ- မုဖ်သီ အဗ္ဗဒုလ်ကာဒိရ်"
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    Telegram Message / File Link (တိုက်ရိုက်လင့်ခ်)
                  </label>
                  <input
                    type="url"
                    value={newTelegramLink}
                    onChange={(e) => setNewTelegramLink(e.target.value)}
                    placeholder="https://t.me/YourChannel/123"
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ကဏ္ဍ (Category)
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PaperCategory)}
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  >
                    {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.nameMy} ({config.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ဘာသာစကား (Language)
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as LanguageType)}
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  >
                    <option value="myanmar">မြန်မာဘာသာ (Myanmar)</option>
                    <option value="arabic">العربية (Arabic)</option>
                    <option value="urdu">اردو (Urdu)</option>
                    <option value="english">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာမျက်နှာ (Pages)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPages}
                    onChange={(e) => setNewPages(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာအုပ်အကျဉ်းချုပ် (Abstract - အချဉ်းချုပ်ဖော်ပြချက်)
                  </label>
                  <textarea
                    rows={2}
                    value={newAbstract}
                    onChange={(e) => setNewAbstract(e.target.value)}
                    placeholder="စာအုပ်အကြောင်း အကျဉ်းချုပ်ဖော်ပြချက် ရေးနိုင်ပါသည်..."
                    className="w-full px-3.5 py-2 bg-white border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#665345] hover:bg-[#F2ECE1] transition-colors"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#229ED9] hover:bg-[#1B8BBF] text-white shadow-md flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Web သို့ ထည့်သွင်းပြီး Direct Link ထုတ်မည်</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E8DEC9] flex flex-wrap items-center justify-between text-[11px] text-[#7A6353]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Web Direct Link သည် ကလစ်တစ်ချက်ဖြင့် စာအုပ်ဆီ တန်းရောက်ပါသည်</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B5A2B] hover:text-[#5C361C] font-semibold underline"
          >
            ပိတ်မည်
          </button>
        </div>
      </div>
    </div>
  );
};
