import React, { useState } from 'react';
import {
  X,
  FileQuestion,
  Send,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { LanguageType, PaperCategory, PaperRequest } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface PaperRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (newRequest: PaperRequest) => void;
}

export const PaperRequestModal: React.FC<PaperRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const [topic, setTopic] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterContact, setRequesterContact] = useState('');
  const [contactType, setContactType] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [category, setCategory] = useState<PaperCategory>('fiqh_fatwa');
  const [language, setLanguage] = useState<LanguageType | 'any'>('myanmar');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('ကျေးဇူးပြု၍ လိုချင်သော စာတမ်း သို့မဟုတ် အကြောင်းအရာ ခေါင်းစဉ်ကို ထည့်သွင်းပါ');
      return;
    }
    if (!requesterName.trim()) {
      setError('ကျေးဇူးပြု၍ မေတ္တာရပ်ခံ တောင်းဆိုသူအမည် ထည့်သွင်းပါ');
      return;
    }
    if (!requesterContact.trim()) {
      setError('ကျေးဇူးပြု၍ ဆက်သွယ်ရန် WhatsApp သို့မဟုတ် ဖုန်းနံပါတ် ထည့်သွင်းပါ');
      return;
    }

    const newRequest: PaperRequest = {
      id: `req-${Date.now()}`,
      topic: topic.trim(),
      requesterName: requesterName.trim(),
      requesterContact: requesterContact.trim(),
      contactType,
      category,
      language,
      description: description.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      adminNotes: 'မေတ္တာရပ်ခံချက် လက်ခံရရှိပါသည်။ စာကြည့်တိုက်မှူးများက သက်ဆိုင်ရာ စာတမ်းအား ရှာဖွေစိစစ်လျက်ရှိပါသည်။',
    };

    onRequestSubmitted(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in font-burmese">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#3B2011] to-[#593318] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B5A2B]/40 rounded-xl border border-[#D9A86B]/30">
              <FileQuestion className="w-5 h-5 text-[#F5E2C8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">စာတမ်းနှင့် ကျမ်းစာများ မေတ္တာရပ်ခံတောင်းဆိုရန်</h2>
              <p className="text-xs text-[#D9C4AC]">Request Religious Research Papers & Treatises</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D9C4AC] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DEC9] text-xs text-[#6E4F38] flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
            <div>
              အကယ်ဒမီတွင် ရှာမတွေ့သေးသော သာသနာရေးရာ စာတမ်းများ၊ ဖသ်ဝါဓမ္မသတ်များ၊ ရှေးဟောင်းကျမ်းစာများနှင့်
              ဘာသာပြန်လိုသော အကြောင်းအရာများကို ဤနေရာတွင် တောင်းဆိုတင်ပြနိုင်ပါသည်။ အကယ်ဒမီ သုတေသီများနှင့် Admin
              များက ကူညီရှာဖွေထုတ်ဝေပေးပါမည်။
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              လိုချင်သော စာတမ်း / အကြောင်းအရာ ခေါင်းစဉ် (Topic / Requested Paper Title) *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ဥပမာ - အစ္စလာမ့် အမွေခွဲဝေမှုဆိုင်ရာ တွက်ချက်နည်း စာတမ်း..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                ကဏ္ဍ (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PaperCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] bg-white"
              >
                {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.nameMy}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                လိုချင်သော ဘာသာစကား (Language) *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageType | 'any')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810] bg-white"
              >
                <option value="any">မည်သည့် ဘာသာစကားမဆို (Any Language)</option>
                <option value="myanmar">မြန်မာဘာသာ (Myanmar)</option>
                <option value="arabic">العربية (Arabic)</option>
                <option value="urdu">اردو (Urdu)</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              အသေးစိတ် လိုအပ်ချက်နှင့် နောက်ခံအကြောင်းအရာ (Detailed Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="မည်သည့် အချက်အလက်များ လိုအပ်သည်၊ မည်သည့် ရည်ရွယ်ချက်အတွက် လေ့လာလိုသည် စသည်တို့ကို အသေးစိတ် ရေးသားပေးပါ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                တောင်းဆိုသူ အမည် (Your Name) *
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="ဥပမာ - မောင်မောင်ထွန်း (ကျောင်းသား / သုတေသီ)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
                ဆက်သွယ်ရန် ဖုန်း / WhatsApp နံပါတ် *
              </label>
              <input
                type="text"
                required
                value={requesterContact}
                onChange={(e) => setRequesterContact(e.target.value)}
                placeholder="09-xxxxxxxxx သို့မဟုတ် +959..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C8B4] focus:outline-none focus:border-[#8B5A2B] text-sm text-[#2C1810]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#664E3D] mb-1.5">
              အကြောင်းပြန်ကြားမှု လက်ခံလိုသည့် နည်းလမ်း
            </label>
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="whatsapp"
                  checked={contactType === 'whatsapp'}
                  onChange={() => setContactType('whatsapp')}
                  className="accent-[#8B5A2B]"
                />
                <span className="font-medium text-[#1B5E34]">WhatsApp ဖြင့် အကြောင်းကြားပေးပါ</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="phone"
                  checked={contactType === 'phone'}
                  onChange={() => setContactType('phone')}
                  className="accent-[#8B5A2B]"
                />
                <span>ဖုန်းဆက် အကြောင်းကြားပေးပါ</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#DFD1BF] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#735A46] hover:text-[#3B1E08] font-medium"
          >
            မလုပ်တော့ပါ
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5A2B] hover:bg-[#6E421C] text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>တောင်းဆိုချက် တင်မည် (Submit Request)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
