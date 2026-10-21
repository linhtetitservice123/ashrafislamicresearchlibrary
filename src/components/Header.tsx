import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  FileQuestion,
  PhoneCall,
  Bookmark,
  Menu,
  X,
  MessageCircle,
  Sparkles,
  Github,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  openUploadModal: () => void;
  openRequestModal: () => void;
  openAdminModal: () => void;
  openGitHubModal: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openUploadModal,
  openRequestModal,
  openAdminModal,
  openGitHubModal,
  bookmarkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'papers', label: 'စာတမ်းများ', labelEn: 'Papers Repository', icon: BookOpen },
    { id: 'requests', label: 'စာတမ်းတောင်းဆိုချက်များ', labelEn: 'Requests Board', icon: FileQuestion },
    { id: 'bookmarks', label: 'သိမ်းဆည်းထားသည်များ', labelEn: 'Saved', icon: Bookmark, badge: bookmarkCount },
    { id: 'contact', label: 'Admin ဆက်သွယ်ရန်', labelEn: 'Contact Admins', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#24130B] border-b border-[#4A2E19] text-[#F5EFE6] shadow-xl">
      {/* Top Banner with Arabic Calligraphy & Bismillah */}
      <div className="bg-[#180C07] text-[#D9A86B] text-xs py-1.5 px-4 border-b border-[#3D2213] flex justify-between items-center text-center">
        <div className="hidden md:flex items-center gap-2 text-[13px] font-medium tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A86B]/70 inline-block"></span>
          <span>Islamic Research Academy</span>
          <span className="text-[#8C5D30]">|</span>
          <span className="font-burmese">သုတေသနနှင့် ဓမ္မသတ်ပညာရေး ဗဟိုဌာန</span>
        </div>
        <div className="mx-auto md:mx-0 font-arabic text-sm tracking-wide text-[#EAD8B5]">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَقُل رَّبِّ زِدْنِي عِلْمًا
        </div>
        <div className="hidden lg:flex items-center gap-3 text-xs text-[#C69C6D]">
          <button
            onClick={openGitHubModal}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="font-sans">GitHub Guide</span>
          </button>
          <span>WhatsApp Helpline: 09-777112233</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Academy Name */}
          <button
            onClick={() => setCurrentTab('papers')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
          >
            {/* Crest Emblem */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5A2B] via-[#633A18] to-[#3B1E08] p-0.5 shadow-md flex items-center justify-center border border-[#D9A86B]/40 group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[10px] bg-[#1E0F08] flex items-center justify-center relative overflow-hidden">
                <BookOpen className="w-6 h-6 text-[#EAD8B5] relative z-10" />
                <div className="absolute inset-0 bg-[#8B5A2B]/10 rotate-45 transform"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-[#FAF7F2] group-hover:text-[#D9A86B] transition-colors">
                  ISLAMIC RESEARCH ACADEMY
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8B5A2B]/40 text-[#EAD8B5] border border-[#8B5A2B] font-mono hidden sm:inline">
                  IRA
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[#D4B996] font-burmese font-medium">
                <span>အစ္စလာမ့် သုတေသန အကယ်ဒမီ</span>
                <span className="text-[#8C5D30]">•</span>
                <span className="font-arabic text-xs text-[#C69C6D]">أكاديمية البحوث الإسلامية</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-[#402312] text-[#F3E5D0] border border-[#8B5A2B]/60 shadow-inner'
                      : 'text-[#D4B996] hover:bg-[#341B0D] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A86B]' : 'text-[#A67C52]'}`} />
                  <span className="font-burmese">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#8B5A2B] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: GitHub Guide, Upload Paper & WhatsApp Admin Direct button */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={openGitHubModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-[#EAD8B5] text-xs font-medium rounded-lg border border-white/20 transition-all font-burmese"
              title="GitHub ဖြင့် Website ပြုလုပ်/လွှင့်တင်နည်း လမ်းညွှန်"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub တင်နည်း</span>
            </button>

            <button
              onClick={openUploadModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5A2B] to-[#6E421C] hover:from-[#9D6833] hover:to-[#7E4C21] text-[#FAF7F2] text-sm font-semibold rounded-lg shadow border border-[#D9A86B]/30 hover:shadow-lg transition-all"
            >
              <Upload className="w-4 h-4 text-[#EAD8B5]" />
              <span className="font-burmese">စာတမ်းတင်မည်</span>
            </button>

            <button
              onClick={openAdminModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1B3F2B] hover:bg-[#235338] text-[#E3F8EB] text-sm font-medium rounded-lg border border-[#2E7D4E]/60 shadow-sm transition-all group"
              title="Admin WhatsApp & Phone"
            >
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#22C55E]"></span>
              </div>
              <span className="font-burmese font-medium">WhatsApp Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openAdminModal}
              className="p-2 bg-[#1B3F2B] text-[#4ADE80] rounded-lg border border-[#2E7D4E]/50"
              aria-label="WhatsApp Admin"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#D4B996] hover:bg-[#341B0D] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1D0F08] border-b border-[#4A2E19] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#3E2111] text-[#FAF7F2] border border-[#8B5A2B]'
                    : 'text-[#D4B996] hover:bg-[#2C180E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#D9A86B]" />
                  <span className="font-burmese">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-[#8B5A2B] text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#3B1F0E] space-y-2">
            <button
              onClick={() => {
                openGitHubModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/15 text-[#EAD8B5] rounded-lg text-xs font-burmese font-medium border border-white/20"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub ဖြင့် Website ပြုလုပ်/လွှင့်တင်နည်း လမ်းညွှန်</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  openUploadModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#8B5A2B] text-white rounded-lg text-sm font-burmese font-medium"
              >
                <Upload className="w-4 h-4" />
                <span>စာတမ်းတင်မည်</span>
              </button>
              <button
                onClick={() => {
                  openRequestModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#3D2414] border border-[#8B5A2B]/60 text-[#FAF7F2] rounded-lg text-sm font-burmese font-medium"
              >
                <FileQuestion className="w-4 h-4" />
                <span>စာတမ်းတောင်းဆို</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
