/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Filter,
  Sparkles,
  Search,
  Bookmark,
  Share2,
  FileQuestion,
  PhoneCall,
  Upload,
  MessageCircle,
  CheckCircle,
  X,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Flame,
  Send,
  FolderKanban,
  LayoutGrid,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  Scroll,
  Scale,
  Landmark,
  HeartHandshake,
  Globe,
  Settings,
} from 'lucide-react';
import { LanguageType, Paper, PaperCategory, PaperRequest } from './types';
import { INITIAL_PAPERS, INITIAL_REQUESTS, CATEGORIES_CONFIG, DEFAULT_TELEGRAM_DB_URL } from './data/initialData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PaperCard } from './components/PaperCard';
import { PaperReaderModal } from './components/PaperReaderModal';
import { UploadPaperModal } from './components/UploadPaperModal';
import { PaperRequestModal } from './components/PaperRequestModal';
import { PaperRequestsBoard } from './components/PaperRequestsBoard';
import { AdminContactSection } from './components/AdminContactSection';
import { AdminContactsModal } from './components/AdminContactsModal';
import { GitHubModal } from './components/GitHubModal';
import { TelegramConfigModal } from './components/TelegramConfigModal';
import { FatwaSection } from './components/FatwaSection';
import { Footer } from './components/Footer';

export default function App() {
  // Papers state (stored in localStorage)
  const [papers, setPapers] = useState<Paper[]>(() => {
    try {
      const saved = localStorage.getItem('ira_papers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAPERS;
  });

  // Requests state (stored in localStorage)
  const [requests, setRequests] = useState<PaperRequest[]>(() => {
    try {
      const saved = localStorage.getItem('ira_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  // Bookmarks state (stored in localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ira_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return ['paper-001', 'paper-004'];
  });

  // Telegram Database base URL (configurable by user/admin)
  const [telegramDbUrl, setTelegramDbUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ira_telegram_db_url');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TELEGRAM_DB_URL;
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<'papers' | 'fatwa' | 'requests' | 'bookmarks' | 'contact'>('papers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PaperCategory | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'downloads' | 'pages'>('recent');
  // View mode: 'categories' separates books cleanly into distinct category shelves
  const [viewMode, setViewMode] = useState<'categories' | 'grid'>('categories');

  // Modals
  const [readerPaper, setReaderPaper] = useState<Paper | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [adminInquiryTopic, setAdminInquiryTopic] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('ira_papers', JSON.stringify(papers));
    } catch (e) {
      console.error(e);
    }
  }, [papers]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_requests', JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_telegram_db_url', telegramDbUrl);
    } catch (e) {
      console.error(e);
    }
  }, [telegramDbUrl]);

  // Toggle Bookmark
  const handleToggleBookmark = (paperId: string) => {
    setBookmarks((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.includes(paperId);
      if (exists) {
        showToast('စာတမ်းအား မှတ်တမ်းမှ ဖယ်ရှားလိုက်ပါပြီ');
        return safePrev.filter((id) => id !== paperId);
      } else {
        showToast('စာတမ်းအား သိမ်းဆည်းမှတ်တမ်းတွင် ထည့်သွင်းပြီးပါပြီ ✓');
        return [...safePrev, paperId];
      }
    });
  };

  // Upload handler
  const handlePaperUploaded = (newPaper: Paper) => {
    setPapers((prev) => [newPaper, ...(Array.isArray(prev) ? prev : [])]);
    showToast(`"${newPaper.title}" စာတမ်းအား အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ ✓`);
    setReaderPaper(newPaper);
  };

  // Request handler
  const handleRequestSubmitted = (newReq: PaperRequest) => {
    setRequests((prev) => [newReq, ...(Array.isArray(prev) ? prev : [])]);
    showToast('စာတမ်းတောင်းဆိုချက်ကို လက်ခံရရှိပါပြီ။ ပညာရှင်များက စစ်ဆေးရှာဖွေပေးပါမည် ✓');
    setCurrentTab('requests');
  };

  // Open Admin Inquiry with specific paper
  const handleOpenAdminInquiryWithPaper = (paper: Paper) => {
    setAdminInquiryTopic(`စာတမ်းအမှတ် ${paper.referenceNumber}: "${paper.title}"`);
    setIsAdminModalOpen(true);
  };

  // Open Admin Inquiry with topic
  const handleOpenAdminInquiryWithTopic = (topic: string) => {
    setAdminInquiryTopic(topic);
    setIsAdminModalOpen(true);
  };

  // Direct Telegram Database redirect: Immediately launches Telegram book post or DB channel!
  const handleOpenTelegram = (paper: Paper) => {
    const url = paper.telegramLink || telegramDbUrl;
    setPapers((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p && p.id === paper.id ? { ...p, readCount: (p.readCount || 0) + 1 } : p
      )
    );
    showToast(`"${paper.title.substring(0, 24)}..." အား Telegram Database တွင် ဖွင့်နေပါသည် ✈️`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Reader Open
  const handleOpenReader = (paper: Paper) => {
    setPapers((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p && p.id === paper.id ? { ...p, readCount: (p.readCount || 0) + 1 } : p
      )
    );
    setReaderPaper(paper);
  };

  // Download increment
  const handlePaperDownloaded = (paperId: string) => {
    setPapers((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p && p.id === paperId ? { ...p, downloadCount: (p.downloadCount || 0) + 1 } : p
      )
    );
  };

  // View fulfilled paper
  const handleViewFulfilledPaper = (paperId: string) => {
    const list = Array.isArray(papers) ? papers : [];
    const found = list.find((p) => p && p.id === paperId);
    if (found) {
      setReaderPaper(found);
    } else {
      showToast('မော်ကွန်းတိုက်မှ စာတမ်းအား ဖွင့်လှစ်နေပါသည်...');
    }
  };

  // Filter & Search Logic safely
  const filteredPapers = useMemo(() => {
    let result = Array.isArray(papers) ? papers : INITIAL_PAPERS;

    // Tab filter for bookmarks
    if (currentTab === 'bookmarks') {
      const bSet = Array.isArray(bookmarks) ? bookmarks : [];
      result = result.filter((p) => p && bSet.includes(p.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p && p.category === selectedCategory);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      result = result.filter((p) => p && p.language === selectedLanguage);
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p &&
          ((p.title || '').toLowerCase().includes(q) ||
            (p.titleOriginalScript && p.titleOriginalScript.toLowerCase().includes(q)) ||
            (p.author || '').toLowerCase().includes(q) ||
            (p.abstract || '').toLowerCase().includes(q) ||
            (Array.isArray(p.tags) && p.tags.some((t) => (t || '').toLowerCase().includes(q))) ||
            (p.referenceNumber || '').toLowerCase().includes(q))
      );
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'popular') return (b.readCount || 0) - (a.readCount || 0);
      if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
      if (sortBy === 'pages') return (b.pages || 0) - (a.pages || 0);
      // Default: recent
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [papers, bookmarks, currentTab, selectedCategory, selectedLanguage, searchQuery, sortBy]);

  // Grouped by categories map for "စာအုပ်တွေကို category တွေသပ်သပ်ခွဲထားမယ်"
  const categorizedPapersMap = useMemo(() => {
    const map: Record<string, Paper[]> = {};
    Object.keys(CATEGORIES_CONFIG).forEach((catKey) => {
      map[catKey] = [];
    });

    filteredPapers.forEach((paper) => {
      if (paper && map[paper.category]) {
        map[paper.category].push(paper);
      }
    });

    return map;
  }, [filteredPapers]);

  // Helper to get category icon component
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'Globe':
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C1810]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#26150C] text-[#FAF7F2] border border-[#229ED9] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-burmese animate-bounce">
          <Send className="w-4 h-4 text-[#229ED9] fill-current shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#D9C4AC] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openUploadModal={() => setIsUploadModalOpen(true)}
        openRequestModal={() => setIsRequestModalOpen(true)}
        openAdminModal={() => {
          setAdminInquiryTopic('');
          setIsAdminModalOpen(true);
        }}
        openGitHubModal={() => setIsGitHubModalOpen(true)}
        openTelegramModal={() => setIsTelegramModalOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      {/* Hero Section (Visible in Papers tab and Bookmarks tab) */}
      {(currentTab === 'papers' || currentTab === 'bookmarks') && (
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          openUploadModal={() => setIsUploadModalOpen(true)}
          openRequestModal={() => setIsRequestModalOpen(true)}
          openAdminModal={() => {
            setAdminInquiryTopic('');
            setIsAdminModalOpen(true);
          }}
          openFatwaTab={() => setCurrentTab('fatwa')}
          totalPapers={papers.length}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB 1: PAPERS REPOSITORY & BOOKMARKS */}
        {(currentTab === 'papers' || currentTab === 'bookmarks') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-burmese">
            {/* Direct Telegram Database Access Banner */}
            <div className="mb-6 bg-gradient-to-r from-[#0C384D] via-[#155370] to-[#1C698D] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#38A4D8]/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Send className="w-6 h-6 fill-white text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base">
                      တရားဝင် Telegram စာအုပ် Database စနစ်
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#229ED9] text-white">
                      Direct Database
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    စာအုပ်တိုင်းကို နှိပ်လိုက်သည်နှင့် <strong>Telegram Database</strong> ထဲသို့ တိုက်ရိုက်ရောက်ရှိ၍ ဖတ်ရှုဒေါင်းလုဒ် ရယူနိုင်ပါသည်။
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                <button
                  onClick={() => setIsTelegramModalOpen(true)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                  title="Telegram Database လင့်ခ် ပြင်ဆင်ရန်"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <a
                  href={telegramDbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>Telegram Database သို့ သွားမည်</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Header info bar for Bookmarks tab */}
            {currentTab === 'bookmarks' && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[#DFD1BF] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#8B5A2B]">
                  <Bookmark className="w-5 h-5 fill-[#8B5A2B]" />
                  <div>
                    <h2 className="text-lg font-bold text-[#2C1810]">
                      သင်သိမ်းဆည်းထားသော စာအုပ်စာတမ်းများ ({bookmarks.length})
                    </h2>
                    <p className="text-xs text-[#7A6353]">Saved Research Treatises</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('papers')}
                  className="px-3.5 py-1.5 text-xs bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#543825] font-semibold rounded-xl border border-[#D9C4AC]"
                >
                  စာတမ်းအားလုံးသို့ ပြန်သွားမည်
                </button>
              </div>
            )}

            {/* Filter and Category Controls */}
            <div className="mb-6 space-y-3">
              {/* Category Quick Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === 'all'
                      ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md'
                      : 'bg-white text-[#5C3B23] border-[#DFD1BF] hover:bg-[#FAF7F2]'
                  }`}
                >
                  ကဏ္ဍအားလုံး (All Categories)
                </button>

                {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => {
                  const isSelected = selectedCategory === key;
                  const count = (categorizedPapersMap[key] || []).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as PaperCategory)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md'
                          : 'bg-white text-[#5C3B23] border-[#DFD1BF] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span>{config.nameMy}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-[#FAF7F2] text-[#8C6D53]'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle & Secondary Controls Bar */}
              <div className="bg-white rounded-xl p-3 border border-[#E5DACB] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                {/* View Mode Toggle: Categorized Shelves vs Grid */}
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#DFD1BF]">
                  <button
                    onClick={() => setViewMode('categories')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'categories'
                        ? 'bg-[#8B5A2B] text-white shadow-sm'
                        : 'text-[#6B4B32] hover:text-[#2C1810]'
                    }`}
                    title="စာအုပ်များကို ကဏ္ဍအလိုက် သပ်သပ်စီခွဲ၍ စာအုပ်စင်များအဖြစ် ကြည့်ရှုရန်"
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>ကဏ္ဍအလိုက် စာအုပ်စင်များ</span>
                  </button>

                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-[#8B5A2B] text-white shadow-sm'
                        : 'text-[#6B4B32] hover:text-[#2C1810]'
                    }`}
                    title="စာအုပ်အားလုံးကို ဇယားကွက်ပြားဖြင့် ကြည့်ရှုရန်"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>ဇယားကွက်ဖြင့် (Grid)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[#735A46]">
                  <Layers className="w-4 h-4 text-[#8B5A2B]" />
                  <span>
                    တွေ့ရှိသော စာအုပ်စာတမ်း:{' '}
                    <strong className="text-[#2C1810] font-mono text-base">{filteredPapers.length}</strong> အုပ်
                  </span>
                  {(selectedCategory !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedLanguage('all');
                        setSearchQuery('');
                      }}
                      className="ml-2 px-2 py-0.5 bg-[#FAF7F2] text-[#8B5A2B] hover:text-[#5C361C] border border-[#D9C4AC] rounded-md font-semibold text-xs"
                    >
                      အားလုံးရှင်းမည် (Reset)
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C7667] flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" /> စီစဉ်ရန်:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#FAF7F2] border border-[#D9C4AC] rounded-lg px-2.5 py-1 text-xs text-[#3B2011] focus:outline-none font-medium"
                  >
                    <option value="recent">နောက်ဆုံးတင်ထားသော စာတမ်းများ</option>
                    <option value="popular">ဖတ်ရှုသူ အများဆုံး (Most Read)</option>
                    <option value="downloads">ဒေါင်းလုဒ် အများဆုံး (Most Downloaded)</option>
                    <option value="pages">စာမျက်နှာ အများဆုံး</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Papers Display Area */}
            {filteredPapers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DFD1BF] p-12 text-center text-[#8C7667]">
                <BookOpen className="w-12 h-12 mx-auto text-[#D4C1AC] mb-3" />
                <h3 className="text-base font-bold text-[#3B2211]">စာအုပ် ရှာမတွေ့ပါ</h3>
                <p className="text-xs text-[#7A6353] mt-1 mb-5">
                  သင်ရှာဖွေလိုသော အချက်အလက်နှင့် ကိုက်ညီသော စာအုပ်မရှိသေးပါ။ အကယ်ဒမီသို့ စာအုပ်တောင်းဆိုချက် တင်သွင်းနိုင်ပါသည်။
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLanguage('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-[#FAF7F2] border border-[#D9C4AC] text-[#543825] rounded-xl text-xs font-semibold"
                  >
                    ရှာဖွေမှု ပြန်လည်ရှင်းလင်းမည်
                  </button>
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="px-4 py-2 bg-[#8B5A2B] text-white rounded-xl text-xs font-semibold shadow"
                  >
                    ဤစာအုပ်ကို တောင်းဆိုမည်
                  </button>
                </div>
              </div>
            ) : viewMode === 'categories' && selectedCategory === 'all' ? (
              /* CATEGORIZED SHELVES VIEW (စာအုပ်များကို ကဏ္ဍအလိုက် သပ်သပ်စီခွဲထားသည့် စာအုပ်စင်များ) */
              <div className="space-y-10">
                {Object.entries(CATEGORIES_CONFIG).map(([catKey, config]) => {
                  const catPapers = categorizedPapersMap[catKey] || [];
                  if (catPapers.length === 0) return null;

                  return (
                    <section
                      key={catKey}
                      className="bg-[#FCFAF7] rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm relative overflow-hidden"
                    >
                      {/* Category Header Shelf Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E8DEC9]">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${config.color} text-white flex items-center justify-center shadow-md`}>
                            {getCategoryIcon(config.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-[#34180A]">
                                {config.nameMy}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B5A2B]/10 text-[#7A491C] border border-[#D9C4AC]">
                                {catPapers.length} အုပ်
                              </span>
                            </div>
                            <p className="text-xs text-[#7A604D]">
                              {config.nameEn}
                            </p>
                          </div>
                        </div>

                        {/* Actions for this category */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => setSelectedCategory(catKey as PaperCategory)}
                            className="px-3 py-1.5 bg-white hover:bg-[#F5EDE1] text-[#633A18] rounded-xl border border-[#D9C4AC] text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="ဤကဏ္ဍတစ်ခုတည်းကို သီးသန့်ရွေးချယ်ကြည့်ရန်"
                          >
                            <span>ဤကဏ္ဍသီးသန့်ကြည့်မည်</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={telegramDbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                            title="ဤကဏ္ဍရှိ စာအုပ်များအား Telegram Database တွင် တိုက်ရိုက်ရှာဖွေရန်"
                          >
                            <Send className="w-3 h-3 fill-white" />
                            <span>Telegram Database</span>
                          </a>
                        </div>
                      </div>

                      {/* Books Cards Grid within this Category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catPapers.map((paper) => (
                          <PaperCard
                            key={paper.id}
                            paper={paper}
                            isBookmarked={bookmarks.includes(paper.id)}
                            onToggleBookmark={handleToggleBookmark}
                            onOpenReader={handleOpenReader}
                            onOpenAdminInquiry={handleOpenAdminInquiryWithPaper}
                            onOpenTelegram={handleOpenTelegram}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              /* REGULAR GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isBookmarked={bookmarks.includes(paper.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenReader={handleOpenReader}
                    onOpenAdminInquiry={handleOpenAdminInquiryWithPaper}
                    onOpenTelegram={handleOpenTelegram}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FATWA & FIQH ("ဖသ်ဝါနေရာကိုဝင်တာနဲ့မေးမဲ့နေရာရှိရမယ် ဖြေထားပြီးသားတွေကိုလဲအကန့်လေးတွေနဲ့ပြပေးရမယ်") */}
        {currentTab === 'fatwa' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FatwaSection
              telegramDbUrl={telegramDbUrl}
              onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: REQUESTS BOARD ("လိုချင်တာတွေကိုတင်နိုင်မယ်") */}
        {currentTab === 'requests' && (
          <PaperRequestsBoard
            requests={requests}
            onOpenNewRequestModal={() => setIsRequestModalOpen(true)}
            onOpenAdminInquiryWithTopic={handleOpenAdminInquiryWithTopic}
            onViewFulfilledPaper={handleViewFulfilledPaper}
            papers={papers}
          />
        )}

        {/* TAB 3: ADMIN CONTACT SECTION */}
        {currentTab === 'contact' && (
          <AdminContactSection
            initialTopic={adminInquiryTopic}
            onClose={() => setCurrentTab('papers')}
            isModal={false}
          />
        )}
      </main>

      {/* Floating Fast WhatsApp Admin Button */}
      <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* Floating Telegram Database Fast Button */}
        <a
          href={telegramDbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-full shadow-xl border-2 border-white hover:scale-105 transition-all text-xs font-semibold font-burmese"
          title="Telegram Database တိုက်ရိုက်ဝင်ရောက်ရန်"
        >
          <Send className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">Telegram Database</span>
        </a>

        {/* WhatsApp Admin Button */}
        <button
          onClick={() => {
            setAdminInquiryTopic('');
            setIsAdminModalOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-full shadow-2xl border-2 border-[#2E7D4E] hover:scale-105 transition-all group"
          title="WhatsApp Admin တိုက်ရိုက်ဆက်သွယ်ရန်"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
          </div>
          <span className="font-burmese text-xs sm:text-sm font-semibold pr-1">
            WhatsApp Admin
          </span>
        </button>
      </aside>

      {/* Modals */}
      <PaperReaderModal
        paper={readerPaper}
        onClose={() => setReaderPaper(null)}
        onOpenAdminInquiry={handleOpenAdminInquiryWithPaper}
        onPaperDownloaded={handlePaperDownloaded}
      />

      <UploadPaperModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPaperUploaded={handlePaperUploaded}
      />

      <PaperRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSubmitted={handleRequestSubmitted}
      />

      <AdminContactsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        initialTopic={adminInquiryTopic}
      />

      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <TelegramConfigModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        currentUrl={telegramDbUrl}
        onSaveUrl={(newUrl) => {
          setTelegramDbUrl(newUrl);
          showToast('Telegram Database လင့်ခ်အား အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ ✓');
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('papers');
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
        openAdminModal={() => {
          setAdminInquiryTopic('');
          setIsAdminModalOpen(true);
        }}
        openUploadModal={() => setIsUploadModalOpen(true)}
        openRequestModal={() => setIsRequestModalOpen(true)}
        openFatwaSection={() => {
          setCurrentTab('fatwa');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
