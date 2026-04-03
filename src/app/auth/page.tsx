'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  onAuthStateChanged,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

type AuthMethod = 'select' | 'google' | 'email' | 'phone';
type EmailMode = 'signin' | 'signup';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setDoctorProfile } = useAuthStore();

  const [method, setMethod] = useState<AuthMethod>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailMode, setEmailMode] = useState<EmailMode>('signin');

  // Phone
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    setIsClient(true);

    const errorParam = searchParams.get('error');
    if (errorParam) setError(decodeURIComponent(errorParam));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store user and create doctor profile
        setUser(user);
        setDoctorProfile({
          id: user.uid,
          email: user.email || user.phoneNumber || 'unknown',
          specialty: '' as any, // Will be set in onboarding
        });
        router.push('/onboarding');
      }
    });

    return () => unsubscribe();
  }, [router, searchParams, setUser, setDoctorProfile]);

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
    };
  }, []);

  if (!isClient) return null;

  const handleError = (err: any) => {
    const code = err?.code || '';
    const map: Record<string, string> = {
      'auth/popup-closed-by-user': 'Sign-in cancelled. Try again.',
      'auth/popup-blocked': 'Popup blocked. Allow popups or use another method.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/unauthorized-domain': 'Domain not authorized in Firebase Console. Add localhost to authorized domains.',
      'auth/user-not-found': 'No account found with this email. Try signing up.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/email-already-in-use': 'Email already registered. Try signing in.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/invalid-phone-number': 'Invalid phone number. Use international format (+1234567890).',
      'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
      'auth/invalid-verification-code': 'Invalid verification code. Check and try again.',
      'auth/code-expired': 'Verification code expired. Request a new one.',
      'auth/invalid-credential': 'Invalid credentials. Check email and password.',
      'auth/operation-not-supported-in-this-environment': 'This auth method is not supported here. Try email/password or phone.',
    };
    setError(map[code] || err?.message || 'Authentication failed. Try again.');
    setLoading(false);
  };

  // ==================== GOOGLE ====================
  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setDoctorProfile({
        id: result.user.uid,
        email: result.user.email || '',
        specialty: '' as any,
      });
      router.push('/onboarding');
    } catch (err: any) {
      handleError(err);
    }
  };

  // ==================== EMAIL ====================
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      let result;
      if (emailMode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(result.user);
      setDoctorProfile({
        id: result.user.uid,
        email: result.user.email || email,
        specialty: '' as any,
      });
      router.push('/onboarding');
    } catch (err: any) {
      handleError(err);
    }
  };

  // ==================== PHONE ====================
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setError(null);

    try {
      // Setup recaptcha
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current);
      setConfirmationResult(confirmation);
      setCodeSent(true);
      setLoading(false);
    } catch (err: any) {
      handleError(err);
      // Reset recaptcha on error
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch {}
        recaptchaRef.current = null;
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;
    setLoading(true);
    setError(null);

    try {
      const result = await confirmationResult.confirm(verificationCode);
      setUser(result.user);
      setDoctorProfile({
        id: result.user.uid,
        email: result.user.phoneNumber || phoneNumber,
        specialty: '' as any,
      });
      router.push('/onboarding');
    } catch (err: any) {
      handleError(err);
    }
  };

  const resetToSelect = () => {
    setMethod('select');
    setError(null);
    setLoading(false);
    setCodeSent(false);
    setVerificationCode('');
    setConfirmationResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060d19] px-4">
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ambient background glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-[#00D4FF]/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#5352ED]/[0.03] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D4FF]/[0.02] rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg shadow-[#00D4FF]/10 animate-glow">
            <Image src="/logo.png" alt="BRAIN HEALTH" width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white/90 tracking-tight">BRAIN HEALTH</h1>
          <p className="text-sm text-white/35 mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 shadow-2xl shadow-black/30">
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-[#FF4757]/[0.08] border border-[#FF4757]/15 text-[#FF4757] text-sm flex items-start gap-2"
              >
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="text-xs text-[#FF4757]/50 hover:text-[#FF4757] mt-1 underline">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ==================== METHOD SELECTION ==================== */}
            {method === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/90 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs text-white/20">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Email */}
                <button
                  onClick={() => setMethod('email')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/90 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/[0.08] flex items-center justify-center">
                    <Mail size={16} className="text-[#00D4FF]/80" />
                  </div>
                  <span className="text-sm font-medium">Continue with Email</span>
                </button>

                {/* Phone */}
                <button
                  onClick={() => setMethod('phone')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/90 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00E5A0]/[0.08] flex items-center justify-center">
                    <Phone size={16} className="text-[#00E5A0]/80" />
                  </div>
                  <span className="text-sm font-medium">Continue with Phone</span>
                </button>
              </motion.div>
            )}

            {/* ==================== EMAIL FORM ==================== */}
            {method === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={resetToSelect} className="flex items-center gap-1 text-xs text-white/35 hover:text-[#00D4FF]/80 mb-4 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>

                <form onSubmit={handleEmail} className="space-y-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@hospital.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#060d19] border border-white/[0.06] text-white/90 text-sm placeholder-white/20 focus:border-[#00D4FF]/30 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs text-white/40 mb-1.5 block">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-[#060d19] border border-white/[0.06] text-white/90 text-sm placeholder-white/20 focus:border-[#00D4FF]/30 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bottom-3 text-white/30 hover:text-[#00D4FF]/80 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0070A8] text-[#060d19] font-semibold text-sm hover:from-[#00B8FF] hover:to-[#005A88] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00D4FF]/10"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {emailMode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailMode(emailMode === 'signin' ? 'signup' : 'signin')}
                    className="w-full text-xs text-white/30 hover:text-[#00D4FF]/70 transition-colors text-center py-1"
                  >
                    {emailMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ==================== PHONE FORM ==================== */}
            {method === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={resetToSelect} className="flex items-center gap-1 text-xs text-white/35 hover:text-[#00D4FF]/80 mb-4 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>

                {!codeSent ? (
                  <form onSubmit={handleSendCode} className="space-y-3">
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+212600000000"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#060d19] border border-white/[0.06] text-white/90 text-sm placeholder-white/20 focus:border-[#00D4FF]/30 focus:outline-none transition-all"
                      />
                      <p className="text-[10px] text-white/25 mt-1.5">Include country code (e.g., +212 for Morocco)</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5A0] to-[#00B87A] text-[#060d19] font-semibold text-sm hover:from-[#00D494] hover:to-[#00A66A] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00E5A0]/10"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                      Send Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-3">
                    <p className="text-xs text-[#00E5A0]/70 mb-2">Code sent to {phoneNumber}</p>
                    <div>
                      <label className="text-xs text-white/40 mb-1.5 block">Verification Code</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl bg-[#060d19] border border-white/[0.06] text-white/90 text-sm placeholder-white/20 focus:border-[#00D4FF]/30 focus:outline-none transition-all text-center text-lg tracking-widest font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || verificationCode.length < 6}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5A0] to-[#00B87A] text-[#060d19] font-semibold text-sm hover:from-[#00D494] hover:to-[#00A66A] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00E5A0]/10"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                      Verify & Sign In
                    </button>

                    <button
                      type="button"
                      onClick={() => { setCodeSent(false); setVerificationCode(''); setConfirmationResult(null); }}
                      className="w-full text-xs text-white/30 hover:text-[#00D4FF]/70 transition-colors text-center py-1"
                    >
                      Resend code
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/20 text-center mt-5">
          By signing in, you confirm you are a licensed healthcare professional
        </p>

        {/* Hidden recaptcha container */}
        <div id="recaptcha-container" />
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#060d19]"><Loader2 className="animate-spin text-[#00D4FF]/60" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
