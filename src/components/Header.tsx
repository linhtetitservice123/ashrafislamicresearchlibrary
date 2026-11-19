import React, { useState } from 'react';
import {
  BookOpen,
  PhoneCall,
  Bookmark,
  Menu,
  X,
  MessageCircle,
  ShieldCheck,
  LogIn,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { SiteConfig } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  openAdminModal: () => void;
  bookmarkCount: number;
  authUser: User | null;
  authLoading: boolean;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  siteConfig: SiteConfig;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openAdminModal,
  bookmarkCount,
  authUser,
  authLoading,
  isAdmin,
  onLogin,
  onLogout,
  siteConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    isAdminItem?: boolean;
  }

  const publicNavItems: NavItem[] = [
    { id: 'papers', label: 'စာတမ်းများ', icon: BookOpen },
    ...(siteConfig.enableFatwaSection || isAdmin
      ? [{ id: 'fatwa', label: 'ဖသ်ဝါ', icon: ShieldCheck }]
      : []),
    { id: 'bookmarks', label: 'သိမ်းဆည်းမှု', icon: Bookmark, badge: bookmarkCount },
    ...(siteConfig.enableContactTab || isAdmin
      ? [{ id: 'contact', label: 'ဆက်သွယ်ရန်', icon: PhoneCall }]
      : []),
  ];

  const navItems: NavItem[] = isAdmin
    ? [
        ...publicNavItems,
        { id: 'admin', label: 'Admin Panel', icon: SlidersHorizontal, isAdminItem: true },
      ]
    : publicNavItems;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#24130B] border-b border-[#4A2E19] text-[#F5EFE6] shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
          {/* Logo & Academy Name */}
          <button
            onClick={() => setCurrentTab('papers')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#8B5A2B] via-[#633A18] to-[#3B1E08] p-0.5 shadow-md flex items-center justify-center border border-[#D9A86B]/40 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-[10px] bg-[#1E0F08] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#EAD8B5]" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="font-cinzel text-sm sm:text-base lg:text-lg font-bold tracking-wider text-[#FAF7F2] group-hover:text-[#D9A86B] transition-colors truncate">
                {siteConfig.siteNameEn}
              </div>
              <div className="text-[11px] sm:text-xs text-[#D4B996] font-burmese font-medium truncate">
                {siteConfig.siteNameMy}
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isAdminNav = 'isAdminItem' in item && item.isAdminItem;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? isAdminNav
                        ? 'bg-[#8B5A2B] text-white border border-[#D9A86B] shadow-md'
                        : 'bg-[#402312] text-[#F3E5D0] border border-[#8B5A2B]/60 shadow-inner'
                      : isAdminNav
                      ? 'bg-[#3B1E0F] text-[#EAD8B5] border border-[#8B5A2B]/50 hover:bg-[#522B16]'
                      : 'text-[#D4B996] hover:bg-[#341B0D] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FDEBD0]' : 'text-[#C69C6D]'}`} />
                  <span className="font-burmese">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-[#8B5A2B] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: WhatsApp + Google Login/Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop WhatsApp Quick Button */}
            {(siteConfig.enableWhatsappFloat || isAdmin) && (
              <button
                onClick={openAdminModal}
                className="hidden xl:flex items-center gap-2 px-3 py-2 bg-[#1B3F2B] hover:bg-[#235338] text-[#E3F8EB] text-xs font-medium rounded-xl border border-[#2E7D4E]/60 shadow-sm transition-all whitespace-nowrap"
                title="WhatsApp ဆက်သွယ်ရန်"
              >
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span className="font-burmese">WhatsApp</span>
              </button>
            )}

            {/* Google Auth Button */}
            {!authUser ? (
              <button
                onClick={onLogin}
                disabled={authLoading}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#8B5A2B] hover:bg-[#9D6833] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-xl border border-[#D9A86B]/50 shadow-sm transition-all whitespace-nowrap"
                title="Google အကောင့်ဖြင့် ဝင်ရောက်မည်"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span className="font-burmese">Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <div
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#341B0D] border border-[#5C381E] max-w-[155px]"
                  title={authUser.email || ''}
                >
                  {authUser.photoURL ? (
                    <img
                      src={authUser.photoURL}
                      alt={authUser.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-[#D9A86B]/40"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {(authUser.displayName || authUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-[#EAD8B5] truncate">
                    {authUser.displayName || authUser.email}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] text-xs font-medium border border-white/15 transition-colors whitespace-nowrap"
                  title="အကောင့်မှ ထွက်မည်"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline font-burmese">Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#D4B996] hover:bg-[#341B0D] focus:outline-none border border-[#4A2E19]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1D0F08] border-t border-[#4A2E19] px-4 pt-3 pb-5 space-y-2">
          {authUser && (
            <div className="sm:hidden flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#2C180E] border border-[#4A2E19] mb-2">
              {authUser.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt={authUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#8B5A2B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {(authUser.displayName || authUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#FAF7F2] truncate">
                  {authUser.displayName || 'User'}
                </div>
                <div className="text-[11px] text-[#C69C6D] truncate">{authUser.email}</div>
              </div>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isAdminNav = 'isAdminItem' in item && item.isAdminItem;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? isAdminNav
                      ? 'bg-[#8B5A2B] text-white border border-[#D9A86B]'
                      : 'bg-[#3E2111] text-[#FAF7F2] border border-[#8B5A2B]'
                    : isAdminNav
                    ? 'bg-[#341B0D] text-[#EAD8B5] border border-[#8B5A2B]/40'
                    : 'text-[#D4B996] hover:bg-[#2C180E]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 text-[#D9A86B] shrink-0" />
                  <span className="font-burmese truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-[#8B5A2B] text-white text-xs font-bold rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {(siteConfig.enableWhatsappFloat || isAdmin) && (
            <div className="pt-2 border-t border-[#3B1F0E]">
              <button
                onClick={() => {
                  openAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1B3F2B] border border-[#2E7D4E]/60 text-[#E3F8EB] rounded-xl text-xs font-burmese font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span>WhatsApp တိုက်ရိုက်ဆက်သွယ်ရန်</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
