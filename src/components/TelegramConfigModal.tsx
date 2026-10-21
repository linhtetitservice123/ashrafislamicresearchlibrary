import React, { useState } from 'react';
import {
  X,
  Send,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Database,
  Info,
} from 'lucide-react';

interface TelegramConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (newUrl: string) => void;
}

export const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSaveUrl(url.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col overflow-hidden animate-fade-in font-burmese">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1777A3] via-[#229ED9] to-[#126085] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Send className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Telegram Database လင့်ခ် ပြင်ဆင်ခြင်း
              </h2>
              <p className="text-xs text-white/80">Telegram Book Channel & Database Link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 bg-[#F0F8FF] rounded-xl border border-[#BDE0FE] flex items-start gap-3 text-xs text-[#0B4F6C]">
            <Info className="w-5 h-5 text-[#229ED9] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Telegram Database ချိတ်ဆက်ပုံ လမ်းညွှန်</p>
              <p className="leading-relaxed">
                စာဖတ်သူများ စာအုပ်ခေါင်းစဉ်ကို နှိပ်လိုက်သည်နှင့် ဤသတ်မှတ်ထားသော Telegram Channel/Group စာအုပ်တိုက်ထဲသို့ တိုက်ရိုက်ရောက်ရှိမည် ဖြစ်ပါသည်။
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B2211] mb-1.5">
              တရားဝင် Telegram Database လင့်ခ် (Official Link)
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://t.me/Your_Islamic_Academy_Channel"
                className="w-full pl-3 pr-24 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#229ED9] focus:ring-1 focus:ring-[#229ED9]"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-xs text-[#6B513E] hover:text-[#229ED9] rounded"
                  title="လင့်ခ် ကူးယူရန်"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#8C7667] mt-1">
              ဥပမာ - https://t.me/IslamicResearchAcademy_DB သို့မဟုတ် သင်၏ Telegram Channel link
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestOpen}
              className="flex-1 py-2.5 px-3 bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#229ED9] rounded-xl border border-[#BDE0FE] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ယခု လင့်ခ်အား ဖွင့်ကြည့်မည်</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Telegram Database လင့်ခ်အား အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-[#E8DEC9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#664C3B] hover:bg-[#FAF7F2] rounded-xl transition-colors"
            >
              ပိတ်မည်
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#229ED9] hover:bg-[#1B8BBF] text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>သိမ်းဆည်းမည်</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
