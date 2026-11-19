import React from 'react';
import { BookOpen, Phone, MessageCircle, Mail } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { PaperCategory, AdminContact, SiteConfig } from '../types';

interface FooterProps {
  onSelectCategory: (cat: PaperCategory | 'all') => void;
  openAdminModal: () => void;
  openFatwaSection?: () => void;
  teamMembers?: AdminContact[];
  siteConfig: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  openAdminModal,
  openFatwaSection,
  teamMembers = [],
  siteConfig,
}) => {
  const primaryContact = teamMembers.length > 0 ? teamMembers[0] : null;

  return (
    <footer className="bg-[#1C0F08] border-t border-[#3E2111] text-[#EAD8C7] font-burmese">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5A2B] flex items-center justify-center border border-[#D9A86B]/40 shrink-0">
                <BookOpen className="w-5 h-5 text-[#FAF7F2]" />
              </div>
              <div className="min-w-0">
                <span className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wide block truncate">
                  {siteConfig.siteNameEn}
                </span>
                <span className="text-xs text-[#D9A86B] block truncate">
                  {siteConfig.siteNameMy}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C7B29F] leading-relaxed">
              {siteConfig.footerDescription}
            </p>
          </div>

          {/* Col 2: Categories */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#3E2111] pb-2">
              သုတေသန ကဏ္ဍများ
            </h4>
            <ul className="space-y-2 text-xs text-[#D9C4AC]">
              {Object.entries(CATEGORIES_CONFIG).slice(0, 5).map(([key, config]) => (
                <li key={key}>
                  <button
                    onClick={() => onSelectCategory(key as PaperCategory)}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    • {config.nameMy}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Services */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#3E2111] pb-2">
              အကယ်ဒမီ ဝန်ဆောင်မှုများ
            </h4>
            <ul className="space-y-2 text-xs text-[#D9C4AC]">
              {openFatwaSection && siteConfig.enableFatwaSection && (
                <li>
                  <button
                    onClick={openFatwaSection}
                    className="hover:text-white hover:underline text-left text-[#D9A86B] font-semibold"
                  >
                    • အစ္စလာမ့် ဓမ္မသတ် ဖသ်ဝါ မေးမြန်း/ဖတ်ရှုရန်
                  </button>
                </li>
              )}
              {siteConfig.enableWhatsappFloat && (
                <li>
                  <button
                    onClick={openAdminModal}
                    className="hover:text-white hover:underline text-left"
                  >
                    • WhatsApp ဖြင့် ပညာရှင်များအား တိုက်ရိုက်မေးမြန်းရန်
                  </button>
                </li>
              )}
              <li>
                <span className="text-[#8C7667]">
                  • အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp Helpline */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#3E2111] pb-2">
              တိုက်ရိုက် ဆက်သွယ်ရန်
            </h4>
            <div className="space-y-3 text-xs text-[#D9C4AC]">
              {primaryContact ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageCircle className="w-4 h-4 text-[#4ADE80] shrink-0" />
                    <span className="truncate">WhatsApp: {primaryContact.displayWhatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-4 h-4 text-[#D9A86B] shrink-0" />
                    <span className="truncate">ဖုန်း: {primaryContact.displayPhone}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>ဆက်သွယ်ရေး ဖုန်းနံပါတ်များကို ဆက်သွယ်ရန် စာမျက်နှာတွင် ကြည့်ရှုနိုင်ပါသည်</span>
                </div>
              )}
              {siteConfig.contactEmail && (
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 text-[#D9A86B] shrink-0" />
                  <span className="truncate">{siteConfig.contactEmail}</span>
                </div>
              )}

              {siteConfig.enableWhatsappFloat && (
                <div className="pt-2">
                  <button
                    onClick={openAdminModal}
                    className="w-full py-2.5 px-3 bg-[#1B3F2B] hover:bg-[#153423] text-[#E3F8EB] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-[#2E7D4E]/60 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                    <span>WhatsApp စကားပြောရန်</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#120804] border-t border-[#2C1810] py-4 px-4 text-xs text-[#8C7667]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} {siteConfig.footerCopyright}
          </div>
          <div className="text-[11px] text-[#6E5644]">
            {siteConfig.footerTagline}
          </div>
        </div>
      </div>
    </footer>
  );
};
