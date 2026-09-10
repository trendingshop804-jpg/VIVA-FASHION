import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    console.error('[Uncaught Application Error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EAD8D0] flex items-center justify-center p-4 antialiased">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#F5EBE6] rounded-full flex items-center justify-center mx-auto text-[#C27D6E]">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#191E28]">
                VIVA FASHION ETHNIC
              </h2>
              <p className="text-sm text-[#71717A]">
                Something went wrong while loading the page. Please try refreshing.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-200 text-left font-mono break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Reload Website</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
