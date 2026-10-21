import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  PhoneCall,
  Mail,
  Clock,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ADMIN_CONTACTS } from '../data/initialData';
import { AdminContact } from '../types';

interface AdminContactSectionProps {
  initialTopic?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const AdminContactSection: React.FC<AdminContactSectionProps> = ({
  initialTopic = '',
  onClose,
  isModal = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminContact>(ADMIN_CONTACTS[0]);
  const [customMessage, setCustomMessage] = useState(
    initialTopic ? `မင်္ဂလာပါဆရာ၊ Islamic Research Academy မှ "${initialTopic}" နှင့်ပတ်သက်၍ မေးမြန်းလိုပါသည်။` : ''
  );
  const [userName, setUserName] = useState('');
  const [selectedTopicType, setSelectedTopicType] = useState('general');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCleanWhatsappNumber = (phone: string) => {
    // Return digits with plus
    return phone.replace(/[^0-9]/g, '');
  };

  const handleOpenWhatsapp = (admin: AdminContact, message?: string) => {
    const cleanNumber = getCleanWhatsappNumber(admin.whatsappNumber);
    const msg = message || `မင်္ဂလာပါ အစ္စလာမ့် သုတေသန အကယ်ဒမီ (Islamic Research Academy) မှ ဆွေးနွေးမေးမြန်းလိုပါသည်။`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = userName ? `အမည်: ${userName}\n` : '';
    const fullMsg = `[Islamic Research Academy စုံစမ်းမေးမြန်းမှု]\n${prefix}မက်ဆေ့ခ်ျ: ${customMessage || 'သာသနာရေးရာ စာတမ်းများနှင့်ပတ်သက်၍ ဆွေးနွေးလိုပါသည်'}`;
    handleOpenWhatsapp(selectedAdmin, fullMsg);
  };

  return (
    <div className={`font-burmese ${isModal ? 'p-4 sm:p-6' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      {/* Academy Contact Title Banner */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#432312] to-[#26150C] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#633A18] mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 bg-islamic-pattern"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5A2B]/40 border border-[#D9A86B]/30 text-xs text-[#EAD8B5] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E5B57A]" />
            <span>တရားဝင် ဆက်သွယ်ရေးနှင့် အကူအညီဌာန</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Admin နှင့် ပညာရှင်များထံ တိုက်ရိုက်ဆက်သွယ်ရန်
          </h2>
          <p className="text-xs sm:text-sm text-[#D9C4AC] leading-relaxed">
            သာသနာရေးရာ စာတမ်းများ၊ ဖသ်ဝါဓမ္မသတ် မေးမြန်းစုံစမ်းချက်များ၊ စာတမ်းတင်သွင်းမှုနှင့် မော်ကွန်းတိုက်ရှိ
            ကျမ်းစာများကို ရယူနိုင်ရန် သက်ဆိုင်ရာ တာဝန်ခံ Admin များထံ WhatsApp နှင့် ဖုန်းနံပါတ်များဖြင့် တိုက်ရိုက်ဆက်သွယ်နိုင်ပါသည်။
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Admin Contact Cards (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-[#2C1810] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#8B5A2B]" />
            <span>တာဝန်ခံ Admin အဖွဲ့ဝင်များ၏ WhatsApp & ဖုန်းနံပါတ်များ</span>
          </h3>

          <div className="space-y-4">
            {ADMIN_CONTACTS.map((admin) => (
              <div
                key={admin.id}
                className="bg-white rounded-2xl border border-[#DFD1BF] p-5 shadow-sm hover:shadow-md transition-all hover:border-[#8B5A2B]/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#8B5A2B] uppercase tracking-wider block mb-0.5">
                      {admin.roleMy}
                    </span>
                    <h4 className="text-base font-bold text-[#2C1810]">{admin.nameMy}</h4>
                    <p className="text-xs text-[#7A6253] font-sans">{admin.name}</p>
                  </div>

                  <span className="self-start px-2.5 py-1 rounded-full text-[11px] bg-[#E8F5E9] text-[#1E5638] font-medium border border-[#C8E6C9] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                    <span>အွန်လိုင်း ရရှိနိုင်သည်</span>
                  </span>
                </div>

                <div className="text-xs text-[#614E41] mb-4 space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE5D7]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                    <span>တာဝန်ယူမှု: {admin.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                    <span>ဆက်သွယ်ချိန်: {admin.activeHours}</span>
                  </div>
                </div>

                {/* WhatsApp & Call Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* WhatsApp Direct */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenWhatsapp(admin)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                      <span>WhatsApp ဆက်သွယ်မည်</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(admin.displayWhatsapp, `${admin.id}-wa`)}
                      className="p-2 bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#633A18] rounded-xl border border-[#D9C4AC] transition-colors"
                      title="WhatsApp နံပါတ် ကူးယူရန်"
                    >
                      {copiedId === `${admin.id}-wa` ? (
                        <Check className="w-4 h-4 text-[#2E7D4E]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Direct Phone Call */}
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${admin.phoneNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#FAF7F2] hover:bg-[#F2E8DA] text-[#3D2211] border border-[#D9C4AC] rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#8B5A2B]" />
                      <span>ဖုန်းခေါ်မည် ({admin.displayPhone})</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(admin.phoneNumber, `${admin.id}-ph`)}
                      className="p-2 bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#633A18] rounded-xl border border-[#D9C4AC] transition-colors"
                      title="ဖုန်းနံပါတ် ကူးယူရန်"
                    >
                      {copiedId === `${admin.id}-ph` ? (
                        <Check className="w-4 h-4 text-[#2E7D4E]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick WhatsApp Message Composer (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-2xl border border-[#DFD1BF] p-6 shadow-md">
            <div className="flex items-center gap-2.5 text-[#1B3F2B] mb-3 pb-3 border-b border-[#F0E8DC]">
              <div className="p-2 bg-[#EAF7EE] rounded-xl">
                <MessageCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">WhatsApp အမြန်မေးမြန်းမှု</h3>
                <p className="text-xs text-[#6B7280]">Direct WhatsApp Message Composer</p>
              </div>
            </div>

            <form onSubmit={handleSendCustomMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                  မေးမြန်းလိုသော Admin ရွေးချယ်ပါ
                </label>
                <select
                  value={selectedAdmin.id}
                  onChange={(e) => {
                    const found = ADMIN_CONTACTS.find((a) => a.id === e.target.value);
                    if (found) setSelectedAdmin(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C8B4] text-xs text-[#2C1810] bg-white focus:outline-none focus:border-[#8B5A2B]"
                >
                  {ADMIN_CONTACTS.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.nameMy} ({admin.displayWhatsapp})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                  သင်၏ အမည် (Your Name)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="ဥပမာ - မောင်မောင် (ရန်ကုန်)"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C8B4] text-xs text-[#2C1810] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                  မေးမြန်းလိုသည့် အကြောင်းအရာ ခေါင်းစဉ်
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicType('submission');
                      setCustomMessage('မင်္ဂလာပါဆရာ၊ စာတမ်းတင်သွင်းမှု စိစစ်ရေးနှင့်ပတ်သက်၍ မေးမြန်းလိုပါသည်။');
                    }}
                    className="p-1.5 text-[11px] rounded-lg border border-[#D9C8B4] text-left hover:bg-[#FAF7F2] text-[#543F31]"
                  >
                    📝 စာတမ်းတင်သွင်းမှု
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicType('fatwa');
                      setCustomMessage('မင်္ဂလာပါဆရာ၊ သာသနာရေးရာ ဖသ်ဝါဓမ္မသတ်နှင့် ပတ်သက်၍ အကြံဉာဏ်တောင်းခံလိုပါသည်။');
                    }}
                    className="p-1.5 text-[11px] rounded-lg border border-[#D9C8B4] text-left hover:bg-[#FAF7F2] text-[#543F31]"
                  >
                    ⚖️ ဖသ်ဝါမေးမြန်းချက်
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicType('request');
                      setCustomMessage('မင်္ဂလာပါဆရာ၊ စာတမ်း/ကျမ်းစာတောင်းဆိုချက်တစ်ခုနှင့် ပတ်သက်၍ ဆက်သွယ်ခြင်းဖြစ်ပါသည်။');
                    }}
                    className="p-1.5 text-[11px] rounded-lg border border-[#D9C8B4] text-left hover:bg-[#FAF7F2] text-[#543F31]"
                  >
                    📖 ကျမ်းစာတောင်းဆို
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopicType('general');
                      setCustomMessage('မင်္ဂလာပါဆရာ၊ Islamic Research Academy နှင့်ပတ်သက်၍ စုံစမ်းလိုပါသည်။');
                    }}
                    className="p-1.5 text-[11px] rounded-lg border border-[#D9C8B4] text-left hover:bg-[#FAF7F2] text-[#543F31]"
                  >
                    💬 အထွေထွေ
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="မေးမြန်းလိုသည့် အကြောင်းအရာကို ရေးသားပါ..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D9C8B4] text-xs text-[#2C1810] focus:outline-none focus:border-[#8B5A2B]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-sm font-semibold shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span>WhatsApp တွင် မက်ဆေ့ခ်ျဖွင့်မည်</span>
              </button>

              <div className="text-[11px] text-[#8C7667] text-center">
                * ခလုတ်နှိပ်လိုက်ပါက သင်၏ WhatsApp တွင် မက်ဆေ့ခ်ျ အဆင်သင့် ပွင့်လာပါမည်။
              </div>
            </form>

            {/* Academy Office Card */}
            <div className="mt-6 pt-5 border-t border-[#F0E8DC] text-xs text-[#6E533F] space-y-2">
              <div className="font-bold text-[#3B2211] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" /> အကယ်ဒမီ ဗဟိုရုံးစိုက်ရာ
              </div>
              <p>အမှတ် (၁၂၈)၊ မဟာဗန္ဓုလလမ်းမကြီး၊ ကျောက်တံတားမြို့နယ်၊ ရန်ကုန်မြို့။</p>
              <div className="flex items-center gap-1.5 text-[#8B5A2B]">
                <Mail className="w-3.5 h-3.5" />
                <span>contact@islamicresearch.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
