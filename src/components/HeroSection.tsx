import React from 'react';
import {
  Search,
  Upload,
  FileQuestion,
  MessageCircle,
  BookOpen,
  Award,
  Globe2,
  Users,
  Sparkles,
} from 'lucide-react';
import { LanguageType } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLanguage: LanguageType | 'all';
  setSelectedLanguage: (lang: LanguageType | 'all') => void;
  openUploadModal: () => void;
  openRequestModal: () => void;
  openAdminModal: () => void;
  totalPapers: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLanguage,
  setSelectedLanguage,
  openUploadModal,
  openRequestModal,
  openAdminModal,
  totalPapers,
}) => {
  const languages: { id: LanguageType | 'all'; label: string; script: string; fontClass: string }[] = [
    { id: 'all', label: 'ဘာသာစကားအားလုံး', script: 'All Languages', fontClass: 'font-burmese' },
    { id: 'myanmar', label: 'မြန်မာဘာသာ', script: 'Myanmar', fontClass: 'font-burmese' },
    { id: 'arabic', label: 'العربية', script: 'Al Qalam Arabic', fontClass: 'font-arabic' },
    { id: 'urdu', label: 'اردو', script: 'Nastaleeq Urdu', fontClass: 'font-urdu text-lg' },
    { id: 'english', label: 'English', script: 'Scholarly Serif', fontClass: 'font-cinzel text-xs' },
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#2B170E] via-[#351E12] to-[#FAF7F2] pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E3D7C5]">
      {/* Decorative Islamic Geometric subtle background watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-islamic-pattern mix-blend-overlay"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Academic Institution Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/10 backdrop-blur-sm border border-[#D9A86B]/30 text-[#EAD8B5] text-xs sm:text-sm font-medium mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E5B57A]" />
          <span className="font-burmese">အစ္စလာမ့် သာသနာရေးရာ သုတေသန နှင့် ဓမ္မသတ် ကျမ်းစာမော်ကွန်း</span>
          <span className="hidden sm:inline text-[#A67C52]">|</span>
          <span className="hidden sm:inline font-arabic text-xs">معهد البحوث الشرعية</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          <span className="block font-cinzel text-[#FDFBF7] drop-shadow-sm">
            ISLAMIC RESEARCH ACADEMY
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl text-[#E8CBA5] font-burmese font-semibold mt-2">
            သာသနာရေးရာ သုတေသနစာတမ်းများ ပလက်ဖောင်း
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#DBC2A6] font-burmese leading-relaxed mb-8">
          ကုရ်အာန်၊ ဟဒီးစ်၊ ဖိကဟ် ဓမ္မသတ်နှင့် မျက်မှောက်ခေတ် အစ္စလာမ့်လူမှုရေးရာ စာတမ်းများကို တစ်စုတစ်စည်းတည်း
          လေ့လာဖတ်ရှုနိုင်ပါသည်။ လိုအပ်သော ကျမ်းစာစာတမ်းများကို မေတ္တာရပ်ခံတောင်းဆိုနိုင်ပြီး၊ ကိုယ်တိုင်ရေးသားထားသော
          စာတမ်းများကိုလည်း လွတ်လပ်စွာ မျှဝေတင်သွင်းနိုင်ပါသည်။
        </p>

        {/* Search Bar - Centerpiece */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl border-2 border-[#8B5A2B]/40 focus-within:border-[#8B5A2B] transition-all p-1.5">
            <div className="pl-3 pr-2 text-[#8B5A2B]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="စာတမ်းခေါင်းစဉ်၊ ရေးသားသူပညာရှင်၊ သော့ချက်စကားလုံးဖြင့် ရှာဖွေပါ (Title, Author, Subject)..."
              className="w-full bg-transparent text-[#2C1810] placeholder-[#8F7E73] text-sm sm:text-base py-2.5 pr-3 focus:outline-none font-burmese"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-xs text-[#8B5A2B] hover:text-[#5C361C] font-semibold"
              >
                ရှင်းမည်
              </button>
            )}
            <div className="hidden sm:block pr-1">
              <span className="px-3 py-1.5 bg-[#F4EFE6] text-[#633A18] text-xs font-semibold rounded-xl border border-[#D9C4AC]">
                အမြန်ရှာ
              </span>
            </div>
          </div>
        </div>

        {/* Language Filter Pills with native typography display */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-[#EAD8B5] font-burmese font-medium mr-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-[#D9A86B]" /> ဘာသာစကား:
          </span>
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#FAF7F2] text-[#3B1E08] font-bold border-white shadow-md scale-105'
                    : 'bg-[#24130B]/70 text-[#EAD8B5] border-[#5E381C] hover:bg-[#3E2111] hover:text-white'
                }`}
              >
                <span className={lang.fontClass}>{lang.label}</span>
                <span className="text-[10px] opacity-70">({lang.script})</span>
              </button>
            );
          })}
        </div>

        {/* Action CTAs in Hero */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-5 py-3 bg-[#8B5A2B] hover:bg-[#73431B] text-white font-medium rounded-xl shadow-lg border border-[#D9A86B]/40 transition-all font-burmese text-sm group"
          >
            <Upload className="w-4 h-4 text-[#FDEBD0] group-hover:-translate-y-0.5 transition-transform" />
            <span>စာတမ်းသစ် တင်သွင်းမည် (Upload)</span>
          </button>

          <button
            onClick={openRequestModal}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#F8F4EE] text-[#42220E] font-medium rounded-xl shadow-md border border-[#D4C3AF] transition-all font-burmese text-sm"
          >
            <FileQuestion className="w-4 h-4 text-[#8B5A2B]" />
            <span>စာတမ်း/ကျမ်း တောင်းဆိုမည် (Request)</span>
          </button>

          <button
            onClick={openAdminModal}
            className="flex items-center gap-2 px-5 py-3 bg-[#1B3F2B] hover:bg-[#153423] text-[#E3F8EB] font-medium rounded-xl shadow-md border border-[#3E9261]/50 transition-all font-burmese text-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
            <span>WhatsApp Admin တိုက်ရိုက်ဆက်သွယ်မည်</span>
          </button>
        </div>

        {/* Quick Academy Stats Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
          <div className="bg-white/90 backdrop-blur rounded-xl p-3.5 border border-[#E0D3C1] shadow-sm text-left">
            <div className="flex items-center gap-2 text-[#8B5A2B] text-xs font-medium mb-1 font-burmese">
              <BookOpen className="w-4 h-4" /> စုစုပေါင်းစာတမ်း
            </div>
            <div className="text-2xl font-bold font-cinzel text-[#2C1810]">
              {totalPapers}+ <span className="text-xs text-[#7A6253] font-normal">Papers</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-3.5 border border-[#E0D3C1] shadow-sm text-left">
            <div className="flex items-center gap-2 text-[#8B5A2B] text-xs font-medium mb-1 font-burmese">
              <Award className="w-4 h-4" /> စိစစ်အတည်ပြုပြီး
            </div>
            <div className="text-2xl font-bold font-cinzel text-[#2C1810]">
              100% <span className="text-xs text-[#7A6253] font-normal">Verified</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-3.5 border border-[#E0D3C1] shadow-sm text-left">
            <div className="flex items-center gap-2 text-[#8B5A2B] text-xs font-medium mb-1 font-burmese">
              <Globe2 className="w-4 h-4" /> ၄ ဘာသာ မော်ကွန်း
            </div>
            <div className="text-xs font-semibold text-[#42220E] mt-1.5 flex items-center gap-1">
              <span>မြန်မာ</span> • <span className="font-arabic">عربي</span> • <span className="font-urdu">اردو</span> • <span>EN</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-3.5 border border-[#E0D3C1] shadow-sm text-left">
            <div className="flex items-center gap-2 text-[#1E5638] text-xs font-medium mb-1 font-burmese">
              <MessageCircle className="w-4 h-4 text-[#22C55E]" /> အကူအညီ / ဆွေးနွေး
            </div>
            <div className="text-sm font-bold text-[#1E5638] mt-1 font-burmese flex items-center justify-between">
              <span>WhatsApp တိုက်ရိုက်</span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
