import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  isDark?: boolean;
}

export function CookieConsent({ onAccept, onDecline, isDark: propIsDark }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(propIsDark || false);

  useEffect(() => {
    if (propIsDark === undefined) {
      const checkTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const isDarkMode = savedTheme === 'dark' || 
          (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(isDarkMode);
      };
      
      checkTheme();
      window.addEventListener('storage', checkTheme);
      return () => window.removeEventListener('storage', checkTheme);
    }
  }, [propIsDark]);

  // Check if user has already made a choice
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    onDecline?.();
  };

  const handlePreferences = () => {
    // Open preferences modal or navigate to settings
    // For now, just accept essential cookies
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 animate-slide-up`}>
      <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${isDark ? 'bg-stone-900/95 border-stone-700' : 'bg-white/95 border-stone-200'}`}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            {/* Icon */}
            <div className={`flex-shrink-0 p-3 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <svg className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className={`text-lg font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                We value your privacy
              </h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content. 
                By clicking "Accept All", you consent to our use of cookies. 
                <a href="/privacy" className={`font-medium ml-1 transition-colors duration-300 ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
                  Learn more
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Decline Button */}
              <button
                onClick={handleDecline}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                Decline
              </button>

              {/* Preferences Button */}
              <button
                onClick={handlePreferences}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 hover:scale-105 ${isDark ? 'border-stone-700 text-stone-300 hover:border-orange-500/50 hover:bg-orange-500/10' : 'border-stone-300 text-stone-700 hover:border-orange-400 hover:bg-orange-50'}`}
              >
                Preferences
              </button>

              {/* Accept Button */}
              <button
                onClick={handleAccept}
                className="group relative overflow-hidden px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-shift"></div>
                <span className="relative flex items-center gap-2">
                  Accept All
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Decorative bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-b-2xl"></div>
        </div>
      </div>

      {/* Styles specific to this component */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Hook to check if cookies were accepted
export function useCookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent');
    setConsent(stored);
  }, []);

  const hasConsent = consent === 'accepted' || consent === 'essential';
  const hasFullConsent = consent === 'accepted';

  return { consent, hasConsent, hasFullConsent };
}

// Simple version for minimal implementation
export function SimpleCookieConsent({ isDark }: { isDark?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark || false);

  useEffect(() => {
    if (isDark === undefined) {
      const theme = localStorage.getItem('theme');
      setDarkMode(theme === 'dark');
    }
    
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, [isDark]);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100] rounded-2xl shadow-2xl p-4 sm:p-5 animate-slide-up border backdrop-blur-xl transition-colors duration-500 ${darkMode ? 'bg-stone-900/95 border-stone-700' : 'bg-white/95 border-stone-200'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
          <svg className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div>
          <h4 className={`font-bold text-sm mb-1 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>Cookie Notice</h4>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
            We use cookies to improve your experience. 
            <a href="/privacy" className={`ml-1 font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>Learn more</a>
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={decline}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-300 ${darkMode ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="flex-1 relative overflow-hidden px-3 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <span className="relative">Accept</span>
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}