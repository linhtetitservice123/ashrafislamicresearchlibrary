import React, { useState } from 'react';
import {
  FileQuestion,
  Plus,
  Clock,
  CheckCircle2,
  Hourglass,
  MessageCircle,
  Search,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Paper, PaperRequest, RequestStatus } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface PaperRequestsBoardProps {
  requests: PaperRequest[];
  onOpenNewRequestModal: () => void;
  onOpenAdminInquiryWithTopic: (topic: string) => void;
  onViewFulfilledPaper?: (paperId: string) => void;
  papers: Paper[];
}

export const PaperRequestsBoard: React.FC<PaperRequestsBoardProps> = ({
  requests,
  onOpenNewRequestModal,
  onOpenAdminInquiryWithTopic,
  onViewFulfilledPaper,
  papers,
}) => {
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [searchTopic, setSearchTopic] = useState('');

  const safeRequests = Array.isArray(requests) ? requests : [];
  const filteredRequests = safeRequests.filter((req) => {
    if (!req) return false;
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const q = (searchTopic || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (req.topic || '').toLowerCase().includes(q) ||
      (req.description || '').toLowerCase().includes(q) ||
      (req.requesterName || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'fulfilled':
        return {
          label: 'ရှာဖွေတင်ပေးပြီး (Fulfilled)',
          badgeClass: 'bg-[#E8F5E9] text-[#2E7D4E] border-[#C8E6C9]',
          icon: CheckCircle2,
        };
      case 'in_research':
        return {
          label: 'သုတေသနပြုစုဆဲ (In Research)',
          badgeClass: 'bg-[#FFF8E1] text-[#B78103] border-[#FFE082]',
          icon: Hourglass,
        };
      case 'pending':
      default:
        return {
          label: 'လက်ခံထားသည် (Pending Review)',
          badgeClass: 'bg-[#EFEBE9] text-[#6D4C41] border-[#D7CCC8]',
          icon: Clock,
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-burmese">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#DFD1BF] p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1">
            <FileQuestion className="w-4 h-4" /> စာတမ်းတောင်းဆိုမှု ဘုတ်ပြား (Paper Requests Board)
          </div>
          <h2 className="text-2xl font-bold text-[#2C1810]">
            စာဖတ်သူများ လိုအပ်သော စာတမ်း/ကျမ်း တောင်းဆိုချက်များ
          </h2>
          <p className="text-xs sm:text-sm text-[#735A46] mt-1">
            သင်ဖတ်ရှုလိုသော စာတမ်း၊ ဓမ္မသတ်ဖသ်ဝါ သို့မဟုတ် သုတေသနကျမ်းကို တောင်းဆိုတင်ပြထားနိုင်ပါသည်။
          </p>
        </div>

        <button
          onClick={onOpenNewRequestModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#8B5A2B] hover:bg-[#6E421C] text-white rounded-xl text-sm font-semibold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>စာတမ်းသစ် တောင်းဆိုမည်</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#A67C52]" />
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            placeholder="တောင်းဆိုချက် ခေါင်းစဉ် ရှာရန်..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#D9C8B4] text-xs sm:text-sm focus:outline-none focus:border-[#8B5A2B]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]'
                : 'bg-white text-[#664E3D] border-[#D9C8B4] hover:bg-[#FAF7F2]'
            }`}
          >
            အားလုံး ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              filterStatus === 'pending'
                ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]'
                : 'bg-white text-[#664E3D] border-[#D9C8B4] hover:bg-[#FAF7F2]'
            }`}
          >
            လက်ခံထားဆဲ ({requests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('in_research')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              filterStatus === 'in_research'
                ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]'
                : 'bg-white text-[#664E3D] border-[#D9C8B4] hover:bg-[#FAF7F2]'
            }`}
          >
            ရှာဖွေဆဲ ({requests.filter((r) => r.status === 'in_research').length})
          </button>
          <button
            onClick={() => setFilterStatus('fulfilled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              filterStatus === 'fulfilled'
                ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]'
                : 'bg-white text-[#664E3D] border-[#D9C8B4] hover:bg-[#FAF7F2]'
            }`}
          >
            ပြီးစီးပြီး ({requests.filter((r) => r.status === 'fulfilled').length})
          </button>
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DFD1BF] p-12 text-center text-[#8C7667]">
          <FileQuestion className="w-12 h-12 mx-auto text-[#C9B59E] mb-3" />
          <p className="text-base font-semibold text-[#543F31]">တောင်းဆိုချက် ရှာမတွေ့ပါ</p>
          <p className="text-xs text-[#8C7667] mt-1 mb-4">
            ရှာဖွေမှုစကားလုံး ပြောင်းလဲပါ သို့မဟုတ် သင်လိုချင်သော စာတမ်းအကြောင်းအရာသစ်ကို တင်သွင်းပါ
          </p>
          <button
            onClick={onOpenNewRequestModal}
            className="px-4 py-2 bg-[#8B5A2B] text-white rounded-xl text-xs font-medium shadow"
          >
            တောင်းဆိုချက်သစ် ရေးသားမည်
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const statusInfo = getStatusBadge(req.status);
            const StatusIcon = statusInfo.icon;
            const categoryMeta = CATEGORIES_CONFIG[req.category];

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-[#E3D6C5] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Status & Category */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#70421B] border border-[#E3D6C5]">
                      {categoryMeta?.nameMy || req.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${statusInfo.badgeClass}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-[#2C1810] mb-2 leading-snug">
                    {req.topic}
                  </h4>

                  {/* Description */}
                  {req.description && (
                    <p className="text-xs text-[#614E41] leading-relaxed mb-3 line-clamp-3 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE3D6]">
                      {req.description}
                    </p>
                  )}

                  {/* Admin Notes */}
                  {req.adminNotes && (
                    <div className="text-xs bg-[#F4EFE6] text-[#633B17] p-2.5 rounded-xl border border-[#DFD1BE] mb-3">
                      <span className="font-bold">Admin အကြောင်းပြန်ချက်: </span>
                      <span>{req.adminNotes}</span>
                    </div>
                  )}
                </div>

                {/* Footer of card */}
                <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between gap-2 text-xs">
                  <div className="text-[#857264] truncate">
                    <span className="font-medium text-[#4D3322]">{req.requesterName}</span>
                    <span className="mx-1">•</span>
                    <span className="text-[11px]">{req.submittedAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* If fulfilled and has paper, button to view */}
                    {req.fulfilledPaperId && onViewFulfilledPaper && (
                      <button
                        onClick={() => onViewFulfilledPaper(req.fulfilledPaperId!)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#2E7D4E] text-white rounded-lg text-xs font-medium hover:bg-[#23633E]"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>စာတမ်းဖတ်မည်</span>
                      </button>
                    )}

                    {/* Direct inquiry to admin about this specific request */}
                    <button
                      onClick={() => onOpenAdminInquiryWithTopic(req.topic)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#EAF7EE] text-[#1B5E34] border border-[#BDE5CB] rounded-lg text-xs font-medium hover:bg-[#D5EFE0]"
                      title="ဤတောင်းဆိုချက်အကြောင်း Admin ထံ WhatsApp ဖြင့် မေးမြန်းရန်"
                    >
                      <MessageCircle className="w-3 h-3 text-[#22C55E]" />
                      <span>WhatsApp မေးမည်</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
