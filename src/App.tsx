/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Bookmark,
  Send,
  FolderKanban,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  Compass,
  Scroll,
  Scale,
  Landmark,
  HeartHandshake,
  Globe,
  MessageCircle,
  X,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { LanguageType, Paper, PaperCategory, UserSubmittedFatwa, AdminContact } from './types';
import { INITIAL_PAPERS, INITIAL_ADMIN_CONTACTS, CATEGORIES_CONFIG, DEFAULT_TELEGRAM_DB_URL } from './data/initialData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PaperCard } from './components/PaperCard';
import { PaperReaderModal } from './components/PaperReaderModal';
import { UploadPaperModal } from './components/UploadPaperModal';
import { AdminContactSection } from './components/AdminContactSection';
import { AdminContactsModal } from './components/AdminContactsModal';
import { GitHubModal } from './components/GitHubModal';
import { TelegramConfigModal } from './components/TelegramConfigModal';
import { TelegramPostLinkModal } from './components/TelegramPostLinkModal';
import { FatwaSection } from './components/FatwaSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import {
  savePaperToFirestore,
  deletePaperFromFirestore,
  subscribeToPapers,
  saveTelegramChannelUrlToFirestore,
  subscribeToTelegramChannelUrl,
  updatePaperTelegramLinkInFirestore,
  updateFatwaInquiryStatusInFirestore,
  answerFatwaInquiryInFirestore,
  deleteFatwaInquiryFromFirestore,
  subscribeToFatwaInquiries,
  saveAdminPinToFirestore,
  subscribeToAdminPin,
  saveTeamMemberToFirestore,
  deleteTeamMemberFromFirestore,
  subscribeToTeamMembers,
} from './services/firestoreService';

export default function App() {
  // Papers state (stored in localStorage, filtering out legacy demo mock items)
  const [papers, setPapers] = useState<Paper[]>(() => {
    try {
      const saved = localStorage.getItem('ira_papers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy demo sample papers (paper-001 through paper-007)
          return parsed.filter((p: Paper) => p && !p.id.startsWith('paper-00'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAPERS;
  });

  // Team Members & Phone numbers state (synced with Firestore and localStorage, no demo mock data)
  const [teamMembers, setTeamMembers] = useState<AdminContact[]>(() => {
    try {
      const saved = localStorage.getItem('ira_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy demo contacts if any contain mock names
          return parsed.filter((m: AdminContact) => m && !m.nameMy?.includes('မုဖ်သီ အုမရ်'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_CONTACTS;
  });

  // Bookmarks state (stored in localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ira_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => !id.startsWith('paper-00'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Telegram Database base URL (configurable by admin)
  const [telegramDbUrl, setTelegramDbUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ira_telegram_db_url');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TELEGRAM_DB_URL;
  });

  // Admin PIN code state (default: 7860, syncs with Firestore settings)
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ira_admin_pin');
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {
      console.error(e);
    }
    return '7860';
  });

  // User submitted Fatwa inquiries state (syncs with Firestore)
  const [userFatwas, setUserFatwas] = useState<UserSubmittedFatwa[]>(() => {
    try {
      const saved = localStorage.getItem('ira_user_fatwas');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<'papers' | 'fatwa' | 'bookmarks' | 'contact' | 'admin'>('papers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PaperCategory | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'downloads' | 'pages'>('recent');
  const [viewMode, setViewMode] = useState<'categories' | 'grid'>('categories');

  // Modals
  const [readerPaper, setReaderPaper] = useState<Paper | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isTelegramPostLinkModalOpen, setIsTelegramPostLinkModalOpen] = useState(false);
  const [telegramPostLinkPaperId, setTelegramPostLinkPaperId] = useState<string | null>(null);
  const [adminInquiryTopic, setAdminInquiryTopic] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check URL query parameters for direct book link (e.g. ?paper=paper-123 or ?book=paper-123)
  useEffect(() => {
    const checkUrlForPaper = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paperIdFromUrl = params.get('paper') || params.get('book');
        if (paperIdFromUrl && papers.length > 0) {
          const matchingPaper = papers.find((p) => p.id === paperIdFromUrl);
          if (matchingPaper) {
            setCurrentTab('papers');
            setReaderPaper(matchingPaper);
            showToast(`"${matchingPaper.title}" စာအုပ်အား Telegram Direct Link ဖြင့် တိုက်ရိုက်ဖွင့်လှစ်ထားပါသည် ✈️`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkUrlForPaper();
    window.addEventListener('popstate', checkUrlForPaper);
    return () => window.removeEventListener('popstate', checkUrlForPaper);
  }, [papers]);

  // Sync state to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('ira_papers', JSON.stringify(papers));
    } catch (e) {
      console.error(e);
    }
  }, [papers]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_team_members', JSON.stringify(teamMembers));
    } catch (e) {
      console.error(e);
    }
  }, [teamMembers]);

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

  useEffect(() => {
    try {
      localStorage.setItem('ira_admin_pin', adminPin);
    } catch (e) {
      console.error(e);
    }
  }, [adminPin]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_user_fatwas', JSON.stringify(userFatwas));
    } catch (e) {
      console.error(e);
    }
  }, [userFatwas]);

  // Firestore real-time synchronization
  useEffect(() => {
    const unsubPapers = subscribeToPapers((remotePapers) => {
      if (remotePapers) {
        // Filter out legacy demo papers
        const cleanRemote = remotePapers.filter((p) => p && !p.id.startsWith('paper-00'));
        setPapers((prev) => {
          const map = new Map<string, Paper>();
          (Array.isArray(prev) ? prev : [])
            .filter((p) => p && !p.id.startsWith('paper-00'))
            .forEach((p) => map.set(p.id, p));
          cleanRemote.forEach((p) => map.set(p.id, p));
          return Array.from(map.values());
        });
      }
    });

    const unsubTeam = subscribeToTeamMembers((remoteMembers) => {
      if (remoteMembers) {
        const cleanMembers = remoteMembers.filter((m) => m && !m.nameMy?.includes('မုဖ်သီ အုမရ်'));
        setTeamMembers(cleanMembers);
      }
    });

    const unsubChannelUrl = subscribeToTelegramChannelUrl((remoteUrl) => {
      if (remoteUrl && remoteUrl.trim()) {
        setTelegramDbUrl(remoteUrl.trim());
      }
    });

    const unsubFatwas = subscribeToFatwaInquiries((remoteFatwas) => {
      if (remoteFatwas && remoteFatwas.length > 0) {
        setUserFatwas((prev) => {
          const map = new Map<string, UserSubmittedFatwa>();
          (Array.isArray(prev) ? prev : []).forEach((f) => map.set(f.id, f));
          remoteFatwas.forEach((f) => map.set(f.id, f));
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
        });
      }
    });

    const unsubAdminPin = subscribeToAdminPin((remotePin) => {
      if (remotePin && remotePin.trim()) {
        setAdminPin(remotePin.trim());
      }
    });

    return () => {
      unsubPapers();
      unsubTeam();
      unsubChannelUrl();
      unsubFatwas();
      unsubAdminPin();
    };
  }, []);

  // Admin Handler: Delete Paper
  const handleDeletePaper = (paperId: string) => {
    setPapers((prev) => (Array.isArray(prev) ? prev.filter((p) => p.id !== paperId) : []));
    deletePaperFromFirestore(paperId).catch((err) =>
      console.warn('Paper deleted locally, Firestore sync error:', err)
    );
    showToast('စာအုပ်အား ဝဘ်ဆိုက်စာရင်းမှ ဖျက်ပစ်ပြီးပါပြီ ✓');
  };

  // Admin Handler: Save Team Member
  const handleSaveTeamMember = (member: AdminContact) => {
    setTeamMembers((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      const exists = safe.some((m) => m.id === member.id);
      return exists ? safe.map((m) => (m.id === member.id ? member : m)) : [...safe, member];
    });
    saveTeamMemberToFirestore(member).catch((err) =>
      console.warn('Team member saved locally, Firestore error:', err)
    );
    showToast(`"${member.nameMy}" အချက်အလက်များအား သိမ်းဆည်းပြီးပါပြီ ✓`);
  };

  // Admin Handler: Delete Team Member
  const handleDeleteTeamMember = (memberId: string) => {
    setTeamMembers((prev) => (Array.isArray(prev) ? prev.filter((m) => m.id !== memberId) : []));
    deleteTeamMemberFromFirestore(memberId).catch((err) =>
      console.warn('Team member deleted locally, Firestore error:', err)
    );
    showToast('အဖွဲ့ဝင်အား စာရင်းမှ ဖယ်ရှားလိုက်ပါပြီ ✓');
  };

  // Admin Handler: Update Fatwa Status
  const handleUpdateFatwaStatus = (id: string, status: 'pending' | 'answered') => {
    setUserFatwas((prev) =>
      (Array.isArray(prev) ? prev : []).map((f) =>
        f.id === id ? { ...f, status } : f
      )
    );
    updateFatwaInquiryStatusInFirestore(id, status).catch((err) =>
      console.warn('Fatwa updated locally, Firestore sync error:', err)
    );
    showToast('ဖသ်ဝါမေးခွန်း အခြေအနေအား ပြင်ဆင်ပြီးပါပြီ ✓');
  };

  // Admin Handler: Answer Fatwa Question Directly
  const handleAnswerFatwa = (
    id: string,
    answerText: string,
    kitabReference?: string,
    scholarName?: string
  ) => {
    const answeredAt = new Date().toISOString().split('T')[0];
    setUserFatwas((prev) =>
      (Array.isArray(prev) ? prev : []).map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'answered',
              answerText,
              kitabReference: kitabReference || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ',
              scholarName: scholarName || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့',
              answeredAt,
            }
          : f
      )
    );
    answerFatwaInquiryInFirestore(id, answerText, kitabReference, scholarName).catch((err) =>
      console.warn('Fatwa answered locally, Firestore sync error:', err)
    );
    showToast('ဖသ်ဝါ ဓမ္မသတ် အဖြေတော်အား အောင်မြင်စွာ သိမ်းဆည်း/ဖြေကြားပြီးပါပြီ ✓');
  };

  // Admin Handler: Delete Fatwa
  const handleDeleteFatwa = (id: string) => {
    setUserFatwas((prev) => (Array.isArray(prev) ? prev.filter((f) => f.id !== id) : []));
    deleteFatwaInquiryFromFirestore(id).catch((err) =>
      console.warn('Fatwa deleted locally, Firestore sync error:', err)
    );
    showToast('ဖသ်ဝါမေးခွန်းအား ဖျက်ပစ်ပြီးပါပြီ ✓');
  };

  // Admin Handler: Change Admin PIN
  const handleSaveAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    saveAdminPinToFirestore(newPin).catch((err) =>
      console.warn('Admin PIN saved locally, Firestore sync error:', err)
    );
    showToast('Admin PIN ကုဒ် အသစ်အား သိမ်းဆည်းပြီးပါပြီ ✓');
  };

  // Handler to update a book's specific Telegram post link
  const handleUpdatePaperTelegramLink = (paperId: string, telegramLink: string) => {
    setPapers((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p && p.id === paperId ? { ...p, telegramLink } : p
      )
    );
    updatePaperTelegramLinkInFirestore(paperId, telegramLink).catch((err) =>
      console.warn('Paper telegram link saved locally, Firestore sync error:', err)
    );
    showToast('စာအုပ်အတွက် Telegram Channel Post လင့်ခ်အား သိမ်းဆည်းပြီးပါပြီ ✓');
  };

  // Handler to save overall Telegram Channel URL
  const handleSaveTelegramDbUrl = (newUrl: string) => {
    setTelegramDbUrl(newUrl);
    saveTelegramChannelUrlToFirestore(newUrl).catch((err) =>
      console.warn('Channel URL saved locally, Firestore sync error:', err)
    );
    showToast('Telegram Channel လင့်ခ်အား အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ ✓');
  };

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
    savePaperToFirestore(newPaper).catch((err) => console.warn('Saved locally, Firestore sync error:', err));
    showToast(`"${newPaper.title}" စာတမ်းအား အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ ✓`);
    handleOpenReader(newPaper);
  };

  // Add new paper directly from Telegram Post Sync
  const handleAddNewPaperFromTelegram = (newPaper: Paper) => {
    setPapers((prev) => [newPaper, ...(Array.isArray(prev) ? prev : [])]);
    savePaperToFirestore(newPaper).catch((err) => console.warn('Saved locally, Firestore sync error:', err));
    showToast(`"${newPaper.title}" အား ဝဘ်ဆိုက်စာကြည့်တိုက်ထဲသို့ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ ✓`);
  };

  // Open Admin Inquiry with specific paper
  const handleOpenAdminInquiryWithPaper = (paper: Paper) => {
    setAdminInquiryTopic(`စာတမ်းအမှတ် ${paper.referenceNumber}: "${paper.title}"`);
    setIsAdminModalOpen(true);
  };

  // Direct Telegram Database redirect
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
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('paper', paper.id);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Reader Close
  const handleCloseReader = () => {
    setReaderPaper(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('paper');
      url.searchParams.delete('book');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    } catch (e) {
      console.error(e);
    }
  };

  // Download increment
  const handlePaperDownloaded = (paperId: string) => {
    setPapers((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p && p.id === paperId ? { ...p, downloadCount: (p.downloadCount || 0) + 1 } : p
      )
    );
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
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [papers, bookmarks, currentTab, selectedCategory, selectedLanguage, searchQuery, sortBy]);

  // Grouped by categories map
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
        openAdminModal={() => {
          setAdminInquiryTopic('');
          setIsAdminModalOpen(true);
        }}
        openGitHubModal={() => setIsGitHubModalOpen(true)}
        openTelegramModal={() => setIsTelegramModalOpen(true)}
        openTelegramPostLinkModal={() => {
          setTelegramPostLinkPaperId(null);
          setIsTelegramPostLinkModalOpen(true);
        }}
        telegramDbUrl={telegramDbUrl}
        bookmarkCount={bookmarks.length}
      />

      {/* Hero Section (Visible in Papers tab and Bookmarks tab) */}
      {(currentTab === 'papers' || currentTab === 'bookmarks') && (
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          openFatwaTab={() => setCurrentTab('fatwa')}
          openAdminModal={() => {
            setAdminInquiryTopic('');
            setIsAdminModalOpen(true);
          }}
          totalPapers={papers.length}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB 1: PAPERS REPOSITORY & BOOKMARKS */}
        {(currentTab === 'papers' || currentTab === 'bookmarks') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-burmese">
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
              <div className="bg-white rounded-3xl border border-[#DFD1BF] p-10 sm:p-14 text-center text-[#8C7667] shadow-sm max-w-2xl mx-auto my-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] flex items-center justify-center text-[#8B5A2B] shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#34180A]">
                  {papers.length === 0
                    ? 'အစ္စလာမ့် သုတေသန စာကြည့်တိုက်သို့ ကြိုဆိုပါသည်'
                    : 'ရှာဖွေမှုနှင့် ကိုက်ညီသော စာအုပ် မရှိပါ'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6353] mt-2 mb-6 leading-relaxed">
                  {papers.length === 0
                    ? 'ကျမ်းစာစာတမ်းသစ်များအား မကြာမီ စနစ်တကျ တင်ပေးပါမည်။ သာသနာရေးရာ ဖသ်ဝါဓမ္မသတ်များကို ဖသ်ဝါကဏ္ဍတွင် မေးမြန်းစုံစမ်းနိုင်ပါသည်။'
                    : 'သင်ရှာဖွေလိုသော အချက်အလက်နှင့် ကိုက်ညီသော စာအုပ်မရှိသေးပါ။'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {papers.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedLanguage('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D9C4AC] text-[#543825] rounded-xl text-xs font-semibold"
                    >
                      ရှာဖွေမှု ပြန်လည်ရှင်းလင်းမည်
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentTab('fatwa')}
                    className="px-5 py-2.5 bg-[#402312] hover:bg-[#2C180E] text-[#FDEBD0] rounded-xl text-xs font-bold border border-[#D9A86B] shadow-sm flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D9A86B]" />
                    <span>ဖသ်ဝါ မေးမြန်းရန်</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'categories' && selectedCategory === 'all' ? (
              /* CATEGORIZED SHELVES VIEW */
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
                            onOpenTelegramPostLink={(p) => {
                              setTelegramPostLinkPaperId(p.id);
                              setIsTelegramPostLinkModalOpen(true);
                            }}
                            telegramDbUrl={telegramDbUrl}
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
                    onOpenTelegramPostLink={(p) => {
                      setTelegramPostLinkPaperId(p.id);
                      setIsTelegramPostLinkModalOpen(true);
                    }}
                    telegramDbUrl={telegramDbUrl}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FATWA & FIQH */}
        {currentTab === 'fatwa' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FatwaSection
              telegramDbUrl={telegramDbUrl}
              onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: CONTACT SECTION */}
        {currentTab === 'contact' && (
          <AdminContactSection
            contacts={teamMembers}
            initialTopic={adminInquiryTopic}
            onClose={() => setCurrentTab('papers')}
            isModal={false}
          />
        )}

        {/* TAB 4: DEDICATED ADMIN CONTROL CENTER (PIN PROTECTED) */}
        {currentTab === 'admin' && (
          <AdminPanel
            papers={papers}
            onSavePaper={handlePaperUploaded}
            onDeletePaper={handleDeletePaper}
            onUpdateTelegramLink={handleUpdatePaperTelegramLink}
            telegramDbUrl={telegramDbUrl}
            onSaveTelegramDbUrl={handleSaveTelegramDbUrl}
            teamMembers={teamMembers}
            onSaveTeamMember={handleSaveTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
            userFatwas={userFatwas}
            onUpdateFatwaStatus={handleUpdateFatwaStatus}
            onAnswerFatwa={handleAnswerFatwa}
            onDeleteFatwa={handleDeleteFatwa}
            onOpenReader={handleOpenReader}
            onNavigateHome={() => setCurrentTab('papers')}
            adminPin={adminPin}
            onSaveAdminPin={handleSaveAdminPin}
          />
        )}
      </main>

      {/* Floating Fast WhatsApp Helpline Button */}
      <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        <button
          onClick={() => {
            setAdminInquiryTopic('');
            setIsAdminModalOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-full shadow-2xl border-2 border-[#2E7D4E] hover:scale-105 transition-all group"
          title="WhatsApp တိုက်ရိုက်ဆက်သွယ်ရန်"
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
        onClose={handleCloseReader}
        onOpenAdminInquiry={handleOpenAdminInquiryWithPaper}
        onPaperDownloaded={handlePaperDownloaded}
        onOpenTelegramPostLink={(p) => {
          setTelegramPostLinkPaperId(p.id);
          setIsTelegramPostLinkModalOpen(true);
        }}
        telegramDbUrl={telegramDbUrl}
      />

      <UploadPaperModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPaperUploaded={handlePaperUploaded}
      />

      <AdminContactsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        initialTopic={adminInquiryTopic}
        contacts={teamMembers}
      />

      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <TelegramConfigModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        currentUrl={telegramDbUrl}
        onSaveUrl={handleSaveTelegramDbUrl}
      />

      <TelegramPostLinkModal
        isOpen={isTelegramPostLinkModalOpen}
        onClose={() => setIsTelegramPostLinkModalOpen(false)}
        papers={papers}
        initialPaperId={telegramPostLinkPaperId}
        onAddNewPaperFromTelegram={handleAddNewPaperFromTelegram}
        onSelectPaperToRead={(paper) => handleOpenReader(paper)}
        onUpdatePaperTelegramLink={handleUpdatePaperTelegramLink}
        telegramDbUrl={telegramDbUrl}
      />

      {/* Footer with subtle Admin Panel link at the bottom */}
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
        openAdminPanel={() => {
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openFatwaSection={() => {
          setCurrentTab('fatwa');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        teamMembers={teamMembers}
      />
    </div>
  );
}
