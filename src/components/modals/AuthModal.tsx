import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ShieldCheck, ShoppingBag, Heart, LogOut, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

export const AuthModal: React.FC = () => {
  const { profile, isAdmin, isAuthenticated, isLoading, login, signup, logout, isAuthModalOpen, setIsAuthModalOpen, authModalTab, setAuthModalTab } = useAuth();
  const { setIsAdminMode } = useAdmin();
  const { setIsWishlistOpen, setIsMyOrdersOpen } = useUI();
  const { showToast } = useCart();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
      handleClose();

      // If user has admin role, redirect to admin dashboard
      if (res.isAdmin) {
        setIsAdminMode(true);
        window.location.hash = '#admin';
      }
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const res = await signup(email, password, name, phone);
    setIsSubmitting(false);

    if (res.success) {
      showToast(`Account created successfully! Welcome, ${name}.`, 'success');
      handleClose();
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAdminMode(false);
    showToast('Signed out successfully.', 'info');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden text-xs z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#F5EBE6] border-b border-[#EAE3D9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#C27D6E]" />
            <h3 className="font-bold text-sm text-[#191E28] uppercase tracking-wider font-serif">
              {isAuthenticated ? 'My Account' : authModalTab === 'signup' ? 'Create Customer Account' : 'Sign In'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-[#191E28] hover:bg-[#EAD7CD] rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5">
          
          {/* VIEW 1: AUTHENTICATED CUSTOMER / ADMIN PROFILE VIEW */}
          {isAuthenticated && profile ? (
            <div className="space-y-4">
              
              {/* Profile Card */}
              <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#191E28]">{profile.name}</h4>
                    <p className="text-[11px] text-[#71717A]">{profile.email}</p>
                    {profile.phone && <p className="text-[11px] text-[#71717A]">{profile.phone}</p>}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    profile.role === 'admin'
                      ? 'bg-[#C27D6E]/20 text-[#A66355] border border-[#C27D6E]/40'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {profile.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                
                {/* Admin Access (Only visible to verified admins) */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsAdminMode(true);
                      window.location.hash = '#admin';
                      handleClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191E28] text-white hover:bg-[#C27D6E] transition-colors font-bold shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#C27D6E]" />
                      <span>Open Admin Control Panel</span>
                    </div>
                    <ArrowRight size={14} />
                  </button>
                )}

                {/* My Orders */}
                <button
                  onClick={() => {
                    handleClose();
                    setIsMyOrdersOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#DEC3B5]/60 hover:bg-[#FAF7F2] text-[#191E28] font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={15} className="text-[#C27D6E]" />
                    <span>My Orders & Order Tracking</span>
                  </div>
                  <ArrowRight size={14} className="text-[#71717A]" />
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => {
                    handleClose();
                    setIsWishlistOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#DEC3B5]/60 hover:bg-[#FAF7F2] text-[#191E28] font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Heart size={15} className="text-[#C27D6E]" />
                    <span>My Wishlist</span>
                  </div>
                  <ArrowRight size={14} className="text-[#71717A]" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors border border-red-200 mt-2"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            
            /* VIEW 2: UNIFIED LOGIN / SIGNUP TABS */
            <div className="space-y-4">
              
              {/* Tab Switcher */}
              <div className="flex bg-[#EAE3D9] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    authModalTab === 'login'
                      ? 'bg-white text-[#191E28] shadow-xs'
                      : 'text-[#71717A] hover:text-[#191E28]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    authModalTab === 'signup'
                      ? 'bg-white text-[#191E28] shadow-xs'
                      : 'text-[#71717A] hover:text-[#191E28]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 flex items-center gap-2 text-xs">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* TAB A: SIGN IN FORM */}
              {authModalTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Password</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-2.5 rounded-xl font-bold uppercase tracking-[0.14em] transition-all shadow-md flex items-center justify-center gap-2 mt-1 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-[#71717A] pt-1">
                    Customer or Administrator? Sign in with your registered credentials.
                  </p>
                </form>
              )}

              {/* TAB B: CUSTOMER SIGNUP FORM */}
              {authModalTab === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Mobile Phone (Optional)</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Password * (min. 6 characters)</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-[#191E28] hover:bg-[#C27D6E] text-white py-2.5 rounded-xl font-bold uppercase tracking-[0.14em] transition-all shadow-md flex items-center justify-center gap-2 mt-1 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] justify-center pt-1">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>Secure encrypted customer account with instant order tracking</span>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
