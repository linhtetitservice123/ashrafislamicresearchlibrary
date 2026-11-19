import React from 'react';
import {
  Search,
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  MessageCircle,
  X,
} from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openFatwaTab?: () => void;
  openAdminModal?: () => void;
  totalPapers: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  openFatwaTab,
  openAdminModal,
  totalPapers,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-[#2B170E] via-[#351E12] to-[#FAF7F2] pt-8 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E3D7C5]">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-islamic-pattern mix-blend-overlay"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4 break-words">
          <span className="block font-cinzel text-[#FDFBF7] drop-shadow-sm">
            ISLAMIC RESEARCH ACADEMY
          </span>
          <span className="block text-xl sm:text-3xl md:text-4xl text-[#E8CBA5] font-burmese font-semibold mt-2">
            သာသနာရေးရာ သုတေသနစာတမ်းများ ပလက်ဖောင်း
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-base text-[#DBC2A6] font-burmese leading-relaxed mb-6 sm:mb-8">
          ကုရ်အာန်၊ ဟဒီးစ်၊ ဖိကဟ် ဓမ္မသတ်နှင့် အစ္စလာမ့် သာသနာရေးရာ သုတေသနစာတမ်းများကို တစ်စုတစ်စည်းတည်း လေ့လာဖတ်ရှုနိုင်ပြီး ဖသ်ဝါဓမ္မသတ်များကို မေးမြန်းနိုင်ပါသည်။
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl border-2 border-[#8B5A2B]/40 focus-within:border-[#8B5A2B] transition-all p-1.5">
            <div className="pl-3 pr-2 text-[#8B5A2B] shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="စာတမ်းခေါင်းစဉ်၊ ရေးသားသူပညာရှင်၊ သော့ချက်စကားလုံးဖြင့် ရှာဖွေပါ..."
              className="w-full min-w-0 bg-transparent text-[#2C1810] placeholder-[#8F7E73] text-xs sm:text-base py-2.5 pr-2 focus:outline-none font-burmese"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-1 text-[#8B5A2B] hover:text-[#5C361C] rounded-lg hover:bg-[#FAF7F2] shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:block pr-1 shrink-0">
              <span className="px-3 py-1.5 bg-[#F4EFE6] text-[#633A18] text-xs font-semibold rounded-xl border border-[#D9C4AC] whitespace-nowrap">
                အမြန်ရှာ
              </span>
            </div>
          </div>
        </div>

        {/* Fatwa CTA */}
        {openFatwaTab && (
          <div className="flex items-center justify-center mb-8 sm:mb-10">
            <button
              onClick={openFatwaTab}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#402312] hover:bg-[#2C180E] text-[#FDEBD0] font-bold rounded-2xl shadow-xl border-2 border-[#D9A86B] transition-all font-burmese text-xs sm:text-base group ring-2 ring-[#D9A86B]/30 hover:scale-[1.02] active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-[#D9A86B] shrink-0 group-hover:scale-110 transition-transform" />
              <span>ဖသ်ဝါ မေးမြန်း/ဖတ်ရှုရန် (Fatwa)</span>
            </button>
          </div>
        )}

        {/* Quick Academy Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-xl p-3.5 sm:p-4 border border-[#E0D3C1] shadow-sm text-left flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#8B5A2B] text-[11px] sm:text-xs font-medium mb-1 font-burmese">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">စုစုပေါင်းစာတမ်း</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-[#2C1810]">
              {totalPapers} <span className="text-[11px] sm:text-xs text-[#7A6253] font-normal">Papers</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-xl p-3.5 sm:p-4 border border-[#E0D3C1] shadow-sm text-left flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#8B5A2B] text-[11px] sm:text-xs font-medium mb-1 font-burmese">
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">စိစစ်အတည်ပြုပြီး</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-[#2C1810]">
              100% <span className="text-[11px] sm:text-xs text-[#7A6353] font-normal">Verified</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-xl p-3.5 sm:p-4 border border-[#E0D3C1] shadow-sm text-left flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#8B5A2B] text-[11px] sm:text-xs font-medium mb-1 font-burmese">
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">သုတေသန ကဏ္ဍ</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-burmese text-[#2C1810]">
              ၇ ကဏ္ဍ <span className="text-[11px] sm:text-xs text-[#7A6253] font-normal font-sans">Categories</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openAdminModal}
            className="bg-white/95 hover:bg-white backdrop-blur rounded-xl p-3.5 sm:p-4 border border-[#E0D3C1] hover:border-[#2E7D4E]/50 shadow-sm text-left flex flex-col justify-between transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[#1E5638] text-[11px] sm:text-xs font-medium mb-1 font-burmese">
              <MessageCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span className="truncate">အကူအညီ / ဆွေးနွေး</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1E5638] font-burmese flex items-center justify-between gap-2">
              <span className="truncate">WhatsApp တိုက်ရိုက်</span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
