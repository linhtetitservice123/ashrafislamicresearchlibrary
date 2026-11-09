import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  BookOpen,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  Send,
  Users,
  CheckCircle2,
  Search,
  X,
  AlertTriangle,
  Settings,
  Eye,
  LogOut,
  Sparkles,
  Link2,
  MessageCircle,
  Phone,
  Clock,
  PhoneCall,
  UserPlus,
} from 'lucide-react';
import { Paper, PaperCategory, LanguageType, UserSubmittedFatwa, AdminContact } from '../types';
import { CATEGORIES_CONFIG, SAMPLE_TEMPLATE_PAPER, SAMPLE_ADMIN_CONTACT } from '../data/initialData';

interface AdminPanelProps {
  papers: Paper[];
  onSavePaper: (paper: Paper) => void;
  onDeletePaper: (paperId: string) => void;
  onUpdateTelegramLink: (paperId: string, link: string) => void;
  telegramDbUrl: string;
  onSaveTelegramDbUrl: (newUrl: string) => void;
  teamMembers: AdminContact[];
  onSaveTeamMember: (member: AdminContact) => void;
  onDeleteTeamMember: (memberId: string) => void;
  userFatwas: UserSubmittedFatwa[];
  onUpdateFatwaStatus: (id: string, status: 'pending' | 'answered') => void;
  onAnswerFatwa?: (
    id: string,
    answerText: string,
    kitabReference?: string,
    scholarName?: string
  ) => void;
  onDeleteFatwa: (id: string) => void;
  onOpenReader: (paper: Paper) => void;
  onNavigateHome: () => void;
  adminPin: string;
  onSaveAdminPin: (newPin: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  papers,
  onSavePaper,
  onDeletePaper,
  onUpdateTelegramLink,
  telegramDbUrl,
  onSaveTelegramDbUrl,
  teamMembers,
  onSaveTeamMember,
  onDeleteTeamMember,
  userFatwas,
  onUpdateFatwaStatus,
  onAnswerFatwa,
  onDeleteFatwa,
  onOpenReader,
  onNavigateHome,
  adminPin,
  onSaveAdminPin,
}) => {
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ira_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'books' | 'telegram' | 'fatwas' | 'team' | 'settings'>('books');

  // Book Management States
  const [bookSearch, setBookSearch] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [deletingPaperId, setDeletingPaperId] = useState<string | null>(null);

  // New/Edit Book Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTitleOriginal, setFormTitleOriginal] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formAuthorTitle, setFormAuthorTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PaperCategory>('fiqh_fatwa');
  const [formLanguage, setFormLanguage] = useState<LanguageType>('myanmar');
  const [formYear, setFormYear] = useState<number | string>(new Date().getFullYear());
  const [formPages, setFormPages] = useState<number>(30);
  const [formFileFormat, setFormFileFormat] = useState<'PDF' | 'DOCX' | 'EPUB'>('PDF');
  const [formFileSize, setFormFileSize] = useState('3.2 MB');
  const [formTelegramLink, setFormTelegramLink] = useState('');
  const [formAbstract, setFormAbstract] = useState('');
  const [formFullContent, setFormFullContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsVerified, setFormIsVerified] = useState(true);

  // Quick Inline Telegram Link Editing
  const [editingTelegramPaperId, setEditingTelegramPaperId] = useState<string | null>(null);
  const [inlineTelegramLink, setInlineTelegramLink] = useState('');

  // Telegram Config in Admin
  const [tgChannelInput, setTgChannelInput] = useState(telegramDbUrl);

  // Team Member Management States
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminContact | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [memberFormNameMy, setMemberFormNameMy] = useState('');
  const [memberFormNameEn, setMemberFormNameEn] = useState('');
  const [memberFormRoleMy, setMemberFormRoleMy] = useState('');
  const [memberFormRoleEn, setMemberFormRoleEn] = useState('');
  const [memberFormPhone, setMemberFormPhone] = useState('');
  const [memberFormWhatsapp, setMemberFormWhatsapp] = useState('');
  const [memberFormEmail, setMemberFormEmail] = useState('');
  const [memberFormActiveHours, setMemberFormActiveHours] = useState('');
  const [memberFormSpecialization, setMemberFormSpecialization] = useState('');

  // Change PIN state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Fatwa Answering Modal State
  const [answeringFatwa, setAnsweringFatwa] = useState<UserSubmittedFatwa | null>(null);
  const [answerTextInput, setAnswerTextInput] = useState('');
  const [kitabReferenceInput, setKitabReferenceInput] = useState('');
  const [scholarNameInput, setScholarNameInput] = useState('ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့ (ဟနဖီမဇ်ဟဗ်)');

  // Notification Banner
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  useEffect(() => {
    setTgChannelInput(telegramDbUrl);
  }, [telegramDbUrl]);

  // Handle PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPin.trim()) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('ira_admin_session', 'true');
      } catch (err) {
        console.error(err);
      }
      setPinError(null);
      setEnteredPin('');
    } else {
      setPinError('PIN ကုဒ် မှားယွင်းနေပါသည်။ ကျေးဇူးပြု၍ ပြန်လည်စစ်ဆေးပါ။');
      setEnteredPin('');
    }
  };

  // Handle PIN Logout / Lock
  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('ira_admin_session');
    } catch (err) {
      console.error(err);
    }
    setEnteredPin('');
    setPinError(null);
  };

  // Open Form to Add New Book
  const handleOpenAddBook = () => {
    setEditingPaper(null);
    setFormTitle('');
    setFormTitleOriginal('');
    setFormAuthor('');
    setFormAuthorTitle('');
    setFormCategory('fiqh_fatwa');
    setFormLanguage('myanmar');
    setFormYear(new Date().getFullYear());
    setFormPages(35);
    setFormFileFormat('PDF');
    setFormFileSize('2.5 MB');
    setFormTelegramLink('');
    setFormAbstract('');
    setFormFullContent('');
    setFormTags('သုတေသန, ဖိကဟ်');
    setFormIsVerified(true);
    setIsAddBookModalOpen(true);
  };

  // Open Form to Edit Existing Book
  const handleOpenEditBook = (paper: Paper) => {
    setEditingPaper(paper);
    setFormTitle(paper.title);
    setFormTitleOriginal(paper.titleOriginalScript || '');
    setFormAuthor(paper.author);
    setFormAuthorTitle(paper.authorTitle || '');
    setFormCategory(paper.category);
    setFormLanguage(paper.language);
    setFormYear(paper.publicationYear);
    setFormPages(paper.pages);
    setFormFileFormat(paper.fileFormat);
    setFormFileSize(paper.fileSize);
    setFormTelegramLink(paper.telegramLink || '');
    setFormAbstract(paper.abstract);
    setFormFullContent(paper.fullContent);
    setFormTags((paper.tags || []).join(', '));
    setFormIsVerified(paper.isVerifiedByAcademy);
    setIsAddBookModalOpen(true);
  };

  // Save Book (Add or Edit)
  const handleSaveBookForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim() || !formAbstract.trim()) {
      alert('ကျေးဇူးပြု၍ စာအုပ်အမည်၊ စာရေးသူနှင့် အကျဉ်းချုပ်ကို ဖြည့်သွင်းပေးပါ');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const paperToSave: Paper = {
      id: editingPaper ? editingPaper.id : `paper-${Date.now()}`,
      title: formTitle.trim(),
      titleOriginalScript: formTitleOriginal.trim() || formTitle.trim(),
      author: formAuthor.trim(),
      authorTitle: formAuthorTitle.trim() || 'အစ္စလာမ့် သုတေသီ / စာရေးဆရာ',
      category: formCategory,
      language: formLanguage,
      publicationYear: formYear || new Date().getFullYear(),
      abstract: formAbstract.trim(),
      fullContent:
        formFullContent.trim() ||
        `${formTitle.trim()}\n\nရေးသားသူ: ${formAuthor.trim()}\n\n${formAbstract.trim()}`,
      tags: tagsArray.length > 0 ? tagsArray : ['အစ္စလာမ့်သုတေသန'],
      pages: Number(formPages) || 20,
      downloadCount: editingPaper ? editingPaper.downloadCount : 0,
      readCount: editingPaper ? editingPaper.readCount : 1,
      uploadedAt: editingPaper ? editingPaper.uploadedAt : new Date().toISOString().split('T')[0],
      fileFormat: formFileFormat,
      fileSize: formFileSize || '2.0 MB',
      isVerifiedByAcademy: formIsVerified,
      referenceNumber: editingPaper
        ? editingPaper.referenceNumber
        : `IRA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      telegramLink: formTelegramLink.trim() || undefined,
    };

    onSavePaper(paperToSave);
    setIsAddBookModalOpen(false);
    showAdminToast(
      editingPaper
        ? `"${paperToSave.title}" အား အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ ✓`
        : `"${paperToSave.title}" အား ဝဘ်ဆိုက်စာကြည့်တိုက်ထဲသို့ အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ ✓`
    );
  };

  // Delete Book
  const handleConfirmDeleteBook = () => {
    if (deletingPaperId) {
      onDeletePaper(deletingPaperId);
      setDeletingPaperId(null);
      showAdminToast('စာအုပ်အား ဝဘ်ဆိုက်စာရင်းမှ ဖျက်ပစ်ပြီးပါပြီ ✓');
    }
  };

  // Quick Seed 1 Sample Paper
  const handleLoadSamplePaper = () => {
    onSavePaper(SAMPLE_TEMPLATE_PAPER);
    showAdminToast('နမူနာ အစမ်းစာတမ်း ၁ အုပ်အား ထည့်သွင်းပြီးပါပြီ ✓');
  };

  // Save Inline Telegram Link
  const handleSaveInlineTelegram = (paperId: string) => {
    onUpdateTelegramLink(paperId, inlineTelegramLink.trim());
    setEditingTelegramPaperId(null);
    setInlineTelegramLink('');
    showAdminToast('Telegram Channel Post လင့်ခ်အား သိမ်းဆည်းပြီးပါပြီ ✓');
  };

  // Save Channel URL
  const handleSaveChannelUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgChannelInput.trim()) return;
    onSaveTelegramDbUrl(tgChannelInput.trim());
    showAdminToast('ပင်မ Telegram Channel လင့်ခ်အား ပြင်ဆင်ပြီးပါပြီ ✓');
  };

  // Open Form to Add New Team Member
  const handleOpenAddTeamMember = () => {
    setEditingMember(null);
    setMemberFormNameMy('');
    setMemberFormNameEn('');
    setMemberFormRoleMy('အထွေထွေ အုပ်ချုပ်ရေးမှူး');
    setMemberFormRoleEn('General Admin');
    setMemberFormPhone('09-');
    setMemberFormWhatsapp('+959');
    setMemberFormEmail('contact@islamicresearch.org');
    setMemberFormActiveHours('မနက် ၉:၀၀ မှ ညနေ ၅:၀၀ ထိ');
    setMemberFormSpecialization('သာသနာရေးရာ ဆက်သွယ်စုံစမ်းမှု');
    setIsTeamModalOpen(true);
  };

  // Open Form to Edit Existing Team Member
  const handleOpenEditTeamMember = (member: AdminContact) => {
    setEditingMember(member);
    setMemberFormNameMy(member.nameMy);
    setMemberFormNameEn(member.name || '');
    setMemberFormRoleMy(member.roleMy);
    setMemberFormRoleEn(member.role || '');
    setMemberFormPhone(member.phoneNumber);
    setMemberFormWhatsapp(member.whatsappNumber);
    setMemberFormEmail(member.email || '');
    setMemberFormActiveHours(member.activeHours || 'မနက် ၉:၀၀ မှ ည ၉:၀၀ ထိ');
    setMemberFormSpecialization(member.specialization || '');
    setIsTeamModalOpen(true);
  };

  // Save Team Member Form (Add or Edit)
  const handleSaveTeamMemberForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormNameMy.trim() || !memberFormPhone.trim()) {
      alert('ကျေးဇူးပြု၍ အမည်နှင့် ဖုန်းနံပါတ်ကို မဖြစ်မနေ ဖြည့်သွင်းပေးပါ');
      return;
    }

    const memberToSave: AdminContact = {
      id: editingMember ? editingMember.id : `member-${Date.now()}`,
      name: memberFormNameEn.trim() || memberFormNameMy.trim(),
      nameMy: memberFormNameMy.trim(),
      role: memberFormRoleEn.trim() || 'Administrator',
      roleMy: memberFormRoleMy.trim() || 'တာဝန်ခံ Admin',
      phoneNumber: memberFormPhone.trim(),
      displayPhone: memberFormPhone.trim(),
      whatsappNumber: memberFormWhatsapp.trim() || memberFormPhone.trim(),
      displayWhatsapp: memberFormWhatsapp.trim() || memberFormPhone.trim(),
      email: memberFormEmail.trim() || 'info@islamicresearch.org',
      activeHours: memberFormActiveHours.trim() || 'မနက် ၉:၀၀ မှ ညနေ ၆:၀၀ ထိ',
      specialization: memberFormSpecialization.trim() || 'အဖွဲ့အစည်း စီမံခန့်ခွဲမှု',
      avatarSeed: editingMember ? editingMember.avatarSeed : undefined,
    };

    onSaveTeamMember(memberToSave);
    setIsTeamModalOpen(false);
    showAdminToast(
      editingMember
        ? `"${memberToSave.nameMy}" ၏ အချက်အလက်များအား အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ ✓`
        : `"${memberToSave.nameMy}" အား အဖွဲ့ဝင်စာရင်းထဲသို့ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ ✓`
    );
  };

  // Delete Team Member
  const handleConfirmDeleteTeamMember = () => {
    if (deletingMemberId) {
      onDeleteTeamMember(deletingMemberId);
      setDeletingMemberId(null);
      showAdminToast('အဖွဲ့ဝင်အား စာရင်းမှ ဖျက်ပစ်ပြီးပါပြီ ✓');
    }
  };

  // Change Admin PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput.trim() !== adminPin.trim()) {
      setPinChangeMessage({ text: 'လက်ရှိ PIN ကုဒ် မမှန်ကန်ပါ', isError: true });
      return;
    }
    if (newPinInput.trim().length < 4) {
      setPinChangeMessage({ text: 'PIN ကုဒ်သည် အနည်းဆုံး ၄ လုံး ရှိရပါမည်', isError: true });
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeMessage({ text: 'PIN အသစ်နှစ်ခု ကိုက်ညီမှုမရှိပါ', isError: true });
      return;
    }

    onSaveAdminPin(newPinInput.trim());
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeMessage({ text: 'Admin PIN ကုဒ် အသစ်အား အောင်မြင်စွာ ပြောင်းလဲသိမ်းဆည်းပြီးပါပြီ ✓', isError: false });
  };

  // Open Fatwa Answer Modal
  const handleOpenAnswerModal = (fatwa: UserSubmittedFatwa) => {
    setAnsweringFatwa(fatwa);
    setAnswerTextInput(fatwa.answerText || '');
    setKitabReferenceInput(fatwa.kitabReference || 'ရဒ်ဒုလ်မုဟ်တာရ် (ဖတာဝါ ရှာမီ)၊ ဖတာဝါ ဟိန္ဒီယာ');
    setScholarNameInput(fatwa.scholarName || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့ (ဟနဖီမဇ်ဟဗ်)');
  };

  // Submit Answer to Fatwa
  const handleSaveAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringFatwa || !answerTextInput.trim()) {
      alert('ကျေးဇူးပြု၍ ဖသ်ဝါ ဓမ္မသတ် အဖြေတော်ကို ဖြည့်သွင်းပါ');
      return;
    }

    if (onAnswerFatwa) {
      onAnswerFatwa(
        answeringFatwa.id,
        answerTextInput.trim(),
        kitabReferenceInput.trim(),
        scholarNameInput.trim()
      );
    } else {
      onUpdateFatwaStatus(answeringFatwa.id, 'answered');
    }

    showAdminToast('ဖသ်ဝါ ဓမ္မသတ် အဖြေတော်အား အောင်မြင်စွာ သိမ်းဆည်း/ထုတ်ပြန်ပြီးပါပြီ ✓');
    setAnsweringFatwa(null);
  };

  const filteredPapers = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      p.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // ----------------------------------------------------
  // SCREEN 1: PIN CODE ACCESS LOCK (When not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-burmese">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DFD1BF] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2B170E] via-[#4A2613] to-[#1C0E07] px-6 py-8 text-center text-white relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#D9A86B]/20 border border-[#D9A86B]/40 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-9 h-9 text-[#EAD8B5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-wider text-[#F7F2EA]">
              ADMIN CONTROL PANEL
            </h2>
            <p className="text-xs text-[#D9A86B] font-burmese mt-1">
              အစ္စလာမ့် သုတေသန အကယ်ဒမီ • စီမံခန့်ခွဲရေး စင်တာ
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DECCB5] text-xs font-semibold text-[#6E421B] mb-2">
                <Lock className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>လုံခြုံရေး PIN ဖြင့် သော့ဖွင့်ရန်</span>
              </div>
              <p className="text-xs text-[#7A6353] leading-relaxed">
                ဝဘ်ဆိုက်တစ်ခုလုံး၏ စာအုပ်များ၊ ဖသ်ဝါများ၊ အဖွဲ့ဝင်ဖုန်းနံပါတ်များနှင့် Telegram ဆက်တင်များကို ထိန်းချုပ်ရန် Admin PIN ကုဒ်ကို ရိုက်ထည့်ပါ
              </p>
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{pinError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-2">
                Admin Security PIN Code (ကုဒ် ၄ လုံး)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  maxLength={12}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-2xl tracking-widest font-mono font-bold px-4 py-3 bg-[#FAF7F2] border-2 border-[#D9C4AC] focus:border-[#8B5A2B] rounded-2xl outline-none transition-all shadow-inner text-[#2C1810]"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8B5A2B] font-semibold hover:underline"
                >
                  {showPin ? 'ဝှက်မည်' : 'ပြမည်'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8B5A2B] to-[#5C361C] hover:from-[#9D6833] hover:to-[#73431B] text-white font-bold rounded-2xl shadow-lg border border-[#D9A86B]/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>Admin Panel ထဲသို့ ဝင်ရောက်မည်</span>
            </button>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DEC9] text-[11px] text-[#7A6353] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#543825]">
                <KeyRound className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>စတင်အသုံးပြုသူများအတွက် အချက်အလက်:</span>
              </div>
              <p>Default PIN ကုဒ်မှာ <strong className="font-mono text-[#8B5A2B] text-xs">7860</strong> (သို့မဟုတ် သင်သတ်မှတ်ထားသော PIN) ဖြစ်ပါသည်။</p>
              <p>Admin Panel ထဲသို့ ဝင်ရောက်ပြီးပါက မိမိစိတ်ကြိုက် PIN အသစ်သို့ အချိန်မရွေး လုံခြုံစွာ ပြောင်းလဲနိုင်ပါသည်။</p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-[#8B5A2B] hover:text-[#5C361C] font-semibold hover:underline"
              >
                ← ပင်မ စာကြည့်တိုက် စာမျက်နှာသို့ ပြန်သွားမည်
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 2: AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-burmese space-y-6">
      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1B3F2B] text-[#E3F8EB] px-5 py-3 rounded-2xl shadow-2xl border border-[#4ADE80]/40 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#24130B] via-[#3B1E0F] to-[#1C0E07] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#5C381E] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#5C361C] border border-[#D9A86B]/40 flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-8 h-8 text-[#FAF2E6]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-cinzel tracking-wider text-[#F5EFE6]">
                ADMIN CONTROL CENTER
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                <span>Admin အဖြစ် ဝင်ရောက်ထားသည်</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#D4B996] mt-1">
              ဝဘ်ဆိုက်တစ်ခုလုံး၏ စာအုပ်များ၊ Telegram ချိတ်ဆက်မှု၊ ဖသ်ဝါများနှင့် အဖွဲ့ဝင်ဖုန်းနံပါတ်များကို စီမံခန့်ခွဲခြင်း
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-end md:self-center">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-[#EAD8B5] hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all"
            title="စာဖတ်သူများမြင်တွေ့ရမည့် နေရာသို့ သွားကြည့်ရန်"
          >
            <Eye className="w-4 h-4" />
            <span>ဝဘ်ဆိုက် ကြည့်မည်</span>
          </button>

          <button
            onClick={handleLockAdmin}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#7F1D1D]/70 hover:bg-[#991B1B] text-[#FEE2E2] rounded-xl text-xs sm:text-sm font-semibold border border-red-500/30 transition-all shadow-sm"
            title="Admin session အား လုံခြုံစွာ သော့ခတ်ထွက်ခွာမည်"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin သော့ခတ်မည်</span>
          </button>
        </div>
      </div>

      {/* Admin Stats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E8DEC9] shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#7A6353]">တင်ထားသော စာအုပ်များ</div>
            <div className="text-xl font-bold font-cinzel text-[#2C1810]">
              {papers.length} <span className="text-xs text-[#7A6353] font-normal">Books</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8DEC9] shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0088CC]/10 text-[#0088CC]">
            <Send className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xs text-[#7A6353]">Telegram ချိတ်ဆက်ပြီး</div>
            <div className="text-xl font-bold font-cinzel text-[#2C1810]">
              {papers.filter((p) => p.telegramLink).length}{' '}
              <span className="text-xs text-[#7A6353] font-normal">Posts</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8DEC9] shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#047857]/10 text-[#047857]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#7A6353]">ဝင်လာသော ဖသ်ဝါမေးခွန်းများ</div>
            <div className="text-xl font-bold font-cinzel text-[#2C1810]">
              {userFatwas.length}{' '}
              <span className="text-xs text-[#7A6353] font-normal">Inquiries</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8DEC9] shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#7A6353]">အဖွဲ့ဝင် / ဖုန်းနံပါတ်များ</div>
            <div className="text-xl font-bold font-cinzel text-[#2C1810]">
              {teamMembers.length}{' '}
              <span className="text-xs text-[#7A6353] font-normal">Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-[#DECCB5] bg-white rounded-2xl p-1.5 gap-1.5 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'books'
              ? 'bg-[#8B5A2B] text-white shadow-md'
              : 'text-[#5C3B23] hover:bg-[#FAF7F2]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>စာအုပ်စာတမ်းများ စီမံခြင်း ({papers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'telegram'
              ? 'bg-[#0088CC] text-white shadow-md'
              : 'text-[#5C3B23] hover:bg-[#FAF7F2]'
          }`}
        >
          <Send className="w-4 h-4 fill-current" />
          <span>Telegram Channel ထိန်းချုပ်မှု</span>
        </button>

        <button
          onClick={() => setActiveTab('fatwas')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'fatwas'
              ? 'bg-[#15803D] text-white shadow-md'
              : 'text-[#5C3B23] hover:bg-[#FAF7F2]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ဖသ်ဝါ မေးခွန်းများ ({userFatwas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-[#7C3AED] text-white shadow-md'
              : 'text-[#5C3B23] hover:bg-[#FAF7F2]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>အဖွဲ့ဝင်နှင့် ဖုန်းနံပါတ်များ ({teamMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#374151] text-white shadow-md'
              : 'text-[#5C3B23] hover:bg-[#FAF7F2]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>လုံခြုံရေး PIN ဆက်တင်</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: BOOKS & PAPERS MANAGEMENT                      */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'books' && (
        <div className="space-y-5">
          {/* Action Bar: Add Book, Search, Filter */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#998375]" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="စာအုပ်အမည်၊ စာရေးသူ၊ မှတ်ပုံတင်အမှတ်ဖြင့် ရှာဖွေပါ..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#DECCB5] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenAddBook}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5A2B] to-[#6E421C] hover:from-[#9D6833] hover:to-[#7E4C21] text-white font-bold rounded-xl shadow-md border border-[#D9A86B]/40 transition-all text-xs sm:text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>စာအုပ်အသစ် တင်မည် (Upload)</span>
              </button>

              {papers.length === 0 && (
                <button
                  onClick={handleLoadSamplePaper}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#8B5A2B] font-semibold rounded-xl border border-[#D9C4AC] text-xs transition-all"
                  title="အစမ်းသဘော နမူနာစာတမ်း ၁ အုပ် ထည့်ကြည့်ရန်"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A86B]" />
                  <span>နမူနာ ၁ အုပ် ထည့်ကြည့်ရန်</span>
                </button>
              )}
            </div>
          </div>

          {/* Books List Table / Cards */}
          {filteredPapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#DFD1BF]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#8B5A2B]">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#34180A] mb-1">
                {bookSearch ? 'ရှာဖွေမှုနှင့် ကိုက်ညီသော စာအုပ် မရှိပါ' : 'တင်ထားသော စာအုပ်စာတမ်းများ မရှိသေးပါ'}
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6353] max-w-md mx-auto mb-6">
                Demo စာအုပ်များကို အောင်မြင်စွာ ဖျက်ပစ်ပြီးဖြစ်ပါသည်။ ယခုအခါ Admin အနေဖြင့် မိမိတင်လိုသော အစ္စလာမ့်စာတမ်းများကို စတင်တင်သွင်းနိုင်ပါပြီ။
              </p>
              <button
                onClick={handleOpenAddBook}
                className="px-6 py-3 bg-[#8B5A2B] hover:bg-[#73431B] text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ပထမဆုံး စာအုပ် စတင်တင်သွင်းမည်</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPapers.map((paper) => {
                const categoryConfig = CATEGORIES_CONFIG[paper.category];
                return (
                  <div
                    key={paper.id}
                    className="bg-white rounded-2xl p-5 border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#8B5A2B] px-2 py-0.5 rounded bg-[#8B5A2B]/10 border border-[#8B5A2B]/20">
                          {paper.referenceNumber}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F4EFE6] text-[#70421B] border border-[#DECCB5]">
                          {categoryConfig?.nameMy || paper.category}
                        </span>
                        <span className="text-xs text-[#8C6D53] font-mono">
                          {paper.publicationYear} • {paper.pages} မျက်နှာ • {paper.fileSize}
                        </span>
                        {paper.telegramLink ? (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] flex items-center gap-1">
                            <Send className="w-3 h-3 fill-current" />
                            <span>Telegram Post ချိတ်ပြီး</span>
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                            ပင်မ Channel သို့ ညွှန်ထားသည်
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-[#2C1810]">
                        {paper.title}
                      </h4>

                      <p className="text-xs text-[#6B5240]">
                        ✍️ ရေးသားသူ: <strong>{paper.author}</strong> {paper.authorTitle && `(${paper.authorTitle})`}
                      </p>

                      <p className="text-xs text-[#7A6353] line-clamp-2 leading-relaxed">
                        {paper.abstract}
                      </p>

                      {/* Inline Telegram Link Quick Editor */}
                      {editingTelegramPaperId === paper.id ? (
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="url"
                            value={inlineTelegramLink}
                            onChange={(e) => setInlineTelegramLink(e.target.value)}
                            placeholder="https://t.me/channel_name/123..."
                            className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#F0F8FD] border border-[#8CE0FF] rounded-lg outline-none"
                          />
                          <button
                            onClick={() => handleSaveInlineTelegram(paper.id)}
                            className="px-3 py-1.5 bg-[#0088CC] hover:bg-[#0077B5] text-white text-xs font-semibold rounded-lg"
                          >
                            သိမ်းမည်
                          </button>
                          <button
                            onClick={() => setEditingTelegramPaperId(null)}
                            className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                          >
                            မလုပ်တော့ပါ
                          </button>
                        </div>
                      ) : (
                        paper.telegramLink && (
                          <div className="pt-1 text-[11px] text-[#0284C7] flex items-center gap-1 font-mono">
                            <Link2 className="w-3 h-3 shrink-0" />
                            <a
                              href={paper.telegramLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline truncate max-w-sm"
                            >
                              {paper.telegramLink}
                            </a>
                          </div>
                        )
                      )}
                    </div>

                    {/* Book Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                      <button
                        onClick={() => {
                          setEditingTelegramPaperId(paper.id);
                          setInlineTelegramLink(paper.telegramLink || '');
                        }}
                        className="px-3 py-1.5 bg-[#F0F8FD] hover:bg-[#E1F3FD] text-[#0088CC] text-xs font-semibold rounded-xl border border-[#BAE6FD] flex items-center gap-1 transition-colors"
                        title="ဤစာအုပ်အတွက် Telegram Channel Post လင့်ခ် ထည့်/ပြင်ရန်"
                      >
                        <Send className="w-3.5 h-3.5 fill-current" />
                        <span>TG Link</span>
                      </button>

                      <button
                        onClick={() => onOpenReader(paper)}
                        className="p-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#633A18] rounded-xl border border-[#D9C4AC] transition-colors"
                        title="ဖတ်ရှုကြည့်မည် (Preview Reader)"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditBook(paper)}
                        className="p-2 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] rounded-xl border border-[#FCD34D] transition-colors"
                        title="အချက်အလက်များ ပြင်ဆင်မည် (Edit)"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingPaperId(paper.id)}
                        className="p-2 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B] rounded-xl border border-[#F87171] transition-colors"
                        title="စာအုပ်အား ဖျက်ပစ်မည် (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: TELEGRAM CHANNEL & LINK CONTROL                */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD1BF] shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8DEC9]">
              <div className="w-12 h-12 rounded-2xl bg-[#0088CC]/10 text-[#0088CC] flex items-center justify-center">
                <Send className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C1810]">
                  ပင်မ Telegram Channel လင့်ခ် စီမံခန့်ခွဲမှု
                </h3>
                <p className="text-xs text-[#7A6353]">
                  စာဖတ်သူများ ဝဘ်ဆိုက်ရှိ Telegram ခလုတ်ကို နှိပ်လိုက်သည်နှင့် ဤ Channel ဆီသို့ တိုက်ရိုက်ရောက်ရှိသွားပါမည်
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveChannelUrl} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-2">
                  တရားဝင် Telegram Channel / Database URL Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    value={tgChannelInput}
                    onChange={(e) => setTgChannelInput(e.target.value)}
                    placeholder="https://t.me/Your_Telegram_Channel"
                    className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-xs sm:text-sm text-[#0B4F6C] outline-none focus:border-[#0088CC]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#0088CC] hover:bg-[#0077B5] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm whitespace-nowrap active:scale-95"
                  >
                    လင့်ခ် သိမ်းမည်
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={tgChannelInput || telegramDbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F0F8FD] text-[#0088CC] hover:bg-[#E1F3FD] rounded-xl text-xs font-semibold border border-[#BAE6FD]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Channel လင့်ခ် စမ်းသပ်ဖွင့်ကြည့်မည်</span>
                </a>
              </div>
            </form>

            <div className="p-4 bg-[#F0F8FF] rounded-2xl border border-[#BDE0FE] text-xs text-[#0B4F6C] space-y-2">
              <p className="font-bold">💡 Telegram နှင့် Web အပြန်အလှန် ချိတ်ဆက်ပုံ စနစ်:</p>
              <ul className="list-disc list-inside space-y-1 leading-relaxed">
                <li>စာအုပ်တစ်အုပ်ချင်းစီအလိုက် သီးသန့် Telegram Post link ရှိပါက ထိုပို့စ်ဆီသို့ တိုက်ရိုက် ဖွင့်ပေးမည် ဖြစ်ပါသည်။</li>
                <li>သီးသန့် Post link မထည့်ထားသော စာအုပ်များအတွက် အထက်ပါ ပင်မ Channel လင့်ခ်ဆီသို့ အလိုအလျောက် ညွှန်ပြပေးမည် ဖြစ်ပါသည်။</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: FATWA QUESTIONS MANAGEMENT                    */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'fatwas' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#E8DEC9] shadow-sm flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#2C1810]">
                ပြည်သူလူထု မေးမြန်းထားသော ဖသ်ဝါ ဓမ္မသတ် မေးခွန်းများ
              </h3>
              <p className="text-xs text-[#7A6353]">
                မေးမြန်းသူများ၏ မေးခွန်းများကို ကြည့်ရှု၍ အဖြေပေးခြင်း၊ အခြေအနေ ပြောင်းလဲခြင်းနှင့် ဖျက်ပစ်ခြင်း
              </p>
            </div>
          </div>

          {userFatwas.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#DFD1BF]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#34180A] mb-1">
                မေးမြန်းထားသော မေးခွန်းများ မရှိသေးပါ
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6353]">
                ပြည်သူများ ဖသ်ဝါကဏ္ဍမှတစ်ဆင့် မေးခွန်းများ ပေးပို့လာပါက ဤနေရာတွင် စနစ်တကျ ပြသပေးမည် ဖြစ်ပါသည်။
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userFatwas.map((item) => {
                const isAnswered = item.status === 'answered';
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-[#E8DEC9] shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAnswered
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isAnswered ? 'ဖြေကြားပြီး ✓' : 'ဖြေကြားရန် စောင့်ဆိုင်းဆဲ ⏳'}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-[#FAF7F2] text-[#6E421B] rounded border border-[#DECCB5]">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {item.submittedAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenAnswerModal(item)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1B3F2B] hover:bg-[#153423] text-[#E3F8EB] border border-[#2E7D4E] shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                          title="ဤမေးခွန်းအတွက် ဓမ္မသတ် အဖြေတော် တိုက်ရိုက်ရေးသားဖြေကြားမည်"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#4ADE80]" />
                          <span>{item.answerText ? 'အဖြေ ပြန်လည်ပြင်ဆင်မည်' : '✍️ အဖြေ ဖြေကြားမည်'}</span>
                        </button>

                        <button
                          onClick={() =>
                            onUpdateFatwaStatus(
                              item.id,
                              isAnswered ? 'pending' : 'answered'
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isAnswered
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          {isAnswered ? 'စောင့်ဆိုင်းဆဲသို့ ပြန်ထားမည်' : 'အဖြေပြီးအဖြစ် သတ်မှတ်မည် ✓'}
                        </button>

                        <button
                          onClick={() => onDeleteFatwa(item.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                          title="မေးခွန်းအား ဖျက်ပစ်မည်"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-[#7A6353]">
                      👤 မေးမြန်းသူ: <strong>{item.inquirerName}</strong> ({item.city || 'မြန်မာ'}) •{' '}
                      {item.contactType.toUpperCase()}: <span className="font-mono text-[#8B5A2B] font-semibold">{item.contactNumber}</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DEC9] text-xs sm:text-sm text-[#2C1810] leading-relaxed">
                      <div className="text-[11px] font-bold text-[#8C6D53] mb-1">❓ မေးမြန်းထားသော မေးခွန်း:</div>
                      {item.question}
                    </div>

                    {/* Official Answer Display */}
                    {item.answerText ? (
                      <div className="p-4 bg-emerald-50/80 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm text-emerald-950 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs sm:text-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>ဒါရုလ်အိဖ်တာအ် တရားဝင် ဓမ္မသတ် အဖြေတော် (Ruling)</span>
                          </span>
                          {item.answeredAt && (
                            <span className="text-[11px] text-emerald-700 font-mono">
                              ဖြေကြားသည့်ရက်: {item.answeredAt}
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-line leading-relaxed font-burmese text-[#1C3B28]">
                          {item.answerText}
                        </p>
                        <div className="pt-2 text-xs text-emerald-800 space-y-1 border-t border-emerald-200/60">
                          <div>📚 <strong>အထောက်အထား ကျမ်းကိုး:</strong> {item.kitabReference || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ'}</div>
                          <div>✍️ <strong>ဖြေကြားသူ:</strong> {item.scholarName || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <span>⏳ ဤမေးခွန်းအတွက် ဓမ္မသတ် အဖြေတော် မရေးသားရသေးပါ။</span>
                        <button
                          onClick={() => handleOpenAnswerModal(item)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          အခုပဲ အဖြေရေးမည်
                        </button>
                      </div>
                    )}

                    {/* WhatsApp Action Dispatch Button */}
                    {item.contactNumber && (
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/${item.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            item.answerText
                              ? `*အစ္စလာမ် ဓမ္မသတ် ဖသ်ဝါ အဖြေလွှာ*\nဒါရုလ်အိဖ်တာအ် (Islamic Research Academy)\n\n` +
                                `👤 *မေးမြန်းသူ:* ${item.inquirerName}\n` +
                                `❓ *မေးခွန်း:*\n${item.question}\n\n` +
                                `📜 *ဓမ္မသတ် အဖြေတော်:*\n${item.answerText}\n\n` +
                                `📚 *ကျမ်းကိုး:* ${item.kitabReference || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ'}\n` +
                                `✍️ *ဖြေကြားသူ:* ${item.scholarName || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့'}\n` +
                                `ရက်စွဲ: ${item.answeredAt || item.submittedAt}\n\n` +
                                `_အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်အတိုင်း ဖြေကြားထားပါသည်_`
                              : `မင်္ဂလာပါ ${item.inquirerName} ခင်ဗျာ။ အစ္စလာမ့် သုတေသန အကယ်ဒမီသို့ မေးမြန်းထားသော ဖသ်ဝါမေးခွန်းနှင့် ပတ်သက်၍ ဆက်သွယ်မေးမြန်းအပ်ပါသည်။`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>
                            {item.answerText
                              ? 'မေးမြန်းသူထံ WhatsApp ဖြင့် အဖြေတော် ချက်ချင်းပို့မည်'
                              : 'မေးမြန်းသူထံ WhatsApp ဖြင့် စကားပြောမည်'}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: TEAM MEMBERS & PHONE NUMBERS MANAGEMENT        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'team' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7C3AED]" />
                <span>အဖွဲ့အစည်း တာဝန်ခံများနှင့် ဖုန်းနံပါတ်များ စီမံခန့်ခွဲမှု</span>
              </h3>
              <p className="text-xs text-[#7A6353] mt-1">
                ဝဘ်ဆိုက်ရှိ "ဆက်သွယ်ရန်" စာမျက်နှာနှင့် Footer တွင် ပြသပေးမည့် အဖွဲ့ဝင်အမည်များ၊ ရာထူးနှင့် ဖုန်း/WhatsApp နံပါတ်များကို စိတ်ကြိုက်ပြင်ဆင်နိုင်ပါသည်
              </p>
            </div>

            <button
              onClick={handleOpenAddTeamMember}
              className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>အဖွဲ့ဝင်အသစ် ထည့်မည်</span>
            </button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#DFD1BF] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#34180A]">
                ထည့်သွင်းထားသော အဖွဲ့ဝင်နှင့် ဖုန်းနံပါတ်များ မရှိသေးပါ
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6353] max-w-md mx-auto leading-relaxed">
                Demo အချက်အလက်များ အားလုံးကို အောင်မြင်စွာ ပယ်ဖျက်ပြီးဖြစ်ပါသည်။ ယခုအခါ Admin အနေဖြင့် မိမိတို့ အဖွဲ့အစည်းဝင်များ၏ အမည်နှင့် ဖုန်းနံပါတ်များကို စိတ်ကြိုက်ထည့်သွင်းနိုင်ပါပြီ။
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenAddTeamMember}
                  className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>ပထမဆုံး အဖွဲ့ဝင် စတင်ထည့်သွင်းမည်</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-5 border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider block">
                          {member.roleMy}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-[#2C1810]">
                          {member.nameMy}
                        </h4>
                        {member.name && (
                          <p className="text-xs text-[#7A6353] font-sans">{member.name}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditTeamMember(member)}
                          className="p-2 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] rounded-xl border border-[#FCD34D] transition-colors"
                          title="အချက်အလက် ပြင်ဆင်မည်"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingMemberId(member.id)}
                          className="p-2 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B] rounded-xl border border-[#F87171] transition-colors"
                          title="အဖွဲ့ဝင်အား ဖျက်ပစ်မည်"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#5C4535] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE5D7]">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                        <span>ဖုန်းနံပါတ်: <strong className="font-mono text-[#2C1810]">{member.phoneNumber}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                        <span>WhatsApp: <strong className="font-mono text-[#2C1810]">{member.whatsappNumber}</strong></span>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#8B5A2B]">✉️</span>
                          <span>အီးမေးလ်: {member.email}</span>
                        </div>
                      )}
                      {member.activeHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                          <span>ဆက်သွယ်ချိန်: {member.activeHours}</span>
                        </div>
                      )}
                      {member.specialization && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                          <span>တာဝန်: {member.specialization}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={`tel:${member.phoneNumber}`}
                      className="flex-1 py-2 px-3 bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#3D2211] border border-[#D9C4AC] rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      <span>ဖုန်းခေါ်ကြည့်ရန်</span>
                    </a>
                    <a
                      href={`https://wa.me/${member.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                      <span>WhatsApp စမ်းသပ်</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: SECURITY & ADMIN PIN SETTINGS                 */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD1BF] shadow-sm max-w-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8DEC9]">
            <div className="w-12 h-12 rounded-2xl bg-[#24130B] text-[#D9A86B] flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2C1810]">
                Admin လုံခြုံရေး PIN ကုဒ် ပြောင်းလဲခြင်း
              </h3>
              <p className="text-xs text-[#7A6353]">
                Admin Panel ကို ခွင့်ပြုချက်မရှိဘဲ ဝင်ရောက်ခြင်းမှ ကာကွယ်ရန် PIN ကုဒ်အသစ် သတ်မှတ်ပါ
              </p>
            </div>
          </div>

          {pinChangeMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                pinChangeMessage.isError
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {pinChangeMessage.isError ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span>{pinChangeMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                လက်ရှိ PIN ကုဒ် (Current PIN)
              </label>
              <input
                type="password"
                required
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="လက်ရှိ PIN ရိုက်ပါ"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                PIN ကုဒ် အသစ် (New PIN - အနည်းဆုံး ၄ လုံး)
              </label>
              <input
                type="password"
                required
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="PIN အသစ် ရိုက်ပါ"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                PIN ကုဒ် အသစ် အတည်ပြုပါ (Confirm New PIN)
              </label>
              <input
                type="password"
                required
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="PIN အသစ် ထပ်မံရိုက်ပါ"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#8B5A2B] hover:bg-[#73431B] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm active:scale-95 transition-all"
            >
              PIN ကုဒ် အသစ် သိမ်းဆည်းမည်
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8DEC9] flex items-center justify-between text-xs text-[#7A6353]">
            <span>လက်ရှိ အသုံးပြုနေသော PIN: <strong className="font-mono text-[#8B5A2B]">•••• (သတ်မှတ်ထားပြီး)</strong></span>
            <button
              onClick={handleLockAdmin}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              ယခု သော့ခတ်ထွက်ခွာမည်
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT BOOK MODAL                          */}
      {/* ---------------------------------------------------- */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in font-burmese">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#24130B] to-[#4A2613] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9A86B]/20 flex items-center justify-center text-[#EAD8B5]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingPaper ? 'စာအုပ်စာတမ်း အချက်အလက် ပြင်ဆင်ခြင်း' : 'စာအုပ်စာတမ်း အသစ် တင်သွင်းခြင်း'}
                  </h3>
                  <p className="text-xs text-[#D9A86B]">Islamic Research Archive Publication</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBookForm} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာအုပ် / စာတမ်း ခေါင်းစဉ် (Book Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="ဥပမာ - အစ္စလာမ့်ဘဏ်လုပ်ငန်းနှင့် ဖိကဟ်ပညတ်ချက်များ..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    မူရင်းဘာသာ ခေါင်းစဉ် (Original Arabic/Urdu Script)
                  </label>
                  <input
                    type="text"
                    value={formTitleOriginal}
                    onChange={(e) => setFormTitleOriginal(e.target.value)}
                    placeholder="ဥပမာ - بحوث فقهية معاصرة..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none font-arabic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ရေးသားသူ ပညာရှင် (Author) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="ဥပမာ - မုဖ်သီ အုမရ် ဖာရူးက်..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာရေးသူ ရာထူး/ဘွဲ့ (Author Designation)
                  </label>
                  <input
                    type="text"
                    value={formAuthorTitle}
                    onChange={(e) => setFormAuthorTitle(e.target.value)}
                    placeholder="ဥပမာ - ဥက္ကဋ္ဌ၊ ဖိကဟ်သုတေသနဘုတ်အဖွဲ့..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ကဏ္ဍ (Category) *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PaperCategory)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
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
                    ဘာသာစကား (Language) *
                  </label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as LanguageType)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
                  >
                    <option value="myanmar">မြန်မာဘာသာ (Myanmar Unicode)</option>
                    <option value="arabic">العربية (Arabic)</option>
                    <option value="urdu">اردو (Urdu)</option>
                    <option value="english">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ထုတ်ဝေသည့်ခုနှစ် (Publication Year)
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2024"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာမျက်နှာ အရေအတွက် (Pages)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formPages}
                    onChange={(e) => setFormPages(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ဖိုင်အရွယ်အစား (File Size)
                  </label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="3.2 MB"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0088CC] mb-1 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 fill-current" />
                    <span>Telegram Channel Post Link (ဤစာအုပ်အား Telegram တွင်တင်ထားသော လင့်ခ်)</span>
                  </label>
                  <input
                    type="url"
                    value={formTelegramLink}
                    onChange={(e) => setFormTelegramLink(e.target.value)}
                    placeholder="https://t.me/IslamicResearchAcademy_DB/123..."
                    className="w-full px-3.5 py-2.5 bg-[#F0F8FD] border border-[#BAE6FD] rounded-xl font-mono text-xs sm:text-sm text-[#0B4F6C] outline-none focus:border-[#0088CC]"
                  />
                  <p className="text-[11px] text-[#5A7A8A] mt-1">
                    ဤနေရာတွင် ထည့်သွင်းထားပါက စာဖတ်သူ ခလုတ်နှိပ်လိုက်သည်နှင့် Telegram Channel ရှိ ထိုပို့စ်ဆီသို့ တန်းရောက်သွားပါမည်။
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာတမ်း အကျဉ်းချုပ် (Abstract) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formAbstract}
                    onChange={(e) => setFormAbstract(e.target.value)}
                    placeholder="စာအုပ်ပါ အဓိက အကြောင်းအရာ အကျဉ်းချုပ်..."
                    className="w-full p-3 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    စာအုပ် အပြည့်အစုံ စာသား (Full Reading Content)
                  </label>
                  <textarea
                    rows={6}
                    value={formFullContent}
                    onChange={(e) => setFormFullContent(e.target.value)}
                    placeholder="ဝဘ်ဆိုက်ပေါ်တွင် တိုက်ရိုက်ဖတ်ရှုနိုင်မည့် စာအုပ် စာပိုဒ်များ၊ အခန်းများကို ဤနေရာတွင် ထည့်သွင်းပါ..."
                    className="w-full p-3 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none font-sans"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    သော့ချက် စကားလုံးများ (Tags - ကော်မာခြား၍ ရေးပါ)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="ဖိကဟ်, ဟဒီးစ်, ဓမ္မသတ်..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E8DEC9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8B5A2B] hover:bg-[#73431B] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition-all"
                >
                  {editingPaper ? 'အချက်အလက် သိမ်းဆည်းမည် ✓' : 'စာအုပ်သစ် တင်သွင်းမည် ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT TEAM MEMBER MODAL                   */}
      {/* ---------------------------------------------------- */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in font-burmese">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#24130B] via-[#3B1E0F] to-[#1C0E07] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingMember ? 'အဖွဲ့ဝင်အချက်အလက် ပြင်ဆင်ခြင်း' : 'အဖွဲ့ဝင်အသစ် ထည့်သွင်းခြင်း'}
                  </h3>
                  <p className="text-xs text-[#D9A86B]">အဖွဲ့အစည်းနှင့် ဆက်သွယ်ရေး စီမံခန့်ခွဲမှု</p>
                </div>
              </div>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTeamMemberForm} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    အဖွဲ့ဝင် အမည် (မြန်မာဘာသာ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormNameMy}
                    onChange={(e) => setMemberFormNameMy(e.target.value)}
                    placeholder="ဥပမာ - မော်လာနာ / ဦးဇော်မင်း..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2211] mb-1">
                      အမည် (English)
                    </label>
                    <input
                      type="text"
                      value={memberFormNameEn}
                      onChange={(e) => setMemberFormNameEn(e.target.value)}
                      placeholder="e.g. Maulana Zaw Min"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2211] mb-1">
                      ရာထူး / တာဝန် *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberFormRoleMy}
                      onChange={(e) => setMemberFormRoleMy(e.target.value)}
                      placeholder="ဥပမာ - အထွေထွေတာဝန်ခံ Admin"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2211] mb-1">
                      ဖုန်းနံပါတ် (Phone Number) *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberFormPhone}
                      onChange={(e) => setMemberFormPhone(e.target.value)}
                      placeholder="09-xxxxxxxxx"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#22C55E] mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp နံပါတ် *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={memberFormWhatsapp}
                      onChange={(e) => setMemberFormWhatsapp(e.target.value)}
                      placeholder="+959xxxxxxxxx"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl font-mono text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#22C55E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2211] mb-1">
                      အီးမေးလ် (Email)
                    </label>
                    <input
                      type="email"
                      value={memberFormEmail}
                      onChange={(e) => setMemberFormEmail(e.target.value)}
                      placeholder="admin@islamicresearch.org"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2211] mb-1">
                      ဆက်သွယ်နိုင်သော အချိန် (Active Hours)
                    </label>
                    <input
                      type="text"
                      value={memberFormActiveHours}
                      onChange={(e) => setMemberFormActiveHours(e.target.value)}
                      placeholder="မနက် ၉:၀၀ မှ ညနေ ၅:၀၀ ထိ"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    တာဝန်ယူမှု နယ်ပယ် (Specialization / Duty)
                  </label>
                  <input
                    type="text"
                    value={memberFormSpecialization}
                    onChange={(e) => setMemberFormSpecialization(e.target.value)}
                    placeholder="ဥပမာ - စာတမ်းစိစစ်ရေး၊ ဖသ်ဝါမေးမြန်းမှု၊ စာအုပ်ဒေတာဘေ့စ်"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E8DEC9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition-all"
                >
                  {editingMember ? 'အချက်အလက် သိမ်းဆည်းမည် ✓' : 'အဖွဲ့ဝင်သစ် ထည့်သွင်းမည် ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ANSWER FATWA MODAL (မေးခွန်းအဖြေ ဖြေကြားခြင်း) */}
      {/* ---------------------------------------------------- */}
      {answeringFatwa && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DFD1BF] overflow-hidden animate-scale-up font-burmese my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1B3F2B] via-[#244E36] to-[#153423] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#E3F8EB]">
                    ဖသ်ဝါ ဓမ္မသတ် အဖြေလွှာ ရေးသားဖြေကြားခြင်း
                  </h3>
                  <p className="text-xs text-[#A7F3D0]">
                    ဒါရုလ်အိဖ်တာအ် • အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAnsweringFatwa(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Question Box */}
            <div className="p-5 bg-[#FAF7F2] border-b border-[#E8DEC9] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#6E421B] px-2.5 py-0.5 rounded-full bg-white border border-[#D9C4AC]">
                  ကဏ္ဍ: {answeringFatwa.category}
                </span>
                <span className="text-gray-500 font-mono">
                  မေးမြန်းရက်: {answeringFatwa.submittedAt}
                </span>
              </div>
              <div className="text-xs text-[#7A6353]">
                👤 မေးမြန်းသူ: <strong>{answeringFatwa.inquirerName}</strong> ({answeringFatwa.city || 'မြန်မာ'}) •{' '}
                {answeringFatwa.contactType.toUpperCase()}: <span className="font-mono text-[#8B5A2B]">{answeringFatwa.contactNumber}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#D9C4AC] text-xs sm:text-sm text-[#2C1810] font-semibold leading-relaxed">
                ❓ {answeringFatwa.question}
              </div>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSaveAnswerSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#2C1810] mb-1.5">
                  ၁။ ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ် အဖြေတော် (Ruling & Explanation) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={answerTextInput}
                  onChange={(e) => setAnswerTextInput(e.target.value)}
                  placeholder="ဥပမာ - မေးမြန်းထားသော ကိစ္စနှင့် ပတ်သက်၍ အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီဖိကဟ် ဓမ္မသတ်အရ အောက်ပါအတိုင်း ဆုံးဖြတ်ဖြေကြားအပ်ပါသည်..."
                  className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#D9C4AC] rounded-2xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#1B3F2B] leading-relaxed transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1.5">
                    ၂။ အထောက်အထား ကျမ်းကိုးများ (Kitab References)
                  </label>
                  <input
                    type="text"
                    value={kitabReferenceInput}
                    onChange={(e) => setKitabReferenceInput(e.target.value)}
                    placeholder="ဥပမာ - ရဒ်ဒုလ်မုဟ်တာရ် အတွဲ ၁၊ ဖတာဝါ ဟိန္ဒီယာ..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#1B3F2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1.5">
                    ၃။ ဖြေကြားသူ မုဖ်သီ / ဓမ္မသတ်အဖွဲ့ အမည်
                  </label>
                  <input
                    type="text"
                    value={scholarNameInput}
                    onChange={(e) => setScholarNameInput(e.target.value)}
                    placeholder="ဥပမာ - ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#1B3F2B]"
                  />
                </div>
              </div>

              {/* Submit Action Buttons */}
              <div className="pt-4 border-t border-[#E8DEC9] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAnsweringFatwa(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                >
                  မလုပ်တော့ပါ
                </button>

                <div className="flex items-center gap-2">
                  {answeringFatwa.contactNumber && (
                    <a
                      href={`https://wa.me/${answeringFatwa.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `*အစ္စလာမ် ဓမ္မသတ် ဖသ်ဝါ အဖြေလွှာ*\nဒါရုလ်အိဖ်တာအ် (Islamic Research Academy)\n\n` +
                        `👤 *မေးမြန်းသူ:* ${answeringFatwa.inquirerName}\n` +
                        `❓ *မေးခွန်း:*\n${answeringFatwa.question}\n\n` +
                        `📜 *ဓမ္မသတ် အဖြေတော်:*\n${answerTextInput || 'အဖြေအား ဝဘ်ဆိုက်တွင် ကြည့်ရှုနိုင်ပါသည်'}\n\n` +
                        `📚 *ကျမ်းကိုး:* ${kitabReferenceInput || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ'}\n` +
                        `✍️ *ဖြေကြားသူ:* ${scholarNameInput || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့'}\n` +
                        `ရက်စွဲ: ${new Date().toISOString().split('T')[0]}\n\n` +
                        `_အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်အတိုင်း ဖြေကြားထားပါသည်_`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp သို့ ပို့မည်</span>
                    </a>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B3F2B] hover:bg-[#153423] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                    <span>အဖြေ သိမ်းဆည်း/ထုတ်ပြန်မည် ✓</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: DELETE BOOK CONFIRMATION MODAL                 */}
      {/* ---------------------------------------------------- */}
      {deletingPaperId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-red-200 animate-scale-up font-burmese">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              ဤစာအုပ်အား အပြီးအပိုင် ဖျက်ပစ်ရန် သေချာပါသလား?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              စာအုပ်ကို ဖျက်ပစ်လိုက်ပါက ဝဘ်ဆိုက်နှင့် စာကြည့်တိုက်စာရင်းမှ အပြီးအပိုင် ပျောက်ကွယ်သွားမည် ဖြစ်ပါသည်။
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingPaperId(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                မဖျက်တော့ပါ
              </button>
              <button
                onClick={handleConfirmDeleteBook}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                သေချာပါသည်၊ ဖျက်မည်
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: DELETE TEAM MEMBER CONFIRMATION MODAL          */}
      {/* ---------------------------------------------------- */}
      {deletingMemberId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-red-200 animate-scale-up font-burmese">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              ဤအဖွဲ့ဝင်အား စာရင်းမှ ဖယ်ရှားရန် သေချာပါသလား?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              အဖွဲ့ဝင်အချက်အလက်ကို ဖျက်ပစ်လိုက်ပါက ဝဘ်ဆိုက်နှင့် ဆက်သွယ်ရေးစာမျက်နှာများမှ ပျောက်ကွယ်သွားမည် ဖြစ်ပါသည်။
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingMemberId(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                မဖျက်တော့ပါ
              </button>
              <button
                onClick={handleConfirmDeleteTeamMember}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                သေချာပါသည်၊ ဖျက်မည်
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
