import React from 'react';
import { BookOpen, Phone, MessageCircle, Lock, Mail } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { PaperCategory, AdminContact } from '../types';

interface FooterProps {
  onSelectCategory: (cat: PaperCategory | 'all') => void;
  openAdminModal: () => void;
  openUploadModal?: () => void;
  openFatwaSection?: () => void;
  openAdminPanel?: () => void;
  teamMembers?: AdminContact[];
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  openAdminModal,
  openFatwaSection,
  openAdminPanel,
  teamMembers = [],
}) => {
  const primaryContact = teamMembers.length > 0 ? teamMembers[0] : null;

  return (
    <footer className="bg-[#1C0F08] border-t border-[#3E2111] text-[#EAD8C7] font-burmese">
      {/* Top Footer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5A2B] flex items-center justify-center border border-[#D9A86B]/40">
                <BookOpen className="w-5 h-5 text-[#FAF7F2]" />
              </div>
              <div>
                <span className="font-cinzel text-base font-bold text-white tracking-wide block">
                  ISLAMIC RESEARCH ACADEMY
                </span>
                <span className="text-xs text-[#D9A86B]">အစ္စလာမ့် သုတေသန အကယ်ဒမီ</span>
              </div>
            </div>

            <p className="text-xs text-[#C7B29F] leading-relaxed">
              ကုရ်အာန်ကျမ်းတော်မြတ်၊ ဟဒီးစ်တော်များနှင့် စစ်မှန်သော ဓမ္မသတ်ပညာရှင်ကြီးများ၏ လမ်းညွှန်မှုဖြင့်
              သာသနာရေးရာ သုတေသနစာတမ်းများကို စုစည်းထိန်းသိမ်းဖြန့်ဝေပေးလျက်ရှိသော ပလက်ဖောင်း ဖြစ်ပါသည်။
            </p>

            <div className="font-arabic text-sm text-[#D9A86B] tracking-wide pt-1">
              أكاديمية البحوث والدراسات الإسلامية
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
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
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#3E2111] pb-2">
              အကယ်ဒမီ ဝန်ဆောင်မှုများ
            </h4>
            <ul className="space-y-2 text-xs text-[#D9C4AC]">
              {openFatwaSection && (
                <li>
                  <button
                    onClick={openFatwaSection}
                    className="hover:text-white hover:underline text-left text-[#D9A86B] font-semibold"
                  >
                    • အစ္စလာမ့် ဓမ္မသတ် ဖသ်ဝါ မေးမြန်း/ဖတ်ရှုရန်
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={openAdminModal}
                  className="hover:text-white hover:underline text-left"
                >
                  • WhatsApp ဖြင့် ပညာရှင်များအား တိုက်ရိုက်မေးမြန်းရန်
                </button>
              </li>
              <li>
                <span className="text-[#8C7667]">
                  • ဖောင့်ပုံစံ: Jameel Noori (Urdu) / Al Qalam (Arabic)
                </span>
              </li>
              <li>
                <span className="text-[#8C7667]">
                  • အဟ်လေစွန္နသ်ဝလ်ဂျမာအသ် ဟနဖီလမ်းစဉ်
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp Helpline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#3E2111] pb-2">
              တိုက်ရိုက် ဆက်သွယ်ရန်
            </h4>
            <div className="space-y-3 text-xs text-[#D9C4AC]">
              {primaryContact ? (
                <>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                    <span>WhatsApp: {primaryContact.displayWhatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D9A86B]" />
                    <span>ဖုန်း: {primaryContact.displayPhone}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                  <span>ဆက်သွယ်ရေး ဖုန်းနံပါတ်များအား Admin Panel တွင် သတ်မှတ်နိုင်ပါသည်</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D9A86B]" />
                <span>contact@islamicresearch.org</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={openAdminModal}
                  className="w-full py-2 px-3 bg-[#1B3F2B] hover:bg-[#153423] text-[#E3F8EB] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-[#2E7D4E]/60 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                  <span>WhatsApp စကားပြောရန်</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Subtle Admin Panel link at the very bottom */}
      <div className="bg-[#120804] border-t border-[#2C1810] py-4 px-4 text-xs text-[#8C7667]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Islamic Research Academy (အစ္စလာမ့် သုတေသန အကယ်ဒမီ). All rights reserved.
          </div>

          {/* Discreet Admin Login at the bottom as requested: "Admin Panelသို့ဝင်ရန်ကိုစာမျက်နှာရဲ့အောက်ဆုံးလေးမှာ မသိမသာလေးထည့်ထားပေးပါ" */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#5C4535]">
              အစ္စလာမ့် သုတေသန မော်ကွန်းတိုက်
            </span>
            {openAdminPanel && (
              <button
                onClick={openAdminPanel}
                className="opacity-40 hover:opacity-100 text-[11px] text-[#8C7667] hover:text-[#D9A86B] flex items-center gap-1.5 transition-all py-1 px-2 rounded hover:bg-white/5"
                title="စီမံခန့်ခွဲသူ ဝင်ပေါက် (Admin Control Center)"
              >
                <Lock className="w-3 h-3 text-[#A68F7E]" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
