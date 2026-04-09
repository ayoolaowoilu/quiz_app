import { useState, useEffect } from 'react';
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import SEO from './seo';

export default function Gen() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const features = [
    {
      icon: '🎯',
      title: 'Create Quizzes',
      desc: 'Build engaging quizzes in minutes with our intuitive creator',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: '🏆',
      title: 'Leaderboards',
      desc: 'Compete with friends and climb the global rankings',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: '📊',
      title: 'Analytics',
      desc: 'Track progress with detailed insights and statistics',
      color: 'from-yellow-500 to-orange-400'
    },
    {
      icon: '🎮',
      title: 'Live Games',
      desc: 'Host real-time quiz competitions with anyone',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: '🎨',
      title: 'Custom Themes',
      desc: 'Personalize your quizzes with beautiful designs',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '🔥',
      title: 'Daily Streaks',
      desc: 'Stay consistent and earn bonus rewards',
      color: 'from-pink-500 to-orange-500'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-stone-950' : 'bg-stone-900'}`}>
      <SEO
        title="Welcome" 
        description="Create and play quizzes, top leaderboards and lots more" 
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 transition-all duration-500 ${isDark ? 'bg-stone-950/80' : 'bg-stone-900/80'} backdrop-blur-md border-b ${isDark ? 'border-stone-800' : 'border-stone-800'}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isDark ? 'bg-orange-500/20' : 'bg-orange-500/20'}`}>
              <img 
                src={logo} 
                alt="Hyper Quizes" 
                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm"
              />
            </div>
            <span className={`text-lg sm:text-xl font-bold tracking-tight text-white`}>
              Hyper<span className="text-orange-500">Quizes</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 bg-orange-500 text-stone-950 hover:bg-orange-400`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Get the App
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 bg-stone-800 text-amber-400 hover:bg-stone-700`}
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

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://thumbs.dreamstime.com/b/abstract-gradient-background-combining-orange-yellow-dark-amber-black-perfect-texture-wallpaper-poster-template-banner-359248881.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-stone-950/70 via-stone-950/50 to-stone-950' : 'from-stone-900/60 via-stone-900/40 to-stone-900'} transition-colors duration-700`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/10 text-orange-300 border-white/20'} animate-pulse-slow`}>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              Learning made fun 🎉
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
              Master Your<br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                  Knowledge
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-orange-500/40" viewBox="0 0 200 9" fill="none">
                  <path d="M2.00025 6.99997C25.7509 9.37497 94.2509 9.37497 197.75 2.37497" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-200'} drop-shadow-lg`}>
              Join <span className="text-orange-400 font-bold">50,000+</span> learners creating, sharing, and exploring quizzes that make learning <span className="text-amber-400 font-semibold">addictive</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-stone-950 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-shift"></div>
                <span className="relative flex items-center gap-2">
                  Start Learning Free
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </span>
              </a>
              
              <a
                href="/explore"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/50"
              >
                Browse Quizzes
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-8">
              {[
                { value: '50K+', label: 'Active Learners' },
                { value: '100K+', label: 'Quizzes' },
                { value: '4.9★', label: 'App Rating' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-300'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={`relative py-20 sm:py-32 ${isDark ? 'bg-stone-950' : 'bg-stone-900'} transition-colors duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-white'}`}>
              Everything You Need to <span className="text-orange-500">Learn</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-stone-400' : 'text-stone-400'}`}>
              Powerful features designed to make your learning journey engaging and effective
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`group relative p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br ' + feature.color + ' shadow-2xl shadow-orange-500/20' 
                    : isDark ? 'bg-stone-900/80 border border-stone-800 hover:border-orange-500/30' : 'bg-stone-800/80 border border-stone-700 hover:border-orange-500/30'
                }`}
              >
                <div className={`text-4xl sm:text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 ${activeFeature === index ? 'text-white' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${activeFeature === index ? 'text-white' : isDark ? 'text-stone-100' : 'text-white'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm sm:text-base ${activeFeature === index ? 'text-white/90' : isDark ? 'text-stone-400' : 'text-stone-400'}`}>
                  {feature.desc}
                </p>
                
                {/* Hover Arrow */}
                <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeFeature === index ? 'bg-white/20' : 'bg-stone-800 group-hover:bg-orange-500/20'}`}>
                  <svg className={`w-5 h-5 transition-colors duration-300 ${activeFeature === index ? 'text-white' : 'text-stone-500 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Active Feature Preview */}
          <div className={`mt-12 p-8 rounded-3xl border ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-800/50 border-stone-700'} backdrop-blur-sm`}>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className={`w-full lg:w-1/2 h-64 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center text-8xl shadow-2xl`}>
                {features[activeFeature].icon}
              </div>
              <div className="w-full lg:w-1/2 space-y-4">
                <h3 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>
                  {features[activeFeature].title}
                </h3>
                <p className={`text-lg ${isDark ? 'text-stone-300' : 'text-stone-300'}`}>
                  {features[activeFeature].desc}. Experience the future of learning with our cutting-edge {features[activeFeature].title.toLowerCase()} feature. Designed for maximum engagement and retention.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-stone-950 font-semibold hover:bg-orange-400 transition-all duration-300 hover:scale-105">
                  Try {features[activeFeature].title}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-100px) translateX(50px); 
            opacity: 0.8;
          }
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
