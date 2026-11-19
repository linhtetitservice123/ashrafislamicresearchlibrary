import React, { useState } from 'react';
import {
  PlusCircle,
  Edit,
  Trash2,
  ShieldCheck,
  X,
  BookMarked,
  AlertTriangle,
} from 'lucide-react';
import { FatwaCategory, FatwaItem } from '../types';
import { FATWA_CATEGORIES_CONFIG } from '../data/fatwaData';

interface AdminPublishedFatwasManagerProps {
  publishedFatwas: FatwaItem[];
  onSavePublishedFatwa: (fatwa: FatwaItem) => Promise<void>;
  onDeletePublishedFatwa: (fatwaId: string) => Promise<void>;
  onToast: (msg: string) => void;
}

export const AdminPublishedFatwasManager: React.FC<AdminPublishedFatwasManagerProps> = ({
  publishedFatwas,
  onSavePublishedFatwa,
  onDeletePublishedFatwa,
  onToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFatwa, setEditingFatwa] = useState<FatwaItem | null>(null);
  const [deletingFatwaId, setDeletingFatwaId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [category, setCategory] = useState<FatwaCategory>('namaz');
  const [fatwaNumber, setFatwaNumber] = useState('');
  const [question, setQuestion] = useState('');
  const [answerSummary, setAnswerSummary] = useState('');
  const [answerDetail, setAnswerDetail] = useState('');
  const [arabicReference, setArabicReference] = useState('');
  const [kitabReference, setKitabReference] = useState('');
  const [scholarName, setScholarName] = useState('ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့ (ဟနဖီမဇ်ဟဗ်)');
  const [scholarTitle, setScholarTitle] = useState('အစ္စလာမ့် သုတေသန အကယ်ဒမီ');
  const [tags, setTags] = useState('');

  const openAdd = () => {
    setEditingFatwa(null);
    setCategory('namaz');
    setFatwaNumber(`IRA-FTW-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setQuestion('');
    setAnswerSummary('');
    setAnswerDetail('');
    setArabicReference('');
    setKitabReference('ရဒ်ဒုလ်မုဟ်တာရ် (ဖတာဝါရှာမီ)၊ ဖတာဝါဟိန္ဒီယာ');
    setScholarName('ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့ (ဟနဖီမဇ်ဟဗ်)');
    setScholarTitle('အစ္စလာမ့် သုတေသန အကယ်ဒမီ');
    setTags('ဖသ်ဝါ, ဟနဖီဖိကဟ်');
    setIsModalOpen(true);
  };

  const openEdit = (item: FatwaItem) => {
    setEditingFatwa(item);
    setCategory(item.category);
    setFatwaNumber(item.fatwaNumber);
    setQuestion(item.question);
    setAnswerSummary(item.answerSummary);
    setAnswerDetail(item.answerDetail);
    setArabicReference(item.arabicReference || '');
    setKitabReference(item.kitabReference);
    setScholarName(item.scholarName);
    setScholarTitle(item.scholarTitle || '');
    setTags((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answerDetail.trim()) {
      onToast('ကျေးဇူးပြု၍ ဖသ်ဝါမေးခွန်းနှင့် အဖြေတော်အပြည့်အစုံကို ဖြည့်သွင်းပါ။');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const fatwaToSave: FatwaItem = {
      id: editingFatwa ? editingFatwa.id : `pub-ftw-${Date.now()}`,
      fatwaNumber:
        fatwaNumber.trim() ||
        `IRA-FTW-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      category,
      question: question.trim(),
      questionerName: editingFatwa?.questionerName || 'အများပြည်သူ',
      location: editingFatwa?.location || 'မြန်မာ',
      askedDate: editingFatwa?.askedDate || today,
      answeredDate: today,
      answerSummary:
        answerSummary.trim() || answerDetail.trim().slice(0, 220),
      answerDetail: answerDetail.trim(),
      arabicReference: arabicReference.trim(),
      kitabReference: kitabReference.trim() || 'ဟနဖီ ဖိကဟ်ကျမ်းဂန်များ',
      scholarName: scholarName.trim() || 'ဒါရုလ်အိဖ်တာအ် ဓမ္မသတ်အဖွဲ့',
      scholarTitle: scholarTitle.trim() || 'ဓမ္မသတ်ဌာန',
      isVerified: true,
      viewsCount: editingFatwa?.viewsCount || 1,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setIsSaving(true);
    try {
      await onSavePublishedFatwa(fatwaToSave);
      setIsModalOpen(false);
      onToast(
        editingFatwa
          ? 'ထုတ်ပြန်ထားသော ဖသ်ဝါကို ပြင်ဆင်ပြီး အားလုံးထံ Real-Time Sync လုပ်ပြီးပါပြီ ✓'
          : 'ဖသ်ဝါအသစ်ကို ထုတ်ပြန်ပြီး အားလုံးထံ Real-Time Sync လုပ်ပြီးပါပြီ ✓'
      );
    } catch (err) {
      console.error(err);
      onToast('ဖသ်ဝါသိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingFatwaId) return;
    try {
      await onDeletePublishedFatwa(deletingFatwaId);
      onToast('ထုတ်ပြန်ထားသော ဖသ်ဝါကို ဖျက်ပစ်ပြီး အားလုံးထံ Sync လုပ်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error(err);
      onToast('ဖသ်ဝါဖျက်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    } finally {
      setDeletingFatwaId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-[#2C1810] flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-700" />
            <span>တရားဝင် ထုတ်ပြန်ထားသော ဖသ်ဝါ စာကြည့်တိုက် ({publishedFatwas.length})</span>
          </h4>
          <p className="text-xs text-[#7A6353] mt-0.5">
            ဤနေရာမှ ထည့်သွင်း/ပြင်ဆင်/ဖျက်ပစ်သော ဖသ်ဝါများသည် ဖသ်ဝါကဏ္ဍတွင် အားလုံးထံ ချက်ချင်း Real-Time ပေါ်လာမည်
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>တရားဝင် ဖသ်ဝါအသစ် တင်မည်</span>
        </button>
      </div>

      {publishedFatwas.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#DFD1BF] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[#34180A]">
            Admin ကိုယ်တိုင် ထုတ်ပြန်ထားသော ဖသ်ဝါ မရှိသေးပါ
          </h4>
          <p className="text-xs text-[#7A6353] max-w-md mx-auto">
            "တရားဝင် ဖသ်ဝါအသစ် တင်မည်" ကိုနှိပ်၍ဖြစ်စေ၊ ပြည်သူ့မေးခွန်းများထဲမှ ဖြေပြီးသားမေးခွန်းကို ထုတ်ပြန်၍ဖြစ်စေ စတင်နိုင်ပါသည်။
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {publishedFatwas.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.fatwaNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#6E421B] border border-[#DECCB5]">
                    {FATWA_CATEGORIES_CONFIG[item.category]?.nameMy || item.category}
                  </span>
                  <span className="text-[11px] text-[#8C7667] font-mono">
                    {item.answeredDate}
                  </span>
                </div>
                <h5 className="text-sm sm:text-base font-bold text-[#2C1810]">
                  {item.question}
                </h5>
                <p className="text-xs text-[#5C4033] line-clamp-2 leading-relaxed">
                  {item.answerSummary}
                </p>
                <div className="text-[11px] text-[#7A6353]">
                  📚 {item.kitabReference} • ✍️ {item.scholarName}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="p-2 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] rounded-xl border border-[#FCD34D]"
                  title="ပြင်ဆင်မည်"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingFatwaId(item.id)}
                  className="p-2 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B] rounded-xl border border-[#F87171]"
                  title="ဖျက်ပစ်မည်"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Published Fatwa Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DECCB5] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5D7]">
              <h4 className="text-base sm:text-lg font-bold text-[#2C1810]">
                {editingFatwa ? 'ထုတ်ပြန်ထားသော ဖသ်ဝါ ပြင်ဆင်ရန်' : 'တရားဝင် ဖသ်ဝါအသစ် ထုတ်ပြန်ရန်'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#7A6353]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ဖသ်ဝါ ကဏ္ဍ *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FatwaCategory)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                  >
                    {(Object.entries(FATWA_CATEGORIES_CONFIG) as [FatwaCategory, typeof FATWA_CATEGORIES_CONFIG[FatwaCategory]][]).map(
                      ([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.nameMy}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ဖသ်ဝါ အမှတ်စဉ်
                  </label>
                  <input
                    type="text"
                    value={fatwaNumber}
                    onChange={(e) => setFatwaNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1">
                  မေးခွန်း *
                </label>
                <textarea
                  required
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1">
                  အဖြေ အကျဉ်းချုပ် (Card တွင် ပြသမည်)
                </label>
                <textarea
                  rows={2}
                  value={answerSummary}
                  onChange={(e) => setAnswerSummary(e.target.value)}
                  placeholder="အလွတ်ထားပါက အဖြေအပြည့်အစုံ၏ အစပိုင်းကို အလိုအလျောက် ယူပါမည်"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1">
                  ဓမ္မသတ် အဖြေတော် အပြည့်အစုံ *
                </label>
                <textarea
                  required
                  rows={5}
                  value={answerDetail}
                  onChange={(e) => setAnswerDetail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1">
                  အာရဗီ ကျမ်းကိုးစာသား (ရှိပါက)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={arabicReference}
                  onChange={(e) => setArabicReference(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm font-arabic outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    အထောက်အထား ကျမ်းကိုး
                  </label>
                  <input
                    type="text"
                    value={kitabReference}
                    onChange={(e) => setKitabReference(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2211] mb-1">
                    ဖြေကြားသူ ပညာရှင် / အဖွဲ့
                  </label>
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2211] mb-1">
                  Tags (ကော်မာခံ၍ ရေးပါ)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE5D7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#633A18] rounded-xl text-xs font-semibold border border-[#D9C4AC]"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm"
                >
                  {isSaving ? 'Sync လုပ်နေသည်...' : 'ထုတ်ပြန်ပြီး Real-Time Sync သိမ်းမည်'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFatwaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DECCB5] space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold">ဖသ်ဝါအား ဖျက်ပစ်ရန် အတည်ပြုပါ</h4>
            </div>
            <p className="text-xs text-[#6B5240] leading-relaxed">
              ဤဖသ်ဝါကို ဖျက်ပစ်လိုက်ပါက ဝဘ်ဆိုက်အသုံးပြုသူအားလုံးထံမှ ချက်ချင်း ဖယ်ရှားသွားမည် ဖြစ်ပါသည်။
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFatwaId(null)}
                className="px-4 py-2 bg-[#FAF7F2] text-[#633A18] rounded-xl text-xs font-semibold border border-[#D9C4AC]"
              >
                မလုပ်တော့ပါ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                ဖျက်ပစ်မည်
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
