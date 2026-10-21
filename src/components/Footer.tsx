import React from 'react';
import { BookOpen, Phone, MessageCircle, Heart, Shield, Mail } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { PaperCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: PaperCategory | 'all') => void;
  openAdminModal: () => void;
  openUploadModal: () => void;
  openRequestModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  openAdminModal,
  openUploadModal,
  openRequestModal,
}) => {
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
              <li>
                <button
                  onClick={openUploadModal}
                  className="hover:text-white hover:underline text-left"
                >
                  • သာသနာရေးရာ စာတမ်းတင်သွင်းရန် (Upload)
                </button>
              </li>
              <li>
                <button
                  onClick={openRequestModal}
                  className="hover:text-white hover:underline text-left"
                >
                  • ကျမ်းစာတောင်းဆိုချက် တင်ရန် (Request)
                </button>
              </li>
              <li>
                <button
                  onClick={openAdminModal}
                  className="hover:text-white hover:underline text-left"
                >
                  • WhatsApp ဖြင့် ပညာရှင်များအား မေးမြန်းရန်
                </button>
              </li>
              <li>
                <span className="text-[#8C7667]">
                  • ဖောင့်ပုံစံ: Jameel Noori (Urdu) / Al Qalam (Arabic)
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
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span>WhatsApp: 09-777112233 / 09-450889900</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D9A86B]" />
                <span>ရုံးဖုန်း: 09-250114477, 09-965223344</span>
              </div>
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

      {/* Bottom Copyright */}
      <div className="bg-[#120804] border-t border-[#2C1810] py-4 px-4 text-center text-xs text-[#8C7667]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Islamic Research Academy (အစ္စလာမ့် သုတေသန အကယ်ဒမီ). All rights reserved.
          </div>
          <div className="text-[11px] text-[#A68F7E]">
            ဒီဇိုင်းပုံစံ: သာသနာရေးရာ အညိုနှင့် အဖြူရောင်စုံတွဲ အင်တာဖေ့စ်
          </div>
        </div>
      </div>
    </footer>
  );
};
