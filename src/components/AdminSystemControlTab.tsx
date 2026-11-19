import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Megaphone,
  Power,
  Globe,
  ShieldCheck,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../data/initialData';

interface AdminSystemControlTabProps {
  siteConfig: SiteConfig;
  authUserEmail: string;
  onSaveSiteConfig: (config: SiteConfig) => Promise<void>;
  onToast: (msg: string) => void;
}

export const AdminSystemControlTab: React.FC<AdminSystemControlTabProps> = ({
  siteConfig,
  authUserEmail,
  onSaveSiteConfig,
  onToast,
}) => {
  const [draft, setDraft] = useState<SiteConfig>(siteConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Keep draft synced when remote Firestore changes arrive
  useEffect(() => {
    setDraft(siteConfig);
  }, [siteConfig]);

  const handleImmediateToggle = async (key: keyof SiteConfig, value: boolean, label: string) => {
    const nextConfig: SiteConfig = {
      ...draft,
      [key]: value,
      updatedBy: authUserEmail,
      updatedAt: new Date().toISOString(),
    };
    setDraft(nextConfig);
    setIsSaving(true);
    try {
      await onSaveSiteConfig(nextConfig);
      onToast(`${label} ကို ${value ? 'ဖွင့်' : 'ပိတ်'} ပြီး အားလုံးထံ Real-Time Sync လုပ်ပြီးပါပြီ ✓`);
    } catch (err) {
      console.error(err);
      onToast('Firestore သို့ သိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.siteNameEn.trim() || !draft.siteNameMy.trim()) {
      onToast('ကျေးဇူးပြု၍ ဝဘ်ဆိုက်အမည် (English & မြန်မာ) ကို ဖြည့်သွင်းပေးပါ။');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveSiteConfig({
        ...draft,
        updatedBy: authUserEmail,
        updatedAt: new Date().toISOString(),
      });
      onToast('စနစ်ဆက်တင်အားလုံးကို အသုံးပြုသူအားလုံးထံ Real-Time Sync သိမ်းဆည်းပြီးပါပြီ ✓');
    } catch (err) {
      console.error(err);
      onToast('သိမ်းဆည်းရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။ ထပ်မံကြိုးစားပါ။');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsSaving(true);
    try {
      const resetConfig: SiteConfig = {
        ...DEFAULT_SITE_CONFIG,
        updatedBy: authUserEmail,
        updatedAt: new Date().toISOString(),
      };
      await onSaveSiteConfig(resetConfig);
      setDraft(resetConfig);
      setConfirmReset(false);
      onToast('မူလစနစ်ဆက်တင်များအတိုင်း ပြန်လည်သတ်မှတ်ပြီး အားလုံးထံ Sync လုပ်ပြီးပါပြီ ✓');
    } catch (err) {
      console.error(err);
      onToast('ပြန်လည်သတ်မှတ်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်နေပါသည်။');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleItems: {
    key: keyof SiteConfig;
    label: string;
    desc: string;
    danger?: boolean;
  }[] = [
    {
      key: 'maintenanceMode',
      label: 'ဝဘ်ဆိုက် ပြင်ဆင်ထိန်းသိမ်းမှု မုဒ် (Maintenance Mode)',
      desc: 'ဖွင့်ထားပါက အများပြည်သူများအတွက် ပြင်ဆင်နေကြောင်း အသိပေးစာမျက်နှာသာ ပြသမည် (Admin မှာမူ ပုံမှန်အတိုင်း ဝင်ရောက်ထိန်းချုပ်နိုင်သည်)',
      danger: true,
    },
    {
      key: 'enableFatwaSection',
      label: 'ဖသ်ဝါ ဓမ္မသတ် ကဏ္ဍ ပြသမည် (Fatwa Section)',
      desc: 'Header နှင့် Hero စာမျက်နှာတွင် ဖသ်ဝါကဏ္ဍကို ဖွင့်/ပိတ် ထိန်းချုပ်ခြင်း',
    },
    {
      key: 'enableFatwaSubmission',
      label: 'ဖသ်ဝါ မေးခွန်းအသစ် လက်ခံမည် (Allow Fatwa Questions)',
      desc: 'ပိတ်ထားပါက ပြည်သူများ မေးခွန်းအသစ် တင်သွင်းခြင်းကို ယာယီရပ်ဆိုင်းထားမည်',
    },
    {
      key: 'enableContactTab',
      label: 'ဆက်သွယ်ရန် စာမျက်နှာ ပြသမည် (Contact Page)',
      desc: 'အဖွဲ့အစည်း ဆက်သွယ်ရန် Tab ကို ဖွင့်/ပိတ် ပြုလုပ်ခြင်း',
    },
    {
      key: 'enableWhatsappFloat',
      label: 'WhatsApp ဆက်သွယ်ရေး ခလုတ်များ ပြသမည်',
      desc: 'ညာဘက်အောက်ခြေ Floating WhatsApp ခလုတ်နှင့် Header/Footer WhatsApp ခလုတ်များ',
    },
    {
      key: 'enableTelegramButtons',
      label: 'Telegram Database ခလုတ်များ ပြသမည်',
      desc: 'စာအုပ်စင်များနှင့် ဖသ်ဝါစာမျက်နှာရှိ Telegram ချိတ်ဆက်မှု ခလုတ်များ',
    },
    {
      key: 'showDefaultSampleFatwas',
      label: 'မူလပါဝင်သော ဟနဖီ ဖသ်ဝါနမူနာများ ပြသမည်',
      desc: 'ပိတ်ထားပါက Admin ကိုယ်တိုင် တင်ထားသော ဖသ်ဝါများကိုသာ ပြသပါမည်',
    },
  ];

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 font-burmese">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#24130B] text-[#EAD8B5] flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#2C1810]">
                စနစ်တစ်ခုလုံး ထိန်းချုပ်မှု (Real-Time System Control)
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600" />
                <span>Live Sync Active</span>
              </span>
            </div>
            <p className="text-xs text-[#7A6353] mt-1">
              ဤနေရာမှ ပြင်ဆင်သိမ်းဆည်းလိုက်သမျှ အားလုံးသည် ဝဘ်ဆိုက်ဖွင့်ထားသူ အားလုံး၏ ဖုန်းနှင့် ကွန်ပျူတာများတွင် စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ပြောင်းလဲသွားမည် ဖြစ်ပါသည်။
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-[#8B5A2B] to-[#633A18] hover:from-[#9D6833] hover:to-[#74451E] disabled:opacity-60 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Sync လုပ်နေသည်...' : 'အားလုံးထံ Sync သိမ်းမည်'}</span>
        </button>
      </div>

      {/* 1. LIVE GLOBAL ANNOUNCEMENT BANNER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE5D7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#2C1810]">
                အရေးကြီး အသိပေးကြေညာချက် တန်း (Live Announcement Banner)
              </h4>
              <p className="text-xs text-[#7A6353]">
                ဖွင့်ထားပါက ဝဘ်ဆိုက်အပေါ်ဆုံးတွင် အားလုံးမြင်နိုင်မည့် အသိပေးစာတန်း ချက်ချင်းပေါ်လာမည်
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              handleImmediateToggle(
                'announcementEnabled',
                !draft.announcementEnabled,
                'အသိပေးကြေညာချက် တန်း'
              )
            }
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              draft.announcementEnabled
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-[#FAF7F2] text-[#6B5240] border-[#D9C4AC]'
            }`}
          >
            {draft.announcementEnabled ? 'ဖွင့်ထားသည် (ON)' : 'ပိတ်ထားသည် (OFF)'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ကြေညာချက် စာသား
            </label>
            <input
              type="text"
              maxLength={500}
              value={draft.announcementText}
              onChange={(e) => setDraft({ ...draft, announcementText: e.target.value })}
              placeholder="ဥပမာ - ရမ်ဇာန်လမြတ် အထူးဖသ်ဝါ အစီအစဉ်များ စတင်နေပါပြီ..."
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              အရောင်ပုံစံ
            </label>
            <select
              value={draft.announcementType}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  announcementType: e.target.value as 'info' | 'warning' | 'success',
                })
              }
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            >
              <option value="info">ရွှေညိုရောင် (အသိပေးချက်)</option>
              <option value="warning">အနီ/လိမ္မော်ရောင် (အရေးကြီး)</option>
              <option value="success">အစိမ်းရောင် (သတင်းကောင်း)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. FEATURE ON/OFF SWITCHES (INSTANT REAL-TIME SYNC) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#EFE5D7]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#2C1810]">
              ဝဘ်ဆိုက် လုပ်ဆောင်ချက်များ ဖွင့်/ပိတ် ထိန်းချုပ်မှု (Instant Real-Time Switches)
            </h4>
            <p className="text-xs text-[#7A6353]">
              ခလုတ်နှိပ်လိုက်သည်နှင့် ချက်ချင်း အားလုံးဆီ Real-Time Sync ဖြစ်သွားပါမည်
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {toggleItems.map((item) => {
            const isEnabled = Boolean(draft[item.key]);
            return (
              <div
                key={item.key}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  item.danger && isEnabled
                    ? 'bg-red-50/70 border-red-300'
                    : 'bg-[#FAF7F2] border-[#E8DEC9]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#2C1810]">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-[#7A6353] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleImmediateToggle(item.key, !isEnabled, item.label)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                    isEnabled
                      ? item.danger
                        ? 'bg-red-600'
                        : 'bg-emerald-600'
                      : 'bg-gray-300'
                  }`}
                  aria-pressed={isEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Maintenance Message Input */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
            Maintenance Mode ဖွင့်ထားစဉ် ပြသမည့် အသိပေးစာသား
          </label>
          <textarea
            rows={2}
            maxLength={1000}
            value={draft.maintenanceMessage}
            onChange={(e) => setDraft({ ...draft, maintenanceMessage: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
          />
        </div>
      </div>

      {/* 3. WEBSITE BRANDING & HERO TEXT */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#EFE5D7]">
          <div className="w-9 h-9 rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#2C1810]">
              ဝဘ်ဆိုက် အမည်နှင့် ပင်မခေါင်းစဉ် စာသားများ (Branding & Hero)
            </h4>
            <p className="text-xs text-[#7A6353]">
              Header၊ Hero Section နှင့် ရှာဖွေရေးဘား စာသားများကို စိတ်ကြိုက်ပြင်ဆင်နိုင်ပါသည်
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ဝဘ်ဆိုက် အမည် (English) *
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={draft.siteNameEn}
              onChange={(e) => setDraft({ ...draft, siteNameEn: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm font-cinzel text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ဝဘ်ဆိုက် အမည် (မြန်မာ) *
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={draft.siteNameMy}
              onChange={(e) => setDraft({ ...draft, siteNameMy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ပင်မ Hero ခေါင်းစဉ် (မြန်မာ)
            </label>
            <input
              type="text"
              maxLength={200}
              value={draft.heroTitleMy}
              onChange={(e) => setDraft({ ...draft, heroTitleMy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ပင်မ Hero ဖော်ပြချက် စာပိုဒ်
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={draft.heroSubtitle}
              onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ရှာဖွေရေးဘား (Search Placeholder)
            </label>
            <input
              type="text"
              maxLength={200}
              value={draft.searchPlaceholder}
              onChange={(e) => setDraft({ ...draft, searchPlaceholder: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>
        </div>
      </div>

      {/* 4. FATWA DEPARTMENT SETTINGS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#EFE5D7]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#2C1810]">
              ဖသ်ဝါ ဓမ္မသတ်ဌာန စာသားနှင့် သတိပေးချက်များ
            </h4>
            <p className="text-xs text-[#7A6353]">
              ဖသ်ဝါစာမျက်နှာ၏ ခေါင်းစဉ်၊ သတိပေးစာ ၂ ခုနှင့် တိုက်ရိုက် WhatsApp နံပါတ်ကို ပြင်ဆင်နိုင်ပါသည်
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ဖသ်ဝါဌာန ခေါင်းစဉ်
            </label>
            <input
              type="text"
              maxLength={200}
              value={draft.fatwaTitle}
              onChange={(e) => setDraft({ ...draft, fatwaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ဖသ်ဝါဌာန WhatsApp နံပါတ် (အလွတ်ထားပါက အဖွဲ့ဝင် ၁ ၏ နံပါတ်ကို သုံးမည်)
            </label>
            <input
              type="text"
              maxLength={64}
              value={draft.fatwaWhatsappNumber}
              onChange={(e) => setDraft({ ...draft, fatwaWhatsappNumber: e.target.value })}
              placeholder="+959xxxxxxxxx"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm font-mono text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              ဖသ်ဝါဌာန မိတ်ဆက်စာသား
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={draft.fatwaSubtitle}
              onChange={(e) => setDraft({ ...draft, fatwaSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              အထူးသတိပေးချက် (၁) - လင်မယားနှင့် အမွေဆိုင်ရာ
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={draft.fatwaNotice1}
              onChange={(e) => setDraft({ ...draft, fatwaNotice1: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              အထူးသတိပေးချက် (၂) - မဇ်ဟဗ် လမ်းစဉ်သတ်မှတ်ချက်
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={draft.fatwaNotice2}
              onChange={(e) => setDraft({ ...draft, fatwaNotice2: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>
        </div>
      </div>

      {/* 5. FOOTER & CONTACT INFO */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#EFE5D7]">
          <div className="w-9 h-9 rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#2C1810]">
              Footer နှင့် တရားဝင် အီးမေးလ် အချက်အလက်များ
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              Footer မိတ်ဆက်စာပိုဒ်
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={draft.footerDescription}
              onChange={(e) => setDraft({ ...draft, footerDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              တရားဝင် ဆက်သွယ်ရန် Email
            </label>
            <input
              type="email"
              maxLength={200}
              value={draft.contactEmail}
              onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm font-mono text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              အောက်ခြေ ညာဘက် Tagline
            </label>
            <input
              type="text"
              maxLength={200}
              value={draft.footerTagline}
              onChange={(e) => setDraft({ ...draft, footerTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3B2211] mb-1.5">
              Copyright စာသား
            </label>
            <input
              type="text"
              maxLength={200}
              value={draft.footerCopyright}
              onChange={(e) => setDraft({ ...draft, footerCopyright: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D9C4AC] rounded-xl text-xs sm:text-sm text-[#2C1810] outline-none focus:border-[#8B5A2B]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DEC9] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-[#7A6353] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {siteConfig.updatedAt
              ? `နောက်ဆုံး Sync ချိန်: ${new Date(siteConfig.updatedAt).toLocaleString()}`
              : 'မူလဆက်တင်များ အသုံးပြုထားသည်'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#633A18] rounded-xl text-xs font-semibold border border-[#D9C4AC] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>မူလအတိုင်း ပြန်ထားမည်</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-900 font-semibold">သေချာပါသလား?</span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
              >
                အတည်ပြု
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 text-xs text-[#6B5240]"
              >
                မလုပ်ပါ
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#8B5A2B] to-[#633A18] hover:from-[#9D6833] hover:to-[#74451E] disabled:opacity-60 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Sync လုပ်နေသည်...' : 'ပြင်ဆင်ချက်များ အားလုံးထံ Sync သိမ်းမည်'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
