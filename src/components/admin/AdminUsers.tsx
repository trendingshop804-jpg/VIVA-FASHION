import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldCheck, ShieldAlert, XCircle, Trash2, Mail, Lock, Phone, User, AlertCircle, Loader2 } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import type { UserProfile } from '../../types';

export const AdminUsers: React.FC = () => {
  const { profile: currentAdminProfile } = useAuth();
  const { showToast } = useCart();

  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for creating new admin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAdmins = async () => {
    setIsLoading(true);
    const data = await AuthService.fetchAdminUsers();
    setAdmins(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const result = await AuthService.createAdminUser(formData);
    setIsSubmitting(false);

    if (result.error || !result.profile) {
      setFormError(result.error || 'Failed to create administrator account.');
    } else {
      showToast(`Admin account created for ${formData.name}!`, 'success');
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
      await loadAdmins();
    }
  };

  const handleToggleStatus = async (admin: UserProfile) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    const res = await AuthService.updateAdminStatus(admin.id, newStatus);
    if (res.success) {
      showToast(`Admin account ${admin.name} set to ${newStatus}.`, 'info');
      await loadAdmins();
    } else {
      showToast(res.error || 'Failed to update admin status', 'warn');
    }
  };

  const handleRemoveAdmin = async (admin: UserProfile) => {
    if (!window.confirm(`Are you sure you want to remove admin privileges from ${admin.name}?`)) {
      return;
    }

    const res = await AuthService.removeAdmin(admin.id);
    if (res.success) {
      showToast(`Admin privileges removed for ${admin.name}.`, 'info');
      await loadAdmins();
    } else {
      showToast(res.error || 'Failed to remove admin', 'warn');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#C27D6E]" />
            <span>Administrator Access & Role Management</span>
          </h2>
          <p className="text-xs text-[#555E6C] mt-0.5">
            Manage authenticated administrators who have access to the merchant control panel.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#191E28] hover:bg-[#C27D6E] text-white px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md shrink-0"
        >
          <UserPlus size={15} />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Security Info Banner */}
      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DEC3B5]/60 flex items-start gap-2.5 text-[11px] text-[#555E6C]">
        <ShieldAlert size={16} className="text-[#C27D6E] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#191E28] block">Role-Based Access Enforcement</strong>
          <span>Public visitors cannot register as administrators. Only existing authorized administrators can provision new admin accounts. The last remaining administrator account cannot be deleted or disabled.</span>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-[#DEC3B5]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#71717A]">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#C27D6E]" />
                    <span>Loading administrators...</span>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#71717A]">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => {
                  const isCurrent = adm.id === currentAdminProfile?.id;
                  const isLastAdmin = admins.filter(a => a.status === 'active').length <= 1;

                  return (
                    <tr key={adm.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#191E28] flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#F5EBE6] text-[#C27D6E] flex items-center justify-center font-bold">
                          {adm.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{adm.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] bg-[#C27D6E]/10 text-[#A66355] font-bold px-1.5 py-0.2 rounded ml-1.5 border border-[#C27D6E]/30">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#555E6C] font-mono text-[11px]">
                        {adm.email}
                      </td>

                      <td className="py-3.5 px-4 text-[#71717A]">
                        {adm.phone || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-[#191E28] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {adm.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          adm.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {adm.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#71717A] text-[11px]">
                        {new Date(adm.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleToggleStatus(adm)}
                          disabled={isLastAdmin && adm.status === 'active'}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors border ${
                            adm.status === 'active'
                              ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                          title={isLastAdmin && adm.status === 'active' ? 'Cannot disable last remaining admin' : 'Toggle active status'}
                        >
                          {adm.status === 'active' ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => handleRemoveAdmin(adm)}
                          disabled={isLastAdmin}
                          className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={isLastAdmin ? 'Cannot remove last remaining admin' : 'Remove Admin Privileges'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Admin User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)} />

          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden text-xs z-10">
            
            {/* Header */}
            <div className="p-4 bg-[#F5EBE6] border-b border-[#EAE3D9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#C27D6E]" />
                <h3 className="font-bold text-sm text-[#191E28] uppercase tracking-wider font-serif">
                  Provision New Administrator
                </h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-[#191E28] hover:bg-[#EAD7CD] rounded-full">
                <XCircle size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAdmin} className="p-5 space-y-3.5">
              
              {formError && (
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 flex items-center gap-2 text-xs">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Admin Full Name"
                    className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Admin Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#191E28] block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Set secure admin password"
                    className="w-full bg-white border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#DEC3B5] rounded-xl text-xs font-semibold text-[#191E28] hover:bg-[#EAD7CD]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#191E28] hover:bg-[#C27D6E] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Admin</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
