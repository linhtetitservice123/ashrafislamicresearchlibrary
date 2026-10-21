import React, { useState } from 'react';
import {
  X,
  Download,
  BookOpen,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  User,
  Tag,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Paper } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface PaperReaderModalProps {
  paper: Paper | null;
  onClose: () => void;
  onOpenAdminInquiry: (paper: Paper) => void;
  onPaperDownloaded?: (paperId: string) => void;
}

export const PaperReaderModal: React.FC<PaperReaderModalProps> = ({
  paper,
  onClose,
  onOpenAdminInquiry,
  onPaperDownloaded,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readingTheme, setReadingTheme] = useState<'parchment' | 'white' | 'sepia' | 'dark'>('parchment');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!paper) return null;

  const categoryMeta = CATEGORIES_CONFIG[paper.category];

  const handleCopyCitation = () => {
    try {
      const citation = `${paper.author} (${paper.publicationYear}). "${paper.title}". Islamic Research Academy, Ref: ${paper.referenceNumber}.`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citation);
      }
    } catch (e) {
      console.error(e);
    }
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleSimulatedDownload = () => {
    if (onPaperDownloaded) {
      onPaperDownloaded(paper.id);
    }
    setDownloadSuccess(true);
    // Create text file blob to allow real saving as sample document
    const blob = new Blob([paper.fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.referenceNumber}_${paper.title.substring(0, 25)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Font styling selector based on paper language and user override
  const getBodyFontClass = () => {
    switch (paper.language) {
      case 'urdu':
        return 'font-urdu leading-loose';
      case 'arabic':
        return 'font-arabic leading-relaxed text-right';
      case 'english':
        return 'font-scholarly leading-relaxed';
      case 'myanmar':
      default:
        return 'font-burmese leading-loose';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm sm:text-base';
      case 'lg':
        return 'text-lg sm:text-xl';
      case 'xl':
        return 'text-xl sm:text-2xl';
      case 'base':
      default:
        return 'text-base sm:text-lg';
    }
  };

  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'white':
        return {
          bg: 'bg-white text-[#1C120C]',
          header: 'bg-[#FAF7F2] border-b border-[#EADFCF]',
          footer: 'bg-[#FAF7F2] border-t border-[#EADFCF]',
        };
      case 'sepia':
        return {
          bg: 'bg-[#F4ECE1] text-[#362114]',
          header: 'bg-[#EADDC9] border-b border-[#D7C4A8]',
          footer: 'bg-[#EADDC9] border-t border-[#D7C4A8]',
        };
      case 'dark':
        return {
          bg: 'bg-[#1C1009] text-[#EAD8C7]',
          header: 'bg-[#150A05] border-b border-[#3E2111]',
          footer: 'bg-[#150A05] border-t border-[#3E2111]',
        };
      case 'parchment':
      default:
        return {
          bg: 'bg-[#FAF7F2] text-[#2C1810]',
          header: 'bg-[#F2ECE1] border-b border-[#DFD2BF]',
          footer: 'bg-[#F2ECE1] border-t border-[#DFD2BF]',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className={`relative w-full max-w-4xl rounded-2xl shadow-2xl border border-[#D9C8B2] flex flex-col max-h-[92vh] overflow-hidden transition-colors ${themeClasses.bg}`}>
        {/* Modal Header */}
        <div className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 ${themeClasses.header}`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-1.5 bg-[#8B5A2B]/10 rounded-lg text-[#8B5A2B]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-xs font-mono font-bold text-[#8B5A2B]">
                {paper.referenceNumber}
              </span>
              <span className="mx-2 text-[#C4B29E]">•</span>
              <span className="text-xs font-burmese text-[#634835]">
                {categoryMeta?.nameMy || 'စာတမ်းမော်ကွန်း'}
              </span>
            </div>
          </div>

          {/* Quick Reader Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Size Selector */}
            <div className="flex items-center bg-[#8B5A2B]/10 rounded-lg p-0.5 border border-[#8B5A2B]/20">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'sm' ? 'bg-[#8B5A2B] text-white' : 'text-[#613A17]'}`}
                title="Small Font"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'base' ? 'bg-[#8B5A2B] text-white' : 'text-[#613A17]'}`}
                title="Normal Font"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-xs font-bold rounded ${fontSize === 'lg' ? 'bg-[#8B5A2B] text-white' : 'text-[#613A17]'}`}
                title="Large Font"
              >
                A+
              </button>
            </div>

            {/* Reading Background Color Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-[#8B5A2B]/10 rounded-lg p-1 border border-[#8B5A2B]/20">
              <button
                onClick={() => setReadingTheme('parchment')}
                className={`w-5 h-5 rounded-full bg-[#FAF7F2] border ${readingTheme === 'parchment' ? 'ring-2 ring-[#8B5A2B]' : 'border-neutral-300'}`}
                title="Parchment Cream"
              />
              <button
                onClick={() => setReadingTheme('white')}
                className={`w-5 h-5 rounded-full bg-white border ${readingTheme === 'white' ? 'ring-2 ring-[#8B5A2B]' : 'border-neutral-300'}`}
                title="Clean White"
              />
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`w-5 h-5 rounded-full bg-[#F4ECE1] border ${readingTheme === 'sepia' ? 'ring-2 ring-[#8B5A2B]' : 'border-neutral-300'}`}
                title="Warm Sepia"
              />
              <button
                onClick={() => setReadingTheme('dark')}
                className={`w-5 h-5 rounded-full bg-[#1C1009] border ${readingTheme === 'dark' ? 'ring-2 ring-[#8B5A2B]' : 'border-neutral-500'}`}
                title="Dark Sepia"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#735742] hover:bg-[#8B5A2B]/20 hover:text-[#3B1E08] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto px-5 sm:px-8 md:px-12 py-6 flex-1">
          {/* Paper Title Banner */}
          <div className="mb-6 pb-6 border-b border-[#E3D4C0]/70 text-center">
            {/* Arabic / Academic Header Bismillah */}
            <div className="font-arabic text-sm text-[#8B5A2B] mb-2 tracking-widest">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-bold mb-3 ${
                paper.language === 'urdu'
                  ? 'font-urdu'
                  : paper.language === 'arabic'
                  ? 'font-arabic'
                  : paper.language === 'english'
                  ? 'font-scholarly'
                  : 'font-burmese'
              }`}
            >
              {paper.title}
            </h1>

            {paper.titleOriginalScript && paper.titleOriginalScript !== paper.title && (
              <h2 className="text-base sm:text-lg text-[#7E614D] mb-4 font-arabic">
                {paper.titleOriginalScript}
              </h2>
            )}

            {/* Author info & Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#664E3D] font-burmese mb-3">
              <span className="font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#8B5A2B]" />
                {paper.author}
              </span>
              <span>•</span>
              <span>{paper.authorTitle}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]" />
                {paper.publicationYear}
              </span>
            </div>

            {/* Font Specification Note */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5A2B]/10 border border-[#8B5A2B]/20 text-xs text-[#704924]">
              <Type className="w-3.5 h-3.5" />
              <span>
                စာမူအသုံးပြုပုံစံ:{' '}
                {paper.language === 'urdu'
                  ? 'Jameel Noori Nastaleeq (Urdu)'
                  : paper.language === 'arabic'
                  ? 'Al Qalam Arabic Font'
                  : paper.language === 'english'
                  ? 'Scholarly English Typography'
                  : 'Myanmar Classical Academic'}
              </span>
            </div>
          </div>

          {/* Abstract Highlight Box */}
          <div className="bg-[#8B5A2B]/5 rounded-xl p-4 sm:p-5 border-l-4 border-[#8B5A2B] mb-8 font-burmese">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8B5A2B] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> စာတမ်းအကျဉ်းချုပ် (Abstract)
            </h4>
            <p className="text-sm leading-relaxed text-[#543F31]">
              {paper.abstract}
            </p>
          </div>

          {/* Main Full Text Content */}
          <article className={`space-y-4 whitespace-pre-line ${getBodyFontClass()} ${getFontSizeClass()}`}>
            {paper.fullContent}
          </article>

          {/* Citation & Rights Box */}
          <div className="mt-10 pt-6 border-t border-[#DFD1BE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#735A46]">
            <div>
              <div className="font-semibold mb-1">Academy Citation Ref:</div>
              <code className="bg-[#8B5A2B]/10 px-2.5 py-1 rounded border border-[#8B5A2B]/20 font-mono text-[#523214]">
                {paper.referenceNumber}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCitation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5A2B]/10 hover:bg-[#8B5A2B]/20 text-[#633B17] font-medium font-burmese transition-colors"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2E7D4E]" />
                    <span>ကိုးကားကူးယူပြီး</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ကိုးကားကူးမည် (Citation)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className={`px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 ${themeClasses.footer}`}>
          <div className="text-xs text-[#7A6353] font-burmese flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8B5A2B]" />
            <span>စာမျက်နှာ {paper.pages} မျက်နှာ ({paper.fileSize})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Inquiry with Admin */}
            <button
              onClick={() => onOpenAdminInquiry(paper)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1B3F2B] hover:bg-[#153423] text-[#E3F8EB] rounded-xl text-xs sm:text-sm font-medium font-burmese border border-[#2E7D4E]/50 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
              <span>Admin အား WhatsApp ဖြင့်မေးမည်</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleSimulatedDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5A2B] hover:bg-[#70421B] text-white rounded-xl text-xs sm:text-sm font-medium font-burmese shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'ဒေါင်းလုဒ်ပြီးပါပြီ ✓' : `စာတမ်းဒေါင်းလုဒ် (${paper.fileFormat})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
