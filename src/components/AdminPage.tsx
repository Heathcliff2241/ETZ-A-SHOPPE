'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, KeyRound, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import AdminPanel from '../components/AdminPanel';

type AuthState = 'idle' | 'sending' | 'awaiting_code' | 'verifying' | 'authenticated';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cesaresmero2@gmail.com';

function maskEmail(value: string) {
  if (!value) return '';
  const [local, domain] = value.split('@');
  if (!domain) return value;
  const maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : `${local.slice(0, 2)}${'*'.repeat(Math.max(1, local.length - 2))}`;
  const [domainName, ...domainRest] = domain.split('.');
  const maskedDomain = domainRest.length > 0 ? `***.${domainRest.join('.')}` : `***`;
  return `${maskedLocal}@${maskedDomain}`;
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [email, setEmail] = useState('');
  const [configuredEmail, setConfiguredEmail] = useState('');
  const [code, setCode] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  // Automatically dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load saved email from localStorage on mount (client-side only)
  useEffect(() => {
    const savedEmail = localStorage.getItem('etz_admin_email_input');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Load configured admin email hint on mount
  useEffect(() => {
    fetch('/api/admin/login-hint')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch login hint');
        return res.json();
      })
      .then((data) => {
        if (data?.email) {
          setConfiguredEmail(data.email.trim());
          // Pre-fill state if there is no user-typed state in localStorage
          if (!localStorage.getItem('etz_admin_email_input')) {
            setEmail(data.email.trim());
          }
        }
      })
      .catch((err) => {
        console.warn('[hint] Could not fetch admin login hint:', err);
      });
  }, []);

  // Persist token in sessionStorage so refreshes don't require re-login
  useEffect(() => {
    const stored = sessionStorage.getItem('etz_admin_token') || localStorage.getItem('etz_admin_token');
    if (stored) {
      sessionStorage.setItem('etz_admin_token', stored);
      localStorage.setItem('etz_admin_token', stored);
      setToken(stored);
      setAuthState('authenticated');
    }
  }, []);

  const parseJsonSafely = async (res: Response) => {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return { error: text }; 
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setError('Please enter your email address.');
      showToast('Please enter your email address.', 'error');
      return;
    }
    setError(null);
    setAuthState('sending');
    try {
      localStorage.setItem('etz_admin_email_input', email.trim());
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || 'Failed to send OTP.');
      if (data?.otpToken) {
        setOtpToken(String(data.otpToken));
      } else {
        setOtpToken(null);
      }
      setCode('');
      setAuthState('awaiting_code');
      showToast('OTP code sent successfully!', 'success');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      showToast(errMsg, 'error');
      setEmail('');
      localStorage.removeItem('etz_admin_email_input');
      setAuthState('idle');
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setAuthState('verifying');
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code, otpToken }),
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data?.error || 'Invalid code.');
      sessionStorage.setItem('etz_admin_token', data.token);
      localStorage.setItem('etz_admin_token', data.token);
      setToken(data.token);
      setAuthState('authenticated');
      showToast('Logged in successfully!', 'success');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      showToast(errMsg, 'error');
      setCode('');
      setAuthState('awaiting_code');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('etz_admin_token');
    localStorage.removeItem('etz_admin_token');
    setToken(null);
    setAuthState('idle');
    setCode('');
    setOtpToken(null);
    setError(null);
  };

  if (authState === 'authenticated' && token) {
    return <AdminPanel token={token} onLogout={handleLogout} />;
  }

  const isLoading = authState === 'sending' || authState === 'verifying';

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C1C1A] mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Admin Access</h1>
          <p className="text-sm text-[#6B6B65] mt-1">ETZ · Owner Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E3DE] rounded-2xl p-6 shadow-sm space-y-5">

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1 — Email */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#1C1C1A] tracking-wide uppercase">
                Admin Email
              </label>
              {email.trim().toLowerCase() === configuredEmail.toLowerCase() && configuredEmail !== '' && (
                <span className="text-[11px] font-semibold text-[#2D6A4F] uppercase tracking-wider animate-pulse">
                  Verified Owner Email
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B93]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authState === 'awaiting_code' || isLoading}
                className={`w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F6F2] border rounded-xl text-[#1C1C1A] placeholder-[#9B9B93] focus:outline-none focus:ring-1 transition-colors disabled:opacity-60 ${
                  email.trim().toLowerCase() === configuredEmail.toLowerCase() && configuredEmail !== ''
                    ? 'border-[#2D6A4F] focus:border-[#2D6A4F] focus:ring-[#2D6A4F]'
                    : 'border-[#E5E3DE] focus:border-[#2D6A4F] focus:ring-[#2D6A4F]'
                }`}
                placeholder="you@domain.com"
              />
            </div>
          </div>

          {/* Step 2 — OTP Code (shown after sending) */}
          <AnimatePresence>
            {authState === 'awaiting_code' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold text-[#1C1C1A] tracking-wide uppercase">
                  6-Digit Code
                </label>
                <p className="text-xs text-[#6B6B65]">Check your inbox — the code expires in 10 minutes.</p>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B93]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && handleVerifyOtp()}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F7F6F2] border border-[#E5E3DE] rounded-xl text-[#1C1C1A] placeholder-[#9B9B93] focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] tracking-[0.3em] font-mono transition-colors"
                    placeholder="000000"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          {authState === 'awaiting_code' || authState === 'verifying' ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleVerifyOtp}
                disabled={code.length !== 6 || isLoading}
                className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {authState === 'verifying' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  'Verify & Login'
                )}
              </button>
              <button
                onClick={() => { setAuthState('idle'); setCode(''); setError(null); }}
                className="text-xs text-[#6B6B65] hover:text-[#1C1C1A] transition-colors cursor-pointer bg-transparent border-none"
              >
                ← Use a different email
              </button>
            </div>
          ) : (
            <button
              onClick={handleRequestOtp}
              disabled={!email || isLoading}
              className="w-full bg-[#1C1C1A] hover:bg-[#2D6A4F] text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {authState === 'sending' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                'Send OTP Code'
              )}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-[#9B9B93] mt-6">
          This page is only accessible via direct URL.
        </p>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm z-50 ${
              toast.type === 'success' ? 'bg-white border-[#2D6A4F]/20 text-[#1C1C1A]' : 'bg-white border-red-200 text-red-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-[#2D6A4F]" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}