import { useState, useEffect, useCallback } from "react";

interface AdvertModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export default function AdvertModal({ isOpen = false, onClose, onComplete }: AdvertModalProps) {
  const [isDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Dummy ad data with placeholder images
  const dummyAds = [
    {
      id: 1,
      title: "Premium Quiz Features",
      description: "Unlock unlimited quiz creation and advanced analytics",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
      brand: "HyperQuizzes Pro",
      cta: "Learn More"
    },
    {
      id: 2,
      title: "Study Smarter",
      description: "AI-powered learning tools to boost your productivity",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop",
      brand: "StudyAI",
      cta: "Try Free"
    },
    {
      id: 3,
      title: "Connect with Learners",
      description: "Join millions of students sharing knowledge",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
      brand: "EduConnect",
      cta: "Join Now"
    }
  ];

  const currentAd = dummyAds[currentAdIndex];

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCountdown(5);
      setCanSkip(false);
      setCurrentAdIndex(Math.floor(Math.random() * dummyAds.length));
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !isVisible) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [countdown, isOpen, isVisible]);

  const handleSkip = useCallback(() => {
    if (canSkip && onComplete) {
      onComplete();
    }
  }, [canSkip, onComplete]);

  const handleClose = useCallback(() => {
    if (canSkip && onClose) {
      onClose();
    }
  }, [canSkip, onClose]);

  const handleNextAd = useCallback(() => {
    setCurrentAdIndex((prev) => (prev + 1) % dummyAds.length);
  }, [dummyAds.length]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[400] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        } ${
          isDark 
            ? 'bg-gray-900 border border-orange-500/30' 
            : 'bg-white border border-orange-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-orange-500/20 bg-gray-900/50' : 'border-orange-100 bg-orange-50/50'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
            }`}>
              Advertisement
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {canSkip ? (
                <span className="text-green-500 font-medium">You can skip now</span>
              ) : (
                <span>Skip in <span className="font-bold text-orange-500">{countdown}s</span></span>
              )}
            </span>
          </div>
          
          <button
            onClick={handleClose}
            disabled={!canSkip}
            className={`p-2 rounded-xl transition-all duration-200 ${
              canSkip 
                ? isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Ad Content */}
        <div className="relative">
          {/* Ad Image Container */}
          <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden group">
            <img
              src={currentAd.image}
              alt={currentAd.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Brand Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                isDark 
                  ? 'bg-black/50 text-white border border-white/20' 
                  : 'bg-white/90 text-slate-900 border border-white/50'
              }`}>
                Sponsored by {currentAd.brand}
              </span>
            </div>

            {/* Countdown Badge (when can't skip) */}
            {!canSkip && (
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
                  isDark ? 'bg-black/50 text-white' : 'bg-white/90 text-slate-900'
                }`}>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold">{countdown}</span>
                </div>
              </div>
            )}

            {/* Ad Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {currentAd.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base mb-4 max-w-lg drop-shadow-md">
                {currentAd.description}
              </p>
              <button 
                onClick={handleSkip}
                disabled={!canSkip}
                className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  canSkip 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105' 
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                }`}
              >
                {canSkip ? (
                  <>
                    {currentAd.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Wait {countdown}s
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          isDark ? 'bg-gray-900/30' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={handleNextAd}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isDark ? 'text-gray-400 hover:text-orange-400' : 'text-slate-500 hover:text-orange-600'
              }`}
            >
              Next Ad
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              {currentAdIndex + 1} / {dummyAds.length}
            </span>
            <div className="flex gap-1.5">
              {dummyAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAdIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentAdIndex 
                      ? 'bg-orange-500 w-4' 
                      : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skip Button (Bottom) - Only shows when can skip */}
        {canSkip && (
          <div className={`px-6 py-3 border-t flex justify-center ${
            isDark ? 'border-orange-500/20 bg-gray-900/20' : 'border-orange-100 bg-orange-50/30'
          }`}>
            <button
              onClick={handleSkip}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              Skip Advertisement
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}