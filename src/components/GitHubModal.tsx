import React, { useState } from 'react';
import {
  X,
  Github,
  Globe,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Smartphone,
  Share2,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Laptop,
} from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'pc'>('mobile');
  const [githubUsername, setGithubUsername] = useState('');
  const [repoName, setRepoName] = useState('islamic-research-academy');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommandIndex, setCopiedCommandIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // Real App URL running right now with safe fallback
  let liveAppUrl = '';
  try {
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      liveAppUrl = window.location.href;
    }
  } catch (e) {
    console.error(e);
  }

  const repoUrl = githubUsername
    ? `https://github.com/${githubUsername}/${repoName}.git`
    : `https://github.com/<your-username>/${repoName}.git`;

  const livePagesUrl = githubUsername
    ? `https://${githubUsername}.github.io/${repoName}/`
    : `https://<your-username>.github.io/${repoName}/`;

  const gitCommands = [
    'git init',
    'git add .',
    'git commit -m "Initial commit for Islamic Research Academy"',
    'git branch -M main',
    `git remote add origin ${repoUrl}`,
    'git push -u origin main',
  ];

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(liveAppUrl);
      }
    } catch (e) {
      console.error(e);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Islamic Research Academy (အစ္စလာမ့် သုတေသန အကယ်ဒမီ) သာသနာရေးရာ စာတမ်းများ ပလက်ဖောင်း ဝဘ်ဆိုက်ကို ဤလင့်ခ်တွင် ဝင်ရောက်လေ့လာနိုင်ပါသည်:\n${liveAppUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCommandIndex(index);
    setTimeout(() => setCopiedCommandIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-burmese animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#1C0F08] via-[#2D160D] to-[#180C06] text-white flex items-center justify-between border-b border-[#4A2E19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  ဖုန်းဖြင့် Website ပြုလုပ်/လွှင့်တင်နည်း
                </h2>
                <span className="text-[10px] bg-[#8B5A2B] text-[#FDEBD0] px-2 py-0.5 rounded-full font-sans">
                  Mobile Guide
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#D9C4AC]">
                ကွန်ပျူတာမလိုဘဲ ဖုန်းထဲမှ အလွယ်ဆုံး Website လုပ်နည်းနှင့် လွှင့်တင်နည်း
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D9C4AC] hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Mobile vs PC */}
        <div className="bg-[#FAF7F2] p-1.5 border-b border-[#E8DEC9] flex gap-2">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'mobile'
                ? 'bg-[#8B5A2B] text-white shadow'
                : 'text-[#664E3D] hover:bg-white/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>ဖုန်းဖြင့် အလွယ်လုပ်နည်း (Mobile Guide)</span>
          </button>

          <button
            onClick={() => setActiveTab('pc')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'pc'
                ? 'bg-[#8B5A2B] text-white shadow'
                : 'text-[#664E3D] hover:bg-white/60'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>ကွန်ပျူတာ / Git Commands</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-[#2C1810]">
          {activeTab === 'mobile' ? (
            /* MOBILE TAB CONTENT */
            <div className="space-y-4">
              {/* Box 1: Good News - Website is already live! */}
              <div className="bg-gradient-to-br from-[#EAF7EE] to-[#D5EFE0] p-4 rounded-2xl border border-[#BDE5CB] shadow-sm">
                <div className="flex items-center gap-2 text-[#155724] font-bold text-sm mb-1.5">
                  <Globe className="w-4 h-4 text-[#22C55E]" />
                  <span>သတင်းကောင်း! သင့် Website သည် အခုချက်ချင်း အင်တာနက်ပေါ်တွင် Live လွှင့်တင်ပြီး ဖြစ်ပါသည်</span>
                </div>
                <p className="text-xs text-[#285E39] leading-relaxed mb-3">
                  ကွန်ပျူတာ သို့မဟုတ် Terminal မလိုဘဲ အောက်ပါ Live Link ကို ဖုန်းထဲမှ တိုက်ရိုက်ကူးယူ၍ မည်သူမဆို
                  အင်တာနက် browser ဖြင့် ချက်ချင်း ဝင်ရောက်ကြည့်ရှုနိုင်ပါပြီ။
                </p>

                <div className="bg-white p-2.5 rounded-xl border border-[#C3E6CB] flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs text-[#155724] font-mono truncate select-all">
                    {liveAppUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D4E] hover:bg-[#23633E] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ကူးယူပြီး ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Link ကူးယူမည်</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1B3F2B] hover:bg-[#153423] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                    <span>WhatsApp သို့ လင့်ခ်ပို့မည်</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#2C1810] border border-[#C3E6CB] rounded-xl text-xs font-semibold transition-all"
                  >
                    <Share2 className="w-4 h-4 text-[#8B5A2B]" />
                    <span>Facebook / Viber သို့ Share ရန်</span>
                  </button>
                </div>
              </div>

              {/* Box 2: If they really want GitHub repository using phone */}
              <div className="bg-white p-4 rounded-2xl border border-[#DFD1BF] shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#3B2211]">
                  <Github className="w-4 h-4 text-[#8B5A2B]" />
                  <span>ဖုန်း browser ဖြင့် GitHub ပေါ်တင်လိုပါက ပြုလုပ်နည်း (၃ ဆင့်)</span>
                </div>

                <div className="space-y-3 text-xs text-[#664E3D]">
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE2D2] flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white shrink-0 flex items-center justify-center text-[10px] font-bold">
                      ၁
                    </span>
                    <div>
                      <strong className="text-[#3B2211] block mb-0.5">GitHub တွင် Desktop Mode ပြောင်းပါ:</strong>
                      ဖုန်း Chrome Browser တွင်{' '}
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8B5A2B] font-bold underline"
                      >
                        github.com
                      </a>{' '}
                      သို့သွားပြီး ညာဘက်အပေါ်ထောင့် အစက် (၃) စက် (⋮) ကိုနှိပ်၍ <strong>"Desktop site"</strong> ကို အမှန်ခြစ်ပါ။
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE2D2] flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white shrink-0 flex items-center justify-center text-[10px] font-bold">
                      ၂
                    </span>
                    <div>
                      <strong className="text-[#3B2211] block mb-0.5">Repository အသစ် ဖွင့်ပါ:</strong>
                      အပေါ်ညာဘက်ရှိ <strong>"+"</strong> icon ကိုနှိပ်ပြီး <strong>"New repository"</strong> ကို နှိပ်ပါ။ နာမည်ပေးပြီး <strong>Create</strong> နှိပ်ပါ။
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE2D2] flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white shrink-0 flex items-center justify-center text-[10px] font-bold">
                      ၃
                    </span>
                    <div>
                      <strong className="text-[#3B2211] block mb-0.5">ဖုန်းထဲမှ ဖိုင်များကို တိုက်ရိုက်တင်ပါ (Upload files):</strong>
                      ကုဒ်ရိုက်စရာမလိုဘဲ <strong>"uploading an existing file"</strong> ခလုတ်ကို နှိပ်ပြီး ဖုန်းထဲမှ ဖိုင်များကို ရွေးချယ်တင်သွင်းနိုင်ပါသည်။
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: What website do you want to build on phone? */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#D9C4AC] text-xs text-[#543F31] space-y-1.5">
                <div className="font-bold text-[#8B5A2B] flex items-center gap-1.5 text-xs sm:text-sm">
                  <HelpCircle className="w-4 h-4" /> သင် ဖုန်းထဲတွင် မည်သို့သော Website မျိုး ဖန်တီးလိုပါသလဲ?
                </div>
                <p>
                  • အကယ်၍ ဤ <strong>Islamic Research Academy (အစ္စလာမ့် သုတေသန အကယ်ဒမီ)</strong> ဝဘ်ဆိုက်တွင် ပြင်ဆင်လိုသည့် အချက်များ၊ စာတမ်းအသစ်၊ ပုံစံဒီဇိုင်းများ ရှိပါက ကျွန်ုပ်အား ဖုန်းထဲမှ စာရိုက်၍ တိုက်ရိုက် ပြောပြနိုင်ပါသည်။
                </p>
                <p>
                  • အကယ်၍ အခြား သီးသန့် Website အသစ် (ဥပမာ- ကိုယ်ပိုင် Portfolio၊ ဆိုင်အရောင်းဆိုင်၊ သို့မဟုတ် ဘလော့ဂ်) တစ်ခုခု ပြုလုပ်လိုပါကလည်း ပြောပြပေးပါ၊ ချက်ချင်း ဖန်တီးပေးပါမည်!
                </p>
              </div>
            </div>
          ) : (
            /* PC / TERMINAL TAB CONTENT */
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DEC9] text-xs text-[#664E3D]">
                ကွန်ပျူတာ သို့မဟုတ် VS Code ဖြင့် GitHub သို့ Push လုပ်လိုပါက အောက်ပါ Command များကို သုံးနိုင်ပါသည်:
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#664E3D] mb-1">
                  GitHub Username:
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value.trim())}
                  placeholder="ဥပမာ: my-username"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9C8B4] font-mono focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div className="bg-[#1C120C] text-[#F3E5D0] p-3.5 rounded-xl font-mono text-xs overflow-x-auto space-y-1.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-[11px] text-[#D9A86B]">Terminal Commands:</span>
                  <button
                    onClick={() => handleCopyCommand(gitCommands.join('\n'), 99)}
                    className="text-[10px] text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded"
                  >
                    {copiedCommandIndex === 99 ? 'အားလုံး ကူးယူပြီး ✓' : 'အားလုံး Copy ကူးရန်'}
                  </button>
                </div>
                {gitCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center justify-between group py-0.5">
                    <code>{cmd}</code>
                    <button
                      onClick={() => handleCopyCommand(cmd, idx)}
                      className="opacity-70 group-hover:opacity-100 text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded"
                    >
                      {copiedCommandIndex === idx ? '✓' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#FAF7F2] border-t border-[#DFD1BF] flex items-center justify-between">
          <span className="text-xs text-[#7A6253]">
            Islamic Research Academy
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8B5A2B] hover:bg-[#6E421C] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            ပိတ်မည် (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
