/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
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
  Megaphone,
  Wrench,
} from 'lucide-react';
import {
  Paper,
  PaperCategory,
  UserSubmittedFatwa,
  AdminContact,
  AdminUser,
  SiteConfig,
  FatwaItem,
} from './types';
import {
  INITIAL_PAPERS,
  INITIAL_ADMIN_CONTACTS,
  CATEGORIES_CONFIG,
  DEFAULT_TELEGRAM_DB_URL,
  DEFAULT_SITE_CONFIG,
} from './data/initialData';
import { auth, googleAuthProvider, OWNER_ADMIN_EMAIL } from './lib/firebase';
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
  saveFatwaInquiryToFirestore,
  updateFatwaInquiryStatusInFirestore,
  answerFatwaInquiryInFirestore,
  deleteFatwaInquiryFromFirestore,
  subscribeToFatwaInquiries,
  saveTeamMemberToFirestore,
  deleteTeamMemberFromFirestore,
  subscribeToTeamMembers,
  subscribeToUserAdminStatus,
  saveAdminUserToFirestore,
  deleteAdminUserFromFirestore,
  subscribeToAdminUsers,
  saveSiteConfigToFirestore,
  subscribeToSiteConfig,
  savePublishedFatwaToFirestore,
  deletePublishedFatwaFromFirestore,
  subscribeToPublishedFatwas,
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

  // Firebase Google Auth & Admin Authorization state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isListedAdmin, setIsListedAdmin] = useState<boolean>(false);
  const [adminCheckDone, setAdminCheckDone] = useState<boolean>(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const justSignedInRef = useRef<boolean>(false);

  const normalizedAuthEmail = authUser?.email?.trim().toLowerCase() || '';
  const isAdmin = Boolean(
    authUser &&
      authUser.emailVerified &&
      (normalizedAuthEmail === OWNER_ADMIN_EMAIL || isListedAdmin)
  );

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

  // Global Site Configuration state (Real-time synced from Firestore /site_config/main)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('ira_site_config');
      if (saved) {
        return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Official Published Fatwas Archive (Real-time synced from Firestore /published_fatwas)
  const [publishedFatwas, setPublishedFatwas] = useState<FatwaItem[]>(() => {
    try {
      const saved = localStorage.getItem('ira_published_fatwas');
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
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'downloads' | 'pages'>('recent');
  const [viewMode, setViewMode] = useState<'categories' | 'grid'>('categories');

  // Modals (store readerPaperId so reader reflects real-time edits immediately)
  const [readerPaperId, setReaderPaperId] = useState<string | null>(null);
  const readerPaper = useMemo(
    () => papers.find((p) => p.id === readerPaperId) || null,
    [papers, readerPaperId]
  );
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

  // Sync browser tab title live when Admin updates siteName
  useEffect(() => {
    if (siteConfig.siteNameEn || siteConfig.siteNameMy) {
      document.title = `${siteConfig.siteNameEn} | ${siteConfig.siteNameMy}`;
    }
  }, [siteConfig.siteNameEn, siteConfig.siteNameMy]);

  // Redirect non-admins away from disabled sections immediately on real-time toggle
  useEffect(() => {
    if (!isAdmin) {
      if (currentTab === 'fatwa' && !siteConfig.enableFatwaSection) {
        setCurrentTab('papers');
      } else if (currentTab === 'contact' && !siteConfig.enableContactTab) {
        setCurrentTab('papers');
      }
    }
  }, [currentTab, isAdmin, siteConfig.enableFatwaSection, siteConfig.enableContactTab]);

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
            setReaderPaperId(matchingPaper.id);
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
      localStorage.setItem('ira_user_fatwas', JSON.stringify(userFatwas));
    } catch (e) {
      console.error(e);
    }
  }, [userFatwas]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_site_config', JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_published_fatwas', JSON.stringify(publishedFatwas));
    } catch (e) {
      console.error(e);
    }
  }, [publishedFatwas]);

  // Listen to Firebase Google Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (!user) {
        setIsListedAdmin(false);
        setAdminCheckDone(true);
        setAdminUsers([]);
      } else {
        setAdminCheckDone(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check if signed-in Google user is authorized Admin in Firestore
  useEffect(() => {
    if (!authUser?.email || !authUser.emailVerified) {
      setIsListedAdmin(false);
      setAdminCheckDone(true);
      return;
    }

    const emailLower = authUser.email.trim().toLowerCase();
    if (emailLower === OWNER_ADMIN_EMAIL) {
      setIsListedAdmin(true);
      setAdminCheckDone(true);
      return;
    }

    const unsub = subscribeToUserAdminStatus(
      emailLower,
      (listed) => {
        setIsListedAdmin(listed);
        setAdminCheckDone(true);
      },
      () => {
        setIsListedAdmin(false);
        setAdminCheckDone(true);
      }
    );

    return () => unsub();
  }, [authUser]);

  // Auto-open Admin Panel immediately after authorized Admin signs in
  useEffect(() => {
    if (authLoading || !adminCheckDone) return;
    if (justSignedInRef.current && authUser) {
      justSignedInRef.current = false;
      if (isAdmin) {
        setCurrentTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Admin အဖြစ် အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ ✓');
      } else {
        showToast(`${authUser.displayName || authUser.email} အဖြစ် ဝင်ရောက်ပြီးပါပြီ ✓`);
      }
    }
  }, [isAdmin, adminCheckDone, authLoading, authUser]);

  // Protect admin tab if user logs out or admin privileges are revoked
  useEffect(() => {
    if (currentTab === 'admin' && !authLoading && adminCheckDone && !isAdmin) {
      setCurrentTab('papers');
    }
  }, [currentTab, isAdmin, authLoading, adminCheckDone]);

  // Subscribe to authorized admin list ONLY when authenticated as an Admin
  useEffect(() => {
    if (!isAdmin) {
      setAdminUsers([]);
      return;
    }
    const unsubAdmins = subscribeToAdminUsers(
      (remoteAdmins) => {
        setAdminUsers(remoteAdmins);
      },
      (err) => {
        console.warn('Admin users sync error:', err);
      }
    );
    return () => unsubAdmins();
  }, [isAdmin]);

  // Firestore real-time synchronization for ALL public system data
  useEffect(() => {
    const unsubSiteConfig = subscribeToSiteConfig(
      (remoteConfig) => {
        if (remoteConfig) {
          setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...remoteConfig });
        } else {
          setSiteConfig(DEFAULT_SITE_CONFIG);
        }
      },
      (err) => console.warn('Site config sync error:', err)
    );

    const unsubPapers = subscribeToPapers(
      (remotePapers) => {
        const cleanRemote = remotePapers.filter((p) => p && !p.id.startsWith('paper-00'));
        setPapers(cleanRemote);
      },
      (err) => console.warn('Papers sync error:', err)
    );

    const unsubTeam = subscribeToTeamMembers(
      (remoteMembers) => {
        const cleanMembers = remoteMembers.filter((m) => m && !m.nameMy?.includes('မုဖ်သီ အုမရ်'));
        setTeamMembers(cleanMembers);
      },
      (err) => console.warn('Team members sync error:', err)
    );

    const unsubChannelUrl = subscribeToTelegramChannelUrl(
      (remoteUrl) => {
        if (remoteUrl && remoteUrl.trim()) {
          setTelegramDbUrl(remoteUrl.trim());
        }
      },
      (err) => console.warn('Channel URL sync error:', err)
    );

    const unsubFatwas = subscribeToFatwaInquiries(
      (remoteFatwas) => {
        const sorted = [...remoteFatwas].sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setUserFatwas(sorted);
      },
      (err) => console.warn('Fatwa inquiries sync error:', err)
    );

    const unsubPublishedFatwas = subscribeToPublishedFatwas(
      (remotePublished) => {
        const sorted = [...remotePublished].sort(
          (a, b) => new Date(b.answeredDate || 0).getTime() - new Date(a.answeredDate || 0).getTime()
        );
        setPublishedFatwas(sorted);
      },
      (err) => console.warn('Published fatwas sync error:', err)
    );

    return () => {
      unsubSiteConfig();
      unsubPapers();
      unsubTeam();
      unsubChannelUrl();
      unsubFatwas();
      unsubPublishedFatwas();
    };
  }, []);

  // Admin Handler: Save Global Site Config (Real-time synced to all visitors)
  const handleSaveSiteConfig = async (nextConfig: SiteConfig) => {
    await saveSiteConfigToFirestore(nextConfig);
    setSiteConfig(nextConfig);
  };

  // Admin Handler: Save Published Official Fatwa
  const handleSavePublishedFatwa = async (fatwa: FatwaItem) => {
    await savePublishedFatwaToFirestore(fatwa);
  };

  // Admin Handler: Delete Published Official Fatwa
  const handleDeletePublishedFatwa = async (fatwaId: string) => {
    await deletePublishedFatwaFromFirestore(fatwaId);
  };

  // Public Handler: Submit Community Fatwa Inquiry
  const handleSubmitFatwaInquiry = async (inquiry: UserSubmittedFatwa) => {
    await saveFatwaInquiryToFirestore(inquiry);
    showToast('သင်၏ ဖသ်ဝါမေးခွန်းအား အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ ✓');
  };

  // Admin Handler: Save / Edit Paper (from AdminPanel, stays in AdminPanel)
  const handleAdminSavePaper = async (paperToSave: Paper) => {
    try {
      await savePaperToFirestore(paperToSave);
      showToast(`"${paperToSave.title}" အား အားလုံးထံ Real-Time Sync သိမ်းဆည်းပြီးပါပြီ ✓`);
    } catch (err) {
      console.error('Paper save Firestore error:', err);
      showToast('စာအုပ်သိမ်းဆည်းရာတွင် Firestore ချိတ်ဆက်မှု အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Delete Paper
  const handleDeletePaper = async (paperId: string) => {
    try {
      await deletePaperFromFirestore(paperId);
      showToast('စာအုပ်အား ဝဘ်ဆိုက်တစ်ခုလုံးမှ Real-Time ဖျက်ပစ်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Paper delete Firestore error:', err);
      showToast('စာအုပ်ဖျက်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Save Team Member
  const handleSaveTeamMember = async (member: AdminContact) => {
    try {
      await saveTeamMemberToFirestore(member);
      showToast(`"${member.nameMy}" အချက်အလက်များအား အားလုံးထံ Real-Time Sync သိမ်းဆည်းပြီးပါပြီ ✓`);
    } catch (err) {
      console.error('Team member save Firestore error:', err);
      showToast('အဖွဲ့ဝင်သိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Delete Team Member
  const handleDeleteTeamMember = async (memberId: string) => {
    try {
      await deleteTeamMemberFromFirestore(memberId);
      showToast('အဖွဲ့ဝင်အား စာရင်းမှ Real-Time ဖယ်ရှားလိုက်ပါပြီ ✓');
    } catch (err) {
      console.error('Team member delete Firestore error:', err);
      showToast('အဖွဲ့ဝင်ဖယ်ရှားရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Update Fatwa Status
  const handleUpdateFatwaStatus = async (id: string, status: 'pending' | 'answered') => {
    try {
      await updateFatwaInquiryStatusInFirestore(id, status);
      showToast('ဖသ်ဝါမေးခွန်း အခြေအနေအား အားလုံးထံ Real-Time ပြင်ဆင်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Fatwa status update Firestore error:', err);
      showToast('ဖသ်ဝါအခြေအနေ ပြင်ဆင်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Answer Fatwa Question Directly
  const handleAnswerFatwa = async (
    id: string,
    answerText: string,
    kitabReference?: string,
    scholarName?: string
  ) => {
    try {
      await answerFatwaInquiryInFirestore(id, answerText, kitabReference, scholarName);
      showToast('ဖသ်ဝါ ဓမ္မသတ် အဖြေတော်အား အားလုံးထံ Real-Time ထုတ်ပြန်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Fatwa answer Firestore error:', err);
      showToast('ဖသ်ဝါအဖြေသိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Admin Handler: Delete Fatwa
  const handleDeleteFatwa = async (id: string) => {
    try {
      await deleteFatwaInquiryFromFirestore(id);
      showToast('ဖသ်ဝါမေးခွန်းအား ဝဘ်ဆိုက်တစ်ခုလုံးမှ Real-Time ဖျက်ပစ်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Fatwa delete Firestore error:', err);
      showToast('ဖသ်ဝါဖျက်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Google Auth Handlers
  const handleGoogleLogin = async () => {
    try {
      justSignedInRef.current = true;
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      justSignedInRef.current = false;
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error('Google Sign-In error:', err);
      showToast('Google အကောင့်ဖြင့် ဝင်ရောက်ရာတွင် အဆင်မပြေပါ။ ထပ်မံကြိုးစားပါ။');
    }
  };

  const handleLogout = async () => {
    try {
      justSignedInRef.current = false;
      await signOut(auth);
      setCurrentTab('papers');
      showToast('အကောင့်မှ အောင်မြင်စွာ ထွက်ခွာပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Sign-Out error:', err);
    }
  };

  // Admin Account Management Handlers
  const handleAddAdminUser = async (email: string, name?: string) => {
    const normalized = email.trim().toLowerCase();
    const adminEntry: AdminUser = {
      email: normalized,
      name: name?.trim() || '',
      role: 'admin',
      addedAt: new Date().toISOString().split('T')[0],
      addedBy: normalizedAuthEmail || OWNER_ADMIN_EMAIL,
    };
    await saveAdminUserToFirestore(adminEntry);
  };

  const handleRemoveAdminUser = async (email: string) => {
    await deleteAdminUserFromFirestore(email);
  };

  // Handler to update a book's specific Telegram post link
  const handleUpdatePaperTelegramLink = async (paperId: string, telegramLink: string) => {
    try {
      await updatePaperTelegramLinkInFirestore(paperId, telegramLink);
      showToast('စာအုပ်အတွက် Telegram Channel Post လင့်ခ်အား အားလုံးထံ Real-Time Sync သိမ်းဆည်းပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Paper telegram link Firestore error:', err);
      showToast('Telegram လင့်ခ်သိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Handler to save overall Telegram Channel URL
  const handleSaveTelegramDbUrl = async (newUrl: string) => {
    try {
      await saveTelegramChannelUrlToFirestore(newUrl);
      setTelegramDbUrl(newUrl);
      showToast('Telegram Channel လင့်ခ်အား အားလုံးထံ Real-Time Sync ပြင်ဆင်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error('Channel URL Firestore error:', err);
      showToast('Telegram Channel လင့်ခ်သိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
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

  // Upload handler (from UploadPaperModal)
  const handlePaperUploaded = async (newPaper: Paper) => {
    try {
      await savePaperToFirestore(newPaper);
      showToast(`"${newPaper.title}" စာတမ်းအား အားလုံးထံ Real-Time တင်သွင်းပြီးပါပြီ ✓`);
      handleOpenReader(newPaper);
    } catch (err) {
      console.error('Paper upload Firestore error:', err);
      showToast('စာတမ်းတင်သွင်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
  };

  // Add new paper directly from Telegram Post Sync
  const handleAddNewPaperFromTelegram = async (newPaper: Paper) => {
    try {
      await savePaperToFirestore(newPaper);
      showToast(`"${newPaper.title}" အား ဝဘ်ဆိုက်တစ်ခုလုံးသို့ Real-Time ထည့်သွင်းပြီးပါပြီ ✓`);
    } catch (err) {
      console.error('Telegram paper sync Firestore error:', err);
      showToast('စာအုပ်ထည့်သွင်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    }
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
    setReaderPaperId(paper.id);
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
    setReaderPaperId(null);
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
  }, [papers, bookmarks, currentTab, selectedCategory, searchQuery, sortBy]);

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
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#FAF7F2] text-[#2C1810]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-50 bg-[#26150C] text-[#FAF7F2] border border-[#229ED9] px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-2.5 text-xs sm:text-sm font-burmese">
          <div className="flex items-center gap-2.5 min-w-0">
            <Send className="w-4 h-4 text-[#229ED9] fill-current shrink-0" />
            <span className="break-words">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#D9C4AC] hover:text-white shrink-0"
            aria-label="Close notification"
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
        bookmarkCount={bookmarks.length}
        authUser={authUser}
        authLoading={authLoading}
        isAdmin={isAdmin}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        siteConfig={siteConfig}
      />

      {/* Live Global Announcement Banner (Real-Time Synced by Admin) */}
      {siteConfig.announcementEnabled && siteConfig.announcementText?.trim() && (
        <div
          className={`w-full px-4 py-2.5 text-xs sm:text-sm font-burmese border-b ${
            siteConfig.announcementType === 'warning'
              ? 'bg-[#7F1D1D] text-[#FEE2E2] border-[#991B1B]'
              : siteConfig.announcementType === 'success'
              ? 'bg-[#14532D] text-[#DCFCE7] border-[#166534]'
              : 'bg-[#3B2010] text-[#FDEBD0] border-[#633A18]'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span className="font-medium break-words">{siteConfig.announcementText}</span>
          </div>
        </div>
      )}

      {/* Admin Notice if Maintenance Mode is active */}
      {siteConfig.maintenanceMode && isAdmin && (
        <div className="w-full bg-amber-600 text-white px-4 py-2 text-xs font-burmese text-center font-semibold">
          ⚠️ Maintenance Mode ဖွင့်ထားပါသည် — သာမန်အသုံးပြုသူများသည် ပြင်ဆင်နေကြောင်း စာမျက်နှာကိုသာ မြင်တွေ့နေရပါသည်။
        </div>
      )}

      {/* Maintenance Screen for Public Visitors */}
      {siteConfig.maintenanceMode && !isAdmin ? (
        <main className="flex-1 flex items-center justify-center px-4 py-16 font-burmese">
          <div className="max-w-lg w-full bg-white rounded-3xl border-2 border-[#DECCB5] shadow-xl p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#24130B] text-[#EAD8B5] flex items-center justify-center shadow-lg">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2C1810]">
              {siteConfig.siteNameMy}
            </h1>
            <p className="text-sm text-[#5C4535] leading-relaxed">
              {siteConfig.maintenanceMessage}
            </p>
            <div className="text-xs text-[#8C7667] pt-2 border-t border-[#EFE5D7]">
              {siteConfig.siteNameEn}
            </div>
          </div>
        </main>
      ) : (
      <>
      {/* Hero Section (Visible in Papers tab and Bookmarks tab) */}
      {(currentTab === 'papers' || currentTab === 'bookmarks') && (
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openFatwaTab={() => setCurrentTab('fatwa')}
          openAdminModal={() => {
            setAdminInquiryTopic('');
            setIsAdminModalOpen(true);
          }}
          totalPapers={papers.length}
          siteConfig={siteConfig}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB 1: PAPERS REPOSITORY & BOOKMARKS */}
        {(currentTab === 'papers' || currentTab === 'bookmarks') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-burmese">
            {/* Header info bar for Bookmarks tab */}
            {currentTab === 'bookmarks' && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[#DFD1BF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-[#8B5A2B] min-w-0">
                  <Bookmark className="w-5 h-5 fill-[#8B5A2B] shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-[#2C1810] truncate">
                      သင်သိမ်းဆည်းထားသော စာအုပ်စာတမ်းများ ({bookmarks.length})
                    </h2>
                    <p className="text-xs text-[#7A6353]">Saved Research Treatises</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('papers')}
                  className="self-start sm:self-auto px-3.5 py-1.5 text-xs bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#543825] font-semibold rounded-xl border border-[#D9C4AC] shrink-0"
                >
                  စာတမ်းအားလုံးသို့ ပြန်သွားမည်
                </button>
              </div>
            )}

            {/* Filter and Category Controls */}
            <div className="mb-6 space-y-3">
              {/* Category Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                    selectedCategory === 'all'
                      ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md'
                      : 'bg-white text-[#5C3B23] border-[#DFD1BF] hover:bg-[#FAF7F2]'
                  }`}
                >
                  ကဏ္ဍအားလုံး (All)
                </button>

                {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => {
                  const isSelected = selectedCategory === key;
                  const count = (categorizedPapersMap[key] || []).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as PaperCategory)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border flex items-center gap-1.5 ${
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
              <div className="bg-white rounded-xl p-3 border border-[#E5DACB] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#DFD1BF] self-start">
                  <button
                    onClick={() => setViewMode('categories')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'categories'
                        ? 'bg-[#8B5A2B] text-white shadow-sm'
                        : 'text-[#6B4B32] hover:text-[#2C1810]'
                    }`}
                    title="စာအုပ်များကို ကဏ္ဍအလိုက် သပ်သပ်စီခွဲ၍ စာအုပ်စင်များအဖြစ် ကြည့်ရှုရန်"
                  >
                    <FolderKanban className="w-3.5 h-3.5 shrink-0" />
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
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                    <span>ဇယားကွက်ဖြင့် (Grid)</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
                  <div className="flex items-center gap-2 text-[#735A46]">
                    <Layers className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                    <span>
                      တွေ့ရှိသော စာအုပ်စာတမ်း:{' '}
                      <strong className="text-[#2C1810] font-mono text-base">{filteredPapers.length}</strong> အုပ်
                    </span>
                    {(selectedCategory !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSearchQuery('');
                        }}
                        className="ml-1 px-2 py-0.5 bg-[#FAF7F2] text-[#8B5A2B] hover:text-[#5C361C] border border-[#D9C4AC] rounded-md font-semibold text-xs"
                      >
                        ရှင်းမည်
                      </button>
                    )}
                  </div>

                  {/* Sort Option */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-[#8C7667] flex items-center gap-1 shrink-0">
                      <ArrowUpDown className="w-3.5 h-3.5" /> စီစဉ်ရန်:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 sm:flex-initial bg-[#FAF7F2] border border-[#D9C4AC] rounded-lg px-2.5 py-1.5 text-xs text-[#3B2011] focus:outline-none font-medium"
                    >
                      <option value="recent">နောက်ဆုံးတင်ထားသော စာတမ်းများ</option>
                      <option value="popular">ဖတ်ရှုသူ အများဆုံး (Most Read)</option>
                      <option value="downloads">ဒေါင်းလုဒ် အများဆုံး (Most Downloaded)</option>
                      <option value="pages">စာမျက်နှာ အများဆုံး</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Papers Display Area */}
            {filteredPapers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#DFD1BF] p-8 sm:p-14 text-center text-[#8C7667] shadow-sm max-w-2xl mx-auto my-6">
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
                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => setSelectedCategory(catKey as PaperCategory)}
                            className="px-3 py-1.5 bg-white hover:bg-[#F5EDE1] text-[#633A18] rounded-xl border border-[#D9C4AC] text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="ဤကဏ္ဍတစ်ခုတည်းကို သီးသန့်ရွေးချယ်ကြည့်ရန်"
                          >
                            <span>ဤကဏ္ဍသီးသန့်ကြည့်မည်</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {siteConfig.enableTelegramButtons && (
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
                          )}
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
                            onOpenTelegramPostLink={
                              isAdmin
                                ? (p) => {
                                    setTelegramPostLinkPaperId(p.id);
                                    setIsTelegramPostLinkModalOpen(true);
                                  }
                                : undefined
                            }
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
                    onOpenTelegramPostLink={
                      isAdmin
                        ? (p) => {
                            setTelegramPostLinkPaperId(p.id);
                            setIsTelegramPostLinkModalOpen(true);
                          }
                        : undefined
                    }
                    telegramDbUrl={telegramDbUrl}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FATWA & FIQH */}
        {currentTab === 'fatwa' && (siteConfig.enableFatwaSection || isAdmin) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <FatwaSection
              telegramDbUrl={telegramDbUrl}
              onOpenTelegramModal={isAdmin ? () => setIsTelegramModalOpen(true) : undefined}
              siteConfig={siteConfig}
              userFatwas={userFatwas}
              publishedFatwas={publishedFatwas}
              teamMembers={teamMembers}
              onSubmitFatwaInquiry={handleSubmitFatwaInquiry}
            />
          </div>
        )}

        {/* TAB 3: CONTACT SECTION */}
        {currentTab === 'contact' && (siteConfig.enableContactTab || isAdmin) && (
          <AdminContactSection
            contacts={teamMembers}
            initialTopic={adminInquiryTopic}
            onClose={() => setCurrentTab('papers')}
            isModal={false}
          />
        )}

        {/* TAB 4: DEDICATED ADMIN CONTROL CENTER (ONLY RENDERED FOR AUTHORIZED ADMINS) */}
        {currentTab === 'admin' && isAdmin && authUser?.email && (
          <AdminPanel
            papers={papers}
            onSavePaper={handleAdminSavePaper}
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
            publishedFatwas={publishedFatwas}
            onSavePublishedFatwa={handleSavePublishedFatwa}
            onDeletePublishedFatwa={handleDeletePublishedFatwa}
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            onOpenReader={handleOpenReader}
            onNavigateHome={() => setCurrentTab('papers')}
            authUserEmail={authUser.email}
            onLogout={handleLogout}
            adminUsers={adminUsers}
            onAddAdminUser={handleAddAdminUser}
            onRemoveAdminUser={handleRemoveAdminUser}
          />
        )}
      </main>
      </>
      )}

      {/* Floating Fast WhatsApp Helpline Button */}
      {siteConfig.enableWhatsappFloat && (!siteConfig.maintenanceMode || isAdmin) && (
        <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-3">
          <button
            onClick={() => {
              setAdminInquiryTopic('');
              setIsAdminModalOpen(true);
            }}
            className="flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-full shadow-2xl border-2 border-[#2E7D4E] hover:scale-105 transition-all group"
            title="WhatsApp တိုက်ရိုက်ဆက်သွယ်ရန်"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22C55E]"></span>
            </div>
            <span className="hidden sm:inline font-burmese text-xs sm:text-sm font-semibold pr-1">
              WhatsApp Admin
            </span>
          </button>
        </aside>
      )}

      {/* Modals */}
      <PaperReaderModal
        paper={readerPaper}
        onClose={handleCloseReader}
        onOpenAdminInquiry={handleOpenAdminInquiryWithPaper}
        onPaperDownloaded={handlePaperDownloaded}
        onOpenTelegramPostLink={
          isAdmin
            ? (p) => {
                setTelegramPostLinkPaperId(p.id);
                setIsTelegramPostLinkModalOpen(true);
              }
            : undefined
        }
        telegramDbUrl={telegramDbUrl}
      />

      {isAdmin && (
        <UploadPaperModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onPaperUploaded={handlePaperUploaded}
        />
      )}

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

      {isAdmin && (
        <>
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
        </>
      )}

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
        openFatwaSection={() => {
          setCurrentTab('fatwa');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        teamMembers={teamMembers}
        siteConfig={siteConfig}
      />
    </div>
  );
}
