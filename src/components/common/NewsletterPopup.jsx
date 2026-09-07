import { useState, useEffect } from 'react';
import { X, Mail, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if dismissed previously
    const isDismissed = localStorage.getItem('kps_newsletter_dismissed');
    
    if (!isDismissed) {
      // Trigger popup after a comfortable 5-second delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('kps_newsletter_dismissed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Email address is required');
      setStatus('error');
      return;
    }
    
    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate API request
    setTimeout(() => {
      setStatus('success');
      // Dismiss after 2 seconds on success
      setTimeout(() => {
        handleDismiss();
      }, 2000);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-brand-green/10"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 rounded-full text-brand-gray hover:text-brand-green hover:bg-brand-gray-light transition-colors"
              aria-label="Close newsletter popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Accent */}
            <div className="bg-brand-green text-white p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold">Sign Up for Our Newsletter</h3>
              <p className="text-sm text-gray-200 mt-1">Get the latest updates and exclusive offers</p>
            </div>

            {/* Body Form */}
            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-brand-green-dark">Subscribed Successfully!</h4>
                  <p className="text-sm text-gray-600 mt-1">Thank you for joining our newsletter.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="newsletter-email" className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="newsletter-email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        disabled={status === 'loading'}
                        className={`w-full pl-10 pr-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                          status === 'error'
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                        }`}
                      />
                    </div>
                    {status === 'error' && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errorMsg}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-3 px-4 rounded-md text-sm shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 flex items-center justify-center space-x-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                  
                  <p className="text-[11px] text-center text-brand-gray leading-normal">
                    We value your privacy. You can unsubscribe at any time.
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
