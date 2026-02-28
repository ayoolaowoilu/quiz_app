import { useState, useEffect } from 'react';

export default function Gen() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-stone-950' : 'bg-orange-50'}`}>
      {/* Background Shapes - Hidden on mobile to prevent overlap */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-orange-600/10' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-amber-600/10' : 'bg-amber-300/30'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-yellow-600/5' : 'bg-yellow-200/20'}`}></div>
      </div>

      {/* Navigation - Fixed padding for mobile */}
      <nav className={`relative z-50 px-4 sm:px-6 lg:px-12 py-4 sm:py-6 transition-colors duration-500`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isDark ? 'bg-orange-500/20' : 'bg-white shadow-lg'}`}>
              <img 
                src="/src/assets/carrot-diet-fruit-svgrepo-com.svg" 
                alt="Hyper Quizes" 
                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm"
              />
            </div>
            <span className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
              Hyper<span className="text-orange-500">Quizes</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 ${isDark ? 'bg-orange-500 text-stone-950 hover:bg-orange-400' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Get the App
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDark ? 'bg-stone-800 text-amber-400 hover:bg-stone-700' : 'bg-white text-stone-600 shadow-md hover:shadow-lg'}`}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Proper spacing for mobile */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content - Stack properly on mobile */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge - Smaller on mobile */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${isDark ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-white text-orange-600 shadow-md'}`}>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-ping"></span>
                Learning made fun 🎉
              </div>

              {/* Main Heading - Responsive text sizes */}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                Grow Your <br className="hidden sm:block" />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
                    Knowledge
                  </span>
                  {/* Hide underline on very small screens */}
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-orange-400/30 hidden sm:block" viewBox="0 0 200 9" fill="none">
                    <path d="M2.00025 6.99997C25.7509 9.37497 94.2509 9.37497 197.75 2.37497" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                <br className="hidden sm:block" />
                Daily
              </h1>

              {/* Description - Constrained width */}
              <p className={`text-base sm:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Join thousands of curious minds. Create, share, and explore quizzes 
                that make learning <span className="text-orange-500 font-semibold">addictive</span> and 
                <span className="text-amber-500 font-semibold"> rewarding</span>.
              </p>

              {/* Feature Tags - Wrap properly */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                {['Business', 'Education', 'Trivia', 'Research'].map((tag, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default ${isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-white text-stone-700 shadow-sm hover:shadow-md'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Buttons - Stack on mobile, side by side on larger */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
                <a
                  href="/login"
                  className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-shift"></div>
                  <span className="relative flex items-center gap-2">
                    Start Learning Free
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </a>
                
                <a
                  href="/explore"
                  className={`inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-full border-2 transition-all duration-300 hover:scale-105 ${isDark ? 'border-stone-700 text-stone-300 hover:border-orange-500/50 hover:bg-orange-500/10' : 'border-stone-300 text-stone-700 hover:border-orange-400 hover:bg-orange-50'}`}
                >
                  Browse Quizzes
                </a>
              </div>

              {/* Stats Row - Scroll horizontally on small mobile if needed */}
              <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8 border-t transition-colors duration-300 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>50K+</div>
                  <div className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Active Learners</div>
                </div>
                <div className={`hidden sm:block w-px h-10 sm:h-12 transition-colors duration-300 ${isDark ? 'bg-stone-800' : 'bg-stone-200'}`}></div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>100K+</div>
                  <div className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Quizzes</div>
                </div>
                <div className={`hidden sm:block w-px h-10 sm:h-12 transition-colors duration-300 ${isDark ? 'bg-stone-800' : 'bg-stone-200'}`}></div>
                {/* Avatar group - Hidden on very small screens */}
                <div className="hidden sm:flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold ${isDark ? 'border-stone-950 bg-gradient-to-br from-orange-400 to-amber-500' : 'border-white bg-gradient-to-br from-orange-400 to-amber-500'}`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs font-medium ${isDark ? 'border-stone-950 bg-stone-800 text-stone-400' : 'border-white bg-stone-100 text-stone-600'}`}>
                    +2k
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Hidden on mobile, shown on lg */}
            <div className="relative hidden lg:block">
              <div className="relative max-w-md mx-auto">
                {/* Decorative Elements */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400 rounded-full opacity-20 blur-2xl animate-pulse delay-700"></div>

                {/* Main Card */}
                <div className={`relative rounded-3xl p-6 shadow-2xl transition-all duration-500 ${isDark ? 'bg-stone-900/80 border border-stone-800' : 'bg-white border border-stone-100'}`}>
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl">
                        🎯
                      </div>
                      <div>
                        <div className={`font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Daily Challenge</div>
                        <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Business Strategy</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      Live
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Your Progress</span>
                      <span className="font-bold text-orange-500">75%</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
                      <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full relative">
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className={`p-4 rounded-2xl mb-4 transition-colors duration-300 ${isDark ? 'bg-stone-800/50' : 'bg-orange-50/50'}`}>
                    <div className={`text-sm mb-1 transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Question 3 of 5</div>
                    <div className={`font-medium mb-4 transition-colors duration-300 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                      What is the primary objective of Porter's Five Forces analysis?
                    </div>
                    <div className="space-y-2">
                      {['Market segmentation', 'Competitive analysis', 'Reduce costs'].map((opt, idx) => (
                        <button 
                          key={idx}
                          className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 ${idx === 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : isDark ? 'bg-stone-800 text-stone-400 hover:bg-stone-700' : 'bg-white text-stone-600 hover:bg-orange-100'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Streak Badge */}
                  <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors duration-300 ${isDark ? 'border-stone-800 bg-stone-800/30' : 'border-orange-200 bg-orange-50'}`}>
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className={`font-bold transition-colors duration-300 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>5 Day Streak!</div>
                      <div className={`text-xs transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-600'}`}>Keep it up to earn 2x points</div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className={`absolute -bottom-6 -left-6 p-4 rounded-2xl shadow-xl border animate-bounce-slow transition-colors duration-300 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <div className={`font-bold text-sm transition-colors duration-300 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>Correct!</div>
                      <div className={`text-xs transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>+50 points earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Visual - Centered, not overlapping */}
            <div className="lg:hidden flex justify-center pt-8">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-orange-500/20' : 'bg-orange-400/30'}`}></div>
                <img 
                  src="/src/assets/carrot-diet-fruit-svgrepo-com.png" 
                  alt="Hyper Quizes" 
                  className={`relative w-32 h-32 sm:w-40 sm:h-40 animate-float ${isDark ? 'drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'drop-shadow-2xl'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}