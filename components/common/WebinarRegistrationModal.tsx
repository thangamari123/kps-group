'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { X, User, Mail, Phone, CheckCircle2, AlertCircle, Loader2, Video } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { webinarRegistrationsApi } from '@/lib/api';
import { OPEN_WEBINAR_REGISTRATION_EVENT } from '@/lib/announcement-utils';

interface OpenDetail {
  announcementId: string;
  webinarName: string;
  /** Element that triggered the popup; focus goes back to it on close */
  opener?: HTMLElement | null;
}

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'submitting' | 'success';

const EMPTY: FormValues = { fullName: '', email: '', phone: '' };
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const AUTO_OPEN_DELAY_MS = 2000;
const POPUP_STATE_KEY = 'kps-webinar-popup-v1';

type PopupState = Record<string, 'registered' | 'dismissed'>;

// State is kept per announcement so a newly announced webinar can still be shown to returning visitors.
function readPopupState(): PopupState {
  try {
    const parsed = JSON.parse(localStorage.getItem(POPUP_STATE_KEY) || 'null');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function markPopupState(announcementId: string, value: 'registered' | 'dismissed') {
  try {
    const state = readPopupState();
    if (state[announcementId] === 'registered') return;
    state[announcementId] = value;
    localStorage.setItem(POPUP_STATE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the popup may show again next visit, which is acceptable */
  }
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.fullName.trim();
  if (!name) errors.fullName = 'Full name is required.';
  else if (name.length < 2 || !/\p{L}/u.test(name)) errors.fullName = 'Please enter your full name.';
  else if (name.length > 100) errors.fullName = 'Name must be 100 characters or fewer.';

  const email = values.email.trim();
  if (!email) errors.email = 'Email address is required.';
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';

  const phone = values.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'Contact number is required.';
  else if (!/^\+?[0-9\s().-]{7,25}$/.test(phone) || digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please enter a valid contact number (10 to 15 digits).';
  }
  return errors;
}

const inputBase =
  'w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm text-[#1f2937] placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors';

export default function WebinarRegistrationModal() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [target, setTarget] = useState<OpenDetail | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const openedAtRef = useRef(0);
  const submittingRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const isOpen = target !== null;

  const isAdminRoute = pathname?.startsWith('/admin') ?? false;
  const autoScheduledRef = useRef(false);
  const targetIdRef = useRef<string | null>(null);
  const registeredRef = useRef(false);
  targetIdRef.current = target?.announcementId ?? null;

  const close = useCallback(() => {
    if (submittingRef.current) return;
    // Closing without registering counts as a dismissal, so the auto popup won't return on the next visit
    if (targetIdRef.current && !registeredRef.current) markPopupState(targetIdRef.current, 'dismissed');
    setTarget(null);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenDetail>).detail;
      if (!detail?.announcementId) return;
      registeredRef.current = false;
      returnFocusRef.current = detail.opener || (document.activeElement as HTMLElement | null);
      openedAtRef.current = Date.now();
      submittingRef.current = false;
      setValues(EMPTY);
      setHoneypot('');
      setErrors({});
      setSubmitError(null);
      setStatus('idle');
      setTarget({ announcementId: detail.announcementId, webinarName: detail.webinarName || 'Free Webinar' });
    };
    window.addEventListener(OPEN_WEBINAR_REGISTRATION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WEBINAR_REGISTRATION_EVENT, onOpen);
  }, []);

  // First-visit popup: once per page load, 2s after mount, never on admin pages. Uses the same active
  // "register" announcement as the announcement bar, so the existing worker route validates it.
  useEffect(() => {
    if (isAdminRoute || autoScheduledRef.current) return;
    autoScheduledRef.current = true;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const seen = readPopupState();
        const { announcementsCms } = await import('@/lib/cms-firestore');
        const [settings, active] = await Promise.all([
          announcementsCms.getSettings().catch(() => ({ enabled: true })),
          announcementsCms.getActive(),
        ]);
        if (cancelled || !settings.enabled) return;
        const webinar = active.find(
          (a) => a.ctaAction === 'register' && !seen[a.id] && (a.webinarTitle || a.text || '').trim()
        );
        if (!webinar) return;
        // Don't stack on top of another dialog the visitor already opened
        if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
        // Re-read in case another tab registered/dismissed while we were loading
        if (readPopupState()[webinar.id]) return;
        window.dispatchEvent(
          new CustomEvent<OpenDetail>(OPEN_WEBINAR_REGISTRATION_EVENT, {
            detail: { announcementId: webinar.id, webinarName: (webinar.webinarTitle || webinar.text).trim() },
          })
        );
      } catch (err) {
        // A failed lookup must never get in the way of browsing the site
        console.warn('Webinar popup skipped:', err);
      }
    }, AUTO_OPEN_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      autoScheduledRef.current = false;
    };
  }, [isAdminRoute]);

  // Lock page scroll while open, focus the first field, and hand focus back on close
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  // Navigating away closes the popup
  useEffect(() => {
    if (targetIdRef.current && !registeredRef.current) markPopupState(targetIdRef.current, 'dismissed');
    setTarget(null);
  }, [pathname]);

  // Escape and Tab handling lives on the document, not the dialog: while the form is submitting its
  // controls are disabled, which drops focus to the page, and Escape must still work from there.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([tabindex="-1"]):not([disabled])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const setField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!target || submittingRef.current || status === 'success') return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = (['fullName', 'email', 'phone'] as const).find((k) => found[k]);
      dialogRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    submittingRef.current = true; // blocks double-clicks / double-Enter before React re-renders
    setStatus('submitting');
    setSubmitError(null);
    try {
      const result = await webinarRegistrationsApi.submit({
        announcementId: target.announcementId,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        website: honeypot,
        elapsedMs: Date.now() - openedAtRef.current,
      });
      setSuccessMessage(result?.message || 'Thank you for registering. We will contact you with the webinar details.');
      registeredRef.current = true;
      markPopupState(target.announcementId, 'registered');
      setStatus('success');
    } catch (err: any) {
      // Already on file for this email: treat as registered so the popup stops appearing
      if (err?.status === 409) markPopupState(target.announcementId, 'registered');
      setSubmitError(
        err?.status === 0
          ? 'Could not reach the server. Please check your connection and try again.'
          : err?.message || 'Something went wrong. Please try again.'
      );
      setStatus('idle');
    } finally {
      submittingRef.current = false;
    }
  };

  if (pathname?.startsWith('/admin')) return null;

  const submitting = status === 'submitting';

  return (
    <AnimatePresence>
      {isOpen && target && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="webinar-reg-title"
            aria-describedby="webinar-reg-subtitle"
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-md my-auto max-h-[94vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-[#073B2C] px-5 sm:px-6 pt-5 pb-4 text-white">
              <span className="absolute inset-x-0 top-0 h-1 bg-[#FFC107]" aria-hidden="true" />
              <button
                type="button"
                onClick={close}
                disabled={submitting}
                className="absolute top-3 right-3 p-1.5 rounded-full text-white/70 hover:text-[#073B2C] hover:bg-[#FFC107] transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Close registration form"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-[#FFC107] text-[10px] font-extrabold uppercase tracking-[0.18em] mb-1.5">
                <Video className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Free Webinar</span>
              </div>
              <h2 id="webinar-reg-title" className="text-lg sm:text-xl font-bold leading-snug pr-8">
                Register for Free Webinar
              </h2>
              <p id="webinar-reg-subtitle" className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-snug">
                {target.webinarName}
              </p>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 sm:px-6 py-5">
              {status === 'success' ? (
                <div className="text-center py-4" role="status" aria-live="polite">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5EF]">
                    <CheckCircle2 className="h-8 w-8 text-[#0F7A5A]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[#073B2C]">You&apos;re registered!</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{successMessage}</p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 w-full rounded-xl bg-[#073B2C] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#FFC107] hover:text-[#073B2C] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Honeypot: invisible to people, tempting to bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </label>
                  </div>

                  <div>
                    <label htmlFor="webinar-name" className="mb-1.5 block text-xs font-bold text-[#073B2C]">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        ref={firstFieldRef}
                        id="webinar-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        value={values.fullName}
                        onChange={(e) => setField('fullName', e.target.value)}
                        disabled={submitting}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'webinar-name-error' : undefined}
                        placeholder="Your full name"
                        className={`${inputBase} ${errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#0F5B44] focus:ring-[#0F5B44]/20'}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="webinar-name-error" className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="webinar-email" className="mb-1.5 block text-xs font-bold text-[#073B2C]">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="webinar-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        maxLength={254}
                        value={values.email}
                        onChange={(e) => setField('email', e.target.value)}
                        disabled={submitting}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'webinar-email-error' : undefined}
                        placeholder="you@company.com"
                        className={`${inputBase} ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#0F5B44] focus:ring-[#0F5B44]/20'}`}
                      />
                    </div>
                    {errors.email && (
                      <p id="webinar-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="webinar-phone" className="mb-1.5 block text-xs font-bold text-[#073B2C]">
                      Contact Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="webinar-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={25}
                        value={values.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        disabled={submitting}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'webinar-phone-error' : undefined}
                        placeholder="+91 98765 43210"
                        className={`${inputBase} ${errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#0F5B44] focus:ring-[#0F5B44]/20'}`}
                      />
                    </div>
                    {errors.phone && (
                      <p id="webinar-phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B2C] py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#FFC107] hover:text-[#073B2C] active:bg-[#e0a800] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:ring-offset-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Register Now</span>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-gray-500">
                    We only use your details to share webinar information. No payment is required.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
