import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  BookOpen,
  Copy,
  Check,
  Share2,
  Send,
  Calendar,
  User,
  MapPin,
  ExternalLink,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { FatwaItem } from '../types';
import { FATWA_CATEGORIES_CONFIG, MANDATORY_FATWA_NOTICES } from '../data/fatwaData';

interface FatwaDetailModalProps {
  fatwa: FatwaItem | null;
  isOpen: boolean;
  onClose: () => void;
  telegramDbUrl: string;
}

export const FatwaDetailModal: React.FC<FatwaDetailModalProps> = ({
  fatwa,
  isOpen,
  onClose,
  telegramDbUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !fatwa) return null;

  const categoryConfig = FATWA_CATEGORIES_CONFIG[fatwa.category];

  const handleCopy = () => {
    const textToCopy = `[${fatwa.fatwaNumber}] - ${categoryConfig.nameMy}\n\nမေးခွန်း:\n${fatwa.question}\n\nဓမ္မသတ်အဖြေ:\n${fatwa.answerDetail}\n\nကျမ်းကိုးအထောက်အထား:\n${fatwa.kitabReference}\n\nဖြေကြားသူ: ${fatwa.scholarName} (${fatwa.scholarTitle})\nအစ္စလာမ့် သုတေသန အကယ်ဒမီ (IRA)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${fatwa.fatwaNumber} - ${categoryConfig.nameMy}`,
        text: `${fatwa.question}\n\n${fatwa.answerSummary}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-[#FCFAF7] rounded-3xl border border-[#D9C4AC] shadow-2xl overflow-hidden font-burmese text-[#2C1810] flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#24130B] text-[#F5EFE6] px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#4A2E19] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5A2B]/40 border border-[#D9A86B]/30 flex items-center justify-center text-[#EAD8B5]">
              <ShieldCheck className="w-5 h-5 text-[#EAD8B5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#D9A86B] font-bold">
                  {fatwa.fatwaNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B5A2B] text-white">
                  {categoryConfig?.nameMy}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                အစ္စလာမ့် ဓမ္မသတ် ဖသ်ဝါ အတည်ပြုချက်
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="ပိတ်မည်"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Hanafi Mazhab Warning Notice Banner */}
          <div className="bg-amber-500/10 border-l-4 border-amber-600 p-3.5 rounded-r-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-[13px] text-amber-900 leading-relaxed font-semibold">
              {MANDATORY_FATWA_NOTICES.hanafiWarningNotice}
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white rounded-2xl p-5 border border-[#E3D6C5] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#8C6D53] mb-2 pb-2 border-b border-[#F0E6D8]">
              <div className="flex items-center gap-3">
                {fatwa.questionerName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>မေးမြန်းသူ: {fatwa.questionerName}</span>
                  </span>
                )}
                {fatwa.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{fatwa.location}</span>
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>ရက်စွဲ: {fatwa.askedDate}</span>
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#8B5A2B] text-white text-xs font-bold shrink-0 mt-0.5">
                မေးခွန်း
              </span>
              <p className="text-base sm:text-lg font-bold text-[#2A150A] leading-relaxed">
                {fatwa.question}
              </p>
            </div>
          </div>

          {/* Answer Box */}
          <div className="bg-[#FAF6F0] rounded-2xl p-5 sm:p-6 border-2 border-[#D9C4AC] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3D6C5]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#2E6F40] text-white text-xs font-bold shrink-0">
                  ဓမ္မသတ်အဖြေ
                </span>
                <span className="text-xs text-[#2E6F40] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>အကယ်ဒမီ ဓမ္မသတ်အဖွဲ့ စိစစ်အတည်ပြုပြီး</span>
                </span>
              </div>
              <span className="text-xs text-[#8C6D53]">
                အဖြေထုတ်ပြန်သည့်ရက်: {fatwa.answeredDate}
              </span>
            </div>

            {/* Answer Detail */}
            <div className="text-sm sm:text-base text-[#34180A] leading-relaxed whitespace-pre-line font-normal">
              {fatwa.answerDetail}
            </div>

            {/* Arabic Reference Quotation if present */}
            {fatwa.arabicReference && (
              <div className="bg-[#24130B] text-[#EAD8B5] p-4 rounded-xl border border-[#4A2E19] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#C69C6D] pb-1 border-b border-white/10 font-sans">
                  <span>الأدلة الشرعية من كتب الفقه الحنفي (Arabic Kitab Text)</span>
                  <BookOpen className="w-3.5 h-3.5 text-[#D9A86B]" />
                </div>
                <p className="font-arabic text-base sm:text-lg text-right leading-loose pt-1 text-[#F7E7CE]">
                  {fatwa.arabicReference}
                </p>
              </div>
            )}

            {/* Kitab Citation Reference */}
            <div className="bg-white p-3.5 rounded-xl border border-[#D9C4AC] flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#633A18] block">
                  ကျမ်းကိုး အထောက်အထား (Kitab Reference):
                </span>
                <span className="text-xs sm:text-sm text-[#3B200E] font-medium">
                  {fatwa.kitabReference}
                </span>
              </div>
            </div>

            {/* Mufti Details */}
            <div className="pt-3 border-t border-[#E3D6C5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7A604D]">
              <div>
                <span className="font-bold text-[#3B1F0E]">ဖြေကြားအတည်ပြုသူ: </span>
                <span>{fatwa.scholarName} ({fatwa.scholarTitle})</span>
              </div>
              <div className="text-[11px] text-[#8C7667]">
                ဖတ်ရှုပြီးကြိမ်: {fatwa.viewsCount.toLocaleString()} ကြိမ်
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#EFE8DD] px-5 sm:px-6 py-3.5 border-t border-[#D9C4AC] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white hover:bg-[#FAF6F0] text-[#4A2810] border border-[#D9C4AC] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#8B5A2B]" />}
              <span>{copied ? 'ကူးယူပြီးပါပြီ' : 'ဓမ္မသတ်အဖြေ ကူးယူမည်'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-white hover:bg-[#FAF6F0] text-[#4A2810] border border-[#D9C4AC] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#8B5A2B]" />
              <span>မျှဝေမည်</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={telegramDbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#229ED9] hover:bg-[#1B8BBF] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5 fill-white" />
              <span>Telegram Database တွင် ကြည့်မည်</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#4A2810] hover:bg-[#34180A] text-white rounded-xl text-xs font-semibold transition-colors"
            >
              ပိတ်မည်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
