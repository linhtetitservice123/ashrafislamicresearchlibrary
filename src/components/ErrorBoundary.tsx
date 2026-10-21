import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, BookOpen } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('ira_papers');
      localStorage.removeItem('ira_requests');
      localStorage.removeItem('ira_bookmarks');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810] flex items-center justify-center p-4 font-burmese">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#DFD1BF] p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#2C1810]">
                Islamic Research Academy
              </h2>
              <p className="text-xs text-[#8C7667]">
                အစ္စလာမ့် သုတေသန အကယ်ဒမီ
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DEC9] text-xs text-[#664E3D] leading-relaxed">
              စာမျက်နှာ ဖွင့်လှစ်ရာတွင် ယာယီအမှားအယွင်း ဖြစ်ပေါ်ခဲ့ပါသည်။ အောက်ပါခလုတ်ကို နှိပ်၍ စာမျက်နှာကို ပြန်လည်စတင်နိုင်ပါပြီ။
            </div>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B5A2B] hover:bg-[#6E421C] text-white rounded-xl text-sm font-semibold shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>စာမျက်နှာ ပြန်လည်စတင်မည် (Restart)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
