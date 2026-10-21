import React from 'react';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  MessageCircle,
  Calendar,
  Share2,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Paper } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface PaperCardProps {
  paper: Paper;
  isBookmarked: boolean;
  onToggleBookmark: (paperId: string) => void;
  onOpenReader: (paper: Paper) => void;
  onOpenAdminInquiry: (paper: Paper) => void;
  onOpenTelegram: (paper: Paper) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  isBookmarked,
  onToggleBookmark,
  onOpenReader,
  onOpenAdminInquiry,
  onOpenTelegram,
}) => {
  const categoryMeta = CATEGORIES_CONFIG[paper.category] || {
    nameMy: paper.category,
    nameEn: paper.category,
  };

  // Determine font styling by language
  const getLanguageDetails = () => {
    switch (paper.language) {
      case 'urdu':
        return {
          label: 'اردو (Urdu)',
          badgeBg: 'bg-[#582C12]/10 text-[#6B3416] border-[#B97A4C]',
          titleFont: 'font-urdu text-xl text-[#34180A]',
          fontName: 'Jameel Noori Nastaleeq',
        };
      case 'arabic':
        return {
          label: 'العربية (Arabic)',
          badgeBg: 'bg-[#2E4A28]/10 text-[#1F451B] border-[#5E8E56]',
          titleFont: 'font-arabic text-xl font-bold text-[#1E3316]',
          fontName: 'Al Qalam Font',
        };
      case 'english':
        return {
          label: 'English',
          badgeBg: 'bg-[#374151]/10 text-[#1F2937] border-[#9CA3AF]',
          titleFont: 'font-scholarly text-lg font-semibold text-[#1F2937]',
          fontName: 'Scholarly Serif',
        };
      case 'myanmar':
      default:
        return {
          label: 'မြန်မာဘာသာ',
          badgeBg: 'bg-[#8B5A2B]/10 text-[#663A14] border-[#D9A86B]',
          titleFont: 'font-burmese text-lg font-bold text-[#2C1810]',
          fontName: 'Myanmar Unicode',
        };
    }
  };

  const langDetails = getLanguageDetails();

  const handleCardClick = (e: React.MouseEvent) => {
    // When clicking anywhere on the card, immediately open Telegram Database!
    onOpenTelegram(paper);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-[#E8DEC9] hover:border-[#229ED9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer"
      title="ဤစာအုပ်အား နှိပ်လိုက်ပါက Telegram Database စာအုပ်ဖိုင်သို့ တိုက်ရိုက်ရောက်ရှိပါမည်"
    >
      {/* Top spine accent in warm brown & telegram blue gradient */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B5A2B] via-[#229ED9] to-[#5C361C]"></div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Badges Bar: Category & Language & Verified Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-burmese font-medium bg-[#F6EFE6] text-[#70421B] border border-[#DECCB5]">
              {categoryMeta.nameMy}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${langDetails.badgeBg}`}
              title={`Script Font: ${langDetails.fontName}`}
            >
              {langDetails.label}
            </span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {paper.isVerifiedByAcademy && (
              <span
                className="inline-flex items-center gap-1 text-[11px] text-[#2E7D4E] bg-[#E8F5E9] px-2 py-0.5 rounded-md font-medium border border-[#C8E6C9]"
                title="စိစစ်အတည်ပြုထားသော စာတမ်း"
              >
                <CheckCircle className="w-3 h-3 text-[#2E7D4E]" />
                <span className="font-burmese">အတည်ပြုပြီး</span>
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(paper.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-[#8B5A2B] bg-[#F7EFE5]'
                  : 'text-[#9C8B7E] hover:text-[#5C361C] hover:bg-[#FAF7F2]'
              }`}
              title={isBookmarked ? 'သိမ်းဆည်းထားပြီး' : 'စာတမ်းသိမ်းဆည်းရန်'}
              aria-label="Bookmark"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-[#8B5A2B]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Paper Title with specialized Font - Clicking directly opens Telegram DB */}
        <h3
          className={`group-hover:text-[#229ED9] transition-colors line-clamp-2 mb-2 leading-relaxed ${langDetails.titleFont}`}
        >
          {paper.title}
        </h3>

        {/* Direct Telegram indicator pill */}
        <div className="mb-2.5 inline-flex items-center gap-1.5 text-[11px] text-[#0088CC] font-medium font-burmese bg-[#F0F8FD] border border-[#CFE8F8] px-2.5 py-1 rounded-lg w-fit group-hover:bg-[#229ED9] group-hover:text-white transition-colors">
          <Send className="w-3 h-3 fill-current" />
          <span>Telegram Database သို့ တန်းသွားရန် နှိပ်ပါ</span>
        </div>

        {/* Original Script if available (e.g. Arabic title alongside Burmese) */}
        {paper.titleOriginalScript && paper.titleOriginalScript !== paper.title && (
          <div
            className={`text-xs text-[#7A6150] mb-2 line-clamp-1 ${
              paper.language === 'arabic'
                ? 'font-arabic'
                : paper.language === 'urdu'
                ? 'font-urdu'
                : 'font-scholarly'
            }`}
          >
            {paper.titleOriginalScript}
          </div>
        )}

        {/* Author / Scholar */}
        <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-[#543825]">
          <span className="font-semibold font-burmese">{paper.author}</span>
          {paper.authorTitle && (
            <span className="text-[11px] text-[#8C7667] truncate">
              ({paper.authorTitle})
            </span>
          )}
        </div>

        {/* Abstract */}
        <p className="text-xs sm:text-sm text-[#5C4D43] font-burmese leading-relaxed line-clamp-3 mb-4 flex-1">
          {paper.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(paper.tags || []).slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#7A5B3D] border border-[#E9DFCE] font-burmese"
            >
              #{tag}
            </span>
          ))}
          {(paper.tags?.length || 0) > 3 && (
            <span className="text-[10px] text-[#A68F7E] self-center">
              +{(paper.tags?.length || 0) - 3}
            </span>
          )}
        </div>

        {/* Metadata Footer: Pages, File Size, Read & Download Counts */}
        <div className="pt-3 border-t border-[#F0E8DC] text-[11px] text-[#857264] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
              {paper.pages} မျက်နှာ
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Download className="w-3.5 h-3.5 text-[#A67C52]" />
              {paper.fileSize}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center gap-1" title="ဖတ်ရှုသူအရေအတွက်">
              <Eye className="w-3.5 h-3.5" />
              {paper.readCount.toLocaleString()}
            </span>
            <span className="text-[#CFC2B4]">•</span>
            <span>{paper.publicationYear}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar: Direct Telegram DB button + Web preview + WhatsApp inquiry */}
      <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#E8DEC9] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Telegram Direct Database Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTelegram(paper);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#229ED9] hover:bg-[#1B8BBF] active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-burmese font-semibold shadow-sm transition-all"
          title="Telegram Database တွင် စာအုပ်ကို တိုက်ရိုက်ဖတ်ရှု/ဒေါင်းလုဒ်ယူရန်"
        >
          <Send className="w-4 h-4 fill-white" />
          <span>Telegram တွင် ဖတ်မည်</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>

        {/* Web Preview Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenReader(paper);
          }}
          className="p-2.5 bg-white hover:bg-[#F4ECE1] text-[#633A18] rounded-xl border border-[#D9C4AC] transition-colors"
          title="ဝဘ်ဆိုက်ပေါ်တွင် အမြန်ဖတ်ရှုရန် (Web Preview)"
          aria-label="Web Preview"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* WhatsApp Inquiry for this specific paper */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAdminInquiry(paper);
          }}
          className="p-2.5 bg-[#EAF7EE] hover:bg-[#D5EFE0] text-[#1B5E34] border border-[#BDE5CB] rounded-xl transition-colors"
          title="ဤစာတမ်းနှင့်ပတ်သက်၍ Admin အား WhatsApp ဖြင့် မေးရန်"
          aria-label="WhatsApp Inquiry"
        >
          <MessageCircle className="w-4 h-4 text-[#22C55E]" />
        </button>
      </div>
    </div>
  );
};
