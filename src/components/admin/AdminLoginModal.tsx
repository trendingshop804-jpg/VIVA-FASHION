import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Store, Loader2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';

export const AdminLoginModal: React.FC = () => {
  const { loginAdmin, setIsAdminMode } = useAdmin();
  const { login, isAdmin, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed.');
      return;
    }

    if (!result.isAdmin) {
      setError('This account does not have administrator privileges.');
      return;
    }

    window.history.pushState({}, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#191E28] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#C27D6E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191E28] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <Logo size="md" className="mx-auto" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5EBE6] text-[#A66355] text-[10px] font-bold uppercase tracking-wider mt-2">
            <ShieldCheck size={12} />
            <span>Merchant Control Center</span>
          </div>
          <h2 className="text-xl font-bold text-[#191E28] font-serif">Admin Authentication</h2>
          <p className="text-xs text-[#555E6C]">
            Sign in with your administrator account to manage the store.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191E28] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C93A0]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vivafashion.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DEC3B5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C27D6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191E28] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C93A0]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DEC3B5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C27D6E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-3 rounded-lg text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#EAE3D9] text-center">
          <button
            onClick={() => {
              setIsAdminMode(false);
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#A66355] font-semibold hover:text-[#191E28] transition-colors"
          >
            <Store size={14} />
            <span>Return to Customer Storefront</span>
          </button>
        </div>

      </div>
    </div>
  );
};
