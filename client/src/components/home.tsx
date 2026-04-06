import world from "../assets/world-1-svgrepo-com.svg"
import create from "../assets/plus-svgrepo-com.svg"
import join from "../assets/link-svgrepo-com.svg"
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { logoutAuth } from "../lib/auth"
import { Book } from "lucide-react"

export default function Home() {
  const navigate = useNavigate()
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const appDropdownRef = useRef<HTMLDivElement>(null);

 
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("id");
  const displayName = username ? `@${username}` : `User${userId}`;
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase();

  useEffect(() => {
    document.title = "Home | Hyper Quizes"
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (appDropdownRef.current && !appDropdownRef.current.contains(event.target as Node)) {
        setAppDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  },[isDark]);

  const logout = () => {
   logoutAuth("Web")
  };

  const handleGetApp = () => {
    if (isMobile) {
      window.location.href = "/download/hyperquizzes.apk"
    } else {
      setAppDropdownOpen(!appDropdownOpen)
    }
  };

  const cards = useMemo(()=>{
     return [
    {
      title: "Join Quiz",
      info: "Enter a token to join live quiz rooms instantly",
      path: "/join-quiz",
      img: join,
      color: "from-orange-600 via-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      iconBg: "bg-orange-500"
    },
    {
      title: "Create Quiz",
      info: "Build engaging quizzes for your audience",
      path: "/create-quiz",
      img: create,
      color: "from-amber-500 via-yellow-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      iconBg: "bg-amber-500"
    },
    {
      title: "Explore",
      info: "Discover public quizzes on various topics",
      path: "/explore",
      img: world,
      color: "from-yellow-500 via-orange-500 to-amber-500",
      bgColor: "bg-yellow-500/10",

      iconBg: "bg-yellow-500"
    }
  ]
  },[]);



  const categories = [
    { name: 'Science', count: 1240, icon: '🧬', color: 'from-blue-500 to-cyan-400' },
    { name: 'History', count: 856, icon: '🏛️', color: 'from-amber-600 to-yellow-500' },
    { name: 'Tech', count: 2341, icon: '💻', color: 'from-purple-500 to-pink-500' },
    { name: 'Sports', count: 567, icon: '⚽', color: 'from-green-500 to-emerald-400' },
    { name: 'Arts', count: 423, icon: '🎨', color: 'from-rose-500 to-orange-400' },
    { name: 'Geography', count: 892, icon: '🌍', color: 'from-teal-500 to-cyan-400' },
  ];

  const QRCodeSVG = useCallback(() => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect width="200" height="200" fill="white"/>
      <g fill="black">
        <rect x="10" y="10" width="50" height="50" fill="black"/>
        <rect x="20" y="20" width="30" height="30" fill="white"/>
        <rect x="25" y="25" width="20" height="20" fill="black"/>
        
        <rect x="140" y="10" width="50" height="50" fill="black"/>
        <rect x="150" y="20" width="30" height="30" fill="white"/>
        <rect x="155" y="25" width="20" height="20" fill="black"/>
        
        <rect x="10" y="140" width="50" height="50" fill="black"/>
        <rect x="20" y="150" width="30" height="30" fill="white"/>
        <rect x="25" y="155" width="20" height="20" fill="black"/>
        
        {Array.from({ length: 20 }).map((_, i) => (
          Array.from({ length: 20 }).map((_, j) => {
            if (Math.random() > 0.5 && 
                !((i < 3 && j < 3) || (i > 16 && j < 3) || (i < 3 && j > 16))) {
              return <rect key={`${i}-${j}`} x={10 + i * 9} y={10 + j * 9} width="7" height="7" fill="black"/>
            }
            return null
          })
        ))}
      </g>
      <circle cx="100" cy="100" r="15" fill="white"/>
      <circle cx="100" cy="100" r="10" fill="#f97316"/>
    </svg>
  ),[]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
     
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/30'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] ${isDark ? 'bg-orange-600/5' : 'bg-orange-200/20'}`}></div>
        
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        )}
      </div>

      {/* Compact Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? (isDark ? 'bg-black/95 shadow-lg shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-md shadow-orange-500/10 border-orange-200') : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')} backdrop-blur-xl`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg transition-all duration-300 border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-6 h-6" />
              </div>
              <span className={`text-lg font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hyper<span className="text-orange-500">Quizzes</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1">
                {[
                  { name: 'Home', href: '/home', active: true },
                  { name: 'Join', href: '/join-quiz' },
                  { name: 'Create', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 relative py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${item.active ? 'text-orange-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}

                      {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <div className="relative" ref={appDropdownRef}>
                  <button
                    onClick={handleGetApp}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    App
                    {!isMobile && (
                      <svg className={`w-3 h-3 transition-transform duration-300 ${appDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    )}
                  </button>

                  {!isMobile && appDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border transition-all duration-300 transform origin-top-right animate-fade-in ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                      <div className="p-4">
                        <div className="text-center mb-3">
                          <h3 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Get HyperQuizzes</h3>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Android App</p>
                        </div>
                        <div className={`w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 p-1.5 ${isDark ? 'border-orange-500/30 bg-white' : 'border-orange-200 bg-white'}`}>
                          <QRCodeSVG />
                        </div>
                        <a 
                          href="/download/hyperquizzes.apk" 
                          download
                          className={`mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'}`}
                        >
                          Download APK
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                >
                  {isDark ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  )}
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg transition-all duration-300 border ${isDark ? 'bg-gray-900/80 border-orange-500/30 hover:border-orange-500/60' : 'bg-white border-slate-200 hover:border-orange-300'} ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <svg className={`w-3 h-3 transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-slate-500'} ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border transition-all duration-300 transform origin-top-right ${profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'} ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                    <div className={`p-3 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {displayName}
                          </p>
                          <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            {email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <a href="/profile" className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile
                      </a>
                      <a href="/stats" className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        Stats
                      </a>
                      <div className={`my-1.5 border-t ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}></div>
                      <button
                        onClick={logout}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={handleGetApp}
                className={`p-1.5 rounded-lg transition-all duration-300 border ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border-orange-500/30' : 'bg-slate-900 text-white border-slate-200'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-white border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden py-3 border-t transition-colors duration-300 ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <nav className="flex flex-col gap-1">
                {[
                  { name: 'Home', href: '/home', active: true },
                  { name: 'Explore', href: '/explore' },
                  { name: 'Create', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${item.active ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600') : (isDark ? 'text-gray-300 ' : 'text-slate-700 ')}`}
                  >
                    {item.name}
                  </a>
                ))}
                <div className={`mt-3 p-3 rounded-xl border ${isDark ? 'bg-gray-900/50 border-orange-500/20' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                      <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{email || 'No email'}</p>
                    </div>
                  </div>
                  <button onClick={logout} className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}>
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="h-14"></div>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 lg:py-12">
        
        {/* Welcome Section - Compact */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl lg:text-5xl font-black mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">quiz?</span>
          </h1>
          <p className={`text-sm lg:text-base max-w-xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Join, create, or explore quizzes instantly
          </p>
        </div>

        {/* Quick Action Cards - Horizontal Layout */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.path}
              className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark ? 'bg-black/60 border border-orange-500/20 hover:border-orange-500/40' : 'bg-white border border-orange-100'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${card.bgColor} border ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                <img src={card.img} alt={card.title} className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`text-base font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {card.title}
                  </h3>
                
                </div>
                <p className={`text-xs leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {card.info}
                </p>
              </div>
              <svg className="w-5 h-5 text-orange-500 transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </a>
          ))}
        </div>

        {/* Stats Bar */}
        <div className={`mb-10 rounded-xl p-4 border transition-colors duration-500 ${isDark ? 'bg-black/50 border-orange-500/20' : 'bg-white/70 border-orange-100'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '10K+', label: 'Quizzes' },
              { value: '50K+', label: 'Users' },
              { value: '100K+', label: 'Questions' },
              { value: '99%', label: 'Rating' }
            ].map((stat, idx) => (
              <div key={idx} className={idx !== 3 ? `border-r ${isDark ? 'border-orange-500/20' : 'border-orange-100'}` : ''}>
                <div className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-orange-400 to-amber-400' : 'from-orange-600 to-amber-600'}`}>{stat.value}</div>
                <div className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-slate-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Categories & Recent */}
          <div className="lg:col-span-2 space-y-6">
                  <section className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-gradient-to-br from-purple-100 to-pink-50 border-purple-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏆</span>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Challenge</h3>
              </div>
              <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Complete today's quiz to earn 2x points!</p>
              <button onClick={()=>window.location.href = "/daily"} className={`w-full py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300`}>
                Start Challenge
              </button>
            </section>
            {/* Categories Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Categories</h2>
                <a href="/categories" className="text-xs text-orange-500 hover:text-orange-600 font-medium">View all</a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat, idx) => (
                  <a
                    key={idx}
                    href={`/category?category=${cat.name.toLowerCase()}`}
                    className={`group p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${isDark ? 'bg-black/40 border-orange-500/20 hover:border-orange-500/40' : 'bg-white border-orange-100 hover:border-orange-300'}`}
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.name}</h3>
            
                    <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </a>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
           
          </div>

          {/* Right Column - Trending & Quick Join */}
          <div className="space-y-6">
            
       
   <div className="rounded-sm p-4 text-center bg-white/50 text-black shadow-xl">
        <p className="text-center flex justify-center space-x-2">
             
            <Book />  Review your stats today <Book />
        </p>
        <small className="text-gray-300 my-4">View people who took your quiz</small>

        <button onClick={()=>{window.location.href = "/stats"}} className="p-2 mt-6 w-full bg-blue-700 text-white rounded-sm ">Review Stats</button>

   </div>
            {/* Daily Challenge */}
        
          </div>
        </div>

      

      </main>

      {/* Compact Footer */}
      <footer className={`relative z-10 border-t mt-12 transition-colors duration-500 ${isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100'}`}>
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-5 h-5" />
              </div>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hyper<span className="text-orange-500">Quizzes</span>
              </span>
            </div>
            <div className="flex gap-6 text-xs">
              {['About', 'Privacy', 'Terms', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className={`transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-slate-600 hover:text-orange-600'}`}
                >
                  {link}
                </a>
              ))}
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>© 2024 HyperQuizzes</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};