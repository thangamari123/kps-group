'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Layers, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

export default function AdminLoginPage() {
  const { login, authError } = useAuth();
  const { error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const displayError = errorMessage || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const msg = err?.message || 'Invalid credentials. Please verify your email and password.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#EAF5F1] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="h-14 px-4 py-2 bg-white border border-[#E2E9E5] rounded-2xl inline-flex items-center justify-center mx-auto mb-4 shadow-md shadow-slate-200/50">
            <img src="/images/kpslogo.webp" alt="KPS Logistics" className="h-9 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17211E]">KPS Worldwide Logistics</h1>
          <p className="text-xs text-[#66736E] mt-1 font-semibold uppercase tracking-wider">
            Administrative Management Console
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-[#E2E9E5] rounded-2xl p-7 sm:p-9 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#17211E]">Sign In to Admin Console</h2>
            <p className="text-xs text-[#66736E] mt-1">
              Enter your authorized credentials to access management tools.
            </p>
          </div>

          {displayError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#DC2626] flex items-start space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-1.5 shrink-0" />
              <p className="leading-relaxed font-semibold">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66736E]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="name@kpsgroup.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66736E]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#66736E] hover:text-[#17211E] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-[#006B4F]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#006B4F] focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E9E5] flex items-center justify-center space-x-2 text-[11px] text-[#66736E]">
            <ShieldCheck className="w-4 h-4 text-[#006B4F]" />
            <span>Encrypted Session with Firebase Auth & Cloud Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
