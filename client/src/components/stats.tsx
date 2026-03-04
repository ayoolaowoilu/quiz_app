import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect, useRef } from "react"
import { fetchRecents, getUserData } from "../lib/auth";

interface User {
  id: number;
  username: string;
  email: string;
  followers: any[] | null;
  following: any[] | null;
  viewed: number[];
  points: number;
}

interface RecentQuiz {
  quiz_id: number;
  quiz_name: string;
  user_id: number;
  score: number;
  passing_score: number;
  time_taken: number;
  date_taken: number;
}

export default function Stats() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const username = localStorage.getItem("username")
  const email = localStorage.getItem("email")
  const userId = localStorage.getItem("id")
  const displayName = username ? `@${username}` : `User${userId}`
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
  const isLoggedIn = !!localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const userdata = await getUserData(token);
        const id = localStorage.getItem("id")
        const recents = await fetchRecents(Number(id));

        setUser(userdata)
        setRecentQuizzes(recents)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  const getRelativeTime = (dateInput: string | number) => {
    const date = typeof dateInput === 'number' ? new Date(dateInput) : new Date(dateInput)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (isNaN(date.getTime())) return "Invalid date"
    if (diffInSeconds < 60) return "just now"
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths}mo ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

 
  const avgScore = recentQuizzes.length > 0 
    ? Math.round(recentQuizzes.reduce((acc, q) => Number(acc) + Number(q.score), 0) / recentQuizzes.length)
    : 0


  const passedQuizzes = recentQuizzes.filter(q => Number(q.score) >= Number(q.passing_score))
  const passRate = recentQuizzes.length > 0 
    ? Math.round((passedQuizzes.length / recentQuizzes.length) *100)
    : 0

  const totalQuizzes = recentQuizzes.length
  const totalPassed = passedQuizzes.length

  const achievements = [
    { id: 1, name: "Speed Demon", desc: "Complete under 3 min", icon: "⚡", unlocked: recentQuizzes.some(q => q.time_taken < 180), rarity: "legendary" },
    { id: 2, name: "Perfectionist", desc: "100% score", icon: "💎", unlocked: recentQuizzes.some(q => q.score === 100), rarity: "epic" },
    { id: 3, name: "Quiz Warrior", desc: "10 quizzes", icon: "🗡️", unlocked: totalQuizzes >= 10, rarity: "rare" },
    { id: 4, name: "Socialite", desc: "50 followers", icon: "👥", unlocked: (user?.followers?.length || 0) >= 50, rarity: "rare" },
    { id: 5, name: "Point Hoarder", desc: "5000 points", icon: "🏆", unlocked: (user?.points || 0) >= 5000, rarity: "epic" },
    { id: 6, name: "Streak Master", desc: "30 day streak", icon: "🔥", unlocked: false, rarity: "legendary" },
  ]

  const calculateRank = () => {
    const points = user?.points || 0
    if (points >= 5000) return { title: "Grandmaster", color: "from-orange-400 via-amber-500 to-yellow-500", icon: "👑" }
    if (points >= 3000) return { title: "Expert", color: "from-orange-500 to-red-500", icon: "🎯" }
    if (points >= 1500) return { title: "Advanced", color: "from-orange-400 to-orange-600", icon: "⭐" }
    return { title: "Beginner", color: "from-orange-300 to-orange-500", icon: "🌱" }
  }

  const rank = calculateRank()

  
  const performanceData = recentQuizzes.map(q => Number(q.score)).reverse()
  while (performanceData.length < 10) {
    performanceData.push(Math.floor(Math.random() * 30) + 70)
  }

  if (!isLoggedIn) {
    window.location.href = "/login"
    return null
  }

  document.title = "Stats | Hyper Quizzes"

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-orange-100'}`}>
   
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/40'}`}></div>
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/40'}`}></div>
        {isDark && <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>}
      </div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? (isDark ? 'bg-black/95 shadow-2xl shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-lg shadow-orange-500/10 border-orange-200') : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')} backdrop-blur-xl`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hyper<span className="text-orange-500">Quizzes</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home', key: 'home' },
                  { name: 'Join Quiz', href: '/join-quiz', key: 'join' },
                  { name: 'Create Quiz', href: '/create-quiz', key: 'create' },
                  { name: 'Stats', href: '/stats', active: true, key: 'stats' }
                ].map((item) => (
                  <a 
                    key={item.key} 
                    href={item.href} 
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${item.active ? 'text-orange-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}
                    {item.active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button 
                  key="theme-toggle"
                  onClick={toggleTheme} 
                  className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  )}
                </button>

                <div className="relative" ref={profileRef}>
                  <button 
                    key="profile-btn"
                    onClick={() => setProfileOpen(!profileOpen)} 
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border ${isDark ? 'bg-gray-900/80 border-orange-500/30' : 'bg-white border-slate-200'} ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-slate-500'} ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${profileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <a 
                        key="dropdown-dashboard"
                        href="/home" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Dashboard
                      </a>
                      <a 
                        key="dropdown-profile"
                        href="/profile" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Profile Settings
                      </a>
                      <div className={`my-2 border-t ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}></div>
                      <button 
                        key="dropdown-logout"
                        onClick={logout} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button 
                key="mobile-theme"
                onClick={toggleTheme} 
                className={`p-2 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                )}
              </button>
              <button 
                key="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`p-2 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-white border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t transition-colors duration-300 ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <nav className="flex flex-col gap-2">
                {[
                  { name: 'Home', href: '/home', key: 'm-home' },
                  { name: 'Join Quiz', href: '/join-quiz', key: 'm-join' },
                  { name: 'Create Quiz', href: '/create-quiz', key: 'm-create' },
                  { name: 'Stats', href: '/stats', active: true, key: 'm-stats' }
                ].map((item) => (
                  <a 
                    key={item.key} 
                    href={item.href} 
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${item.active ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600') : (isDark ? 'text-gray-300 hover:bg-gray-900' : 'text-slate-700 hover:bg-slate-100')}`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="h-16"></div>

   
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-orange-300/30 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            

            <div className="grid lg:grid-cols-3 gap-6">

              <div className={`lg:col-span-1 rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-orange-600/20 to-black border-orange-500/30' : 'bg-gradient-to-br from-orange-100 to-white border-orange-200'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-orange-500/40 ring-4 ring-orange-500/30">
                      {avatarLetter}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 shadow-lg ${isDark ? 'bg-black border-orange-500' : 'bg-white border-orange-500'}`}>
                      {rank.icon}
                    </div>
                  </div>
                  
                  <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.username}</h2>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user?.email}</p>
                  
                  <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black bg-gradient-to-r ${rank.color} text-white shadow-lg uppercase tracking-wider`}>
                    {rank.title}
                  </div>

                  <div className={`grid grid-cols-3 gap-6 mt-8 pt-6 w-full border-t ${isDark ? 'border-orange-500/30' : 'border-orange-200'}`}>
                    <div key="stat-followers" className="text-center">
                      <p className={`text-2xl font-black ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.followers?.length || 0}</p>
                      <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Followers</p>
                    </div>
                    <div key="stat-following" className="text-center">
                      <p className={`text-2xl font-black ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.following?.length || 0}</p>
                      <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Following</p>
                    </div>
                    <div key="stat-viewed" className="text-center">
                      <p className={`text-2xl font-black ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.viewed?.length || 0}</p>
                      <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Viewed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Stats Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {/* Big Points Card */}
                <div className={`col-span-2 rounded-3xl p-6 border backdrop-blur-sm relative overflow-hidden ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
                  <div className="relative">
                    <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Total Points</p>
                    <div className="flex items-end gap-4">
                      <p className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.points?.toLocaleString()}</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold mb-2 ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        +productivity this week
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}>
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${Math.min((user?.points || 0) / 5000 * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{5000 - (user?.points || 0)} points to next rank</p>
                  </div>
                </div>

                {/* Quiz Count */}
                <div className={`rounded-3xl p-6 border backdrop-blur-sm ${isDark ? 'bg-black/40 border-orange-500/10' : 'bg-white border-orange-100'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <p className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Quizzes</p>
                  </div>
                  <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalQuizzes}</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{totalPassed} passed</p>
                </div>

                {/* Average Score */}
                <div className={`rounded-3xl p-6 border backdrop-blur-sm ${isDark ? 'bg-black/40 border-orange-500/10' : 'bg-white border-orange-100'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <p className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Avg Score</p>
                  </div>
                  <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgScore}%</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{passRate}% pass rate</p>
                </div>
              </div>
            </div>

            
            <div className="grid lg:grid-cols-4 gap-6">
            
              <div className={`lg:col-span-1 rounded-3xl p-6 border backdrop-blur-sm ${isDark ? 'bg-black/40 border-orange-500/10' : 'bg-white border-orange-100'}`}>
                <h3 className={`font-bold mb-4 uppercase tracking-wide text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Quick Actions</h3>
                <div className="space-y-3">
                  <a 
                    key="action-join"
                    href="/join-quiz" 
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-bold ${isDark ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Join Quiz
                  </a>
                  <a 
                    key="action-create"
                    href="/create-quiz" 
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-bold ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border border-orange-500/30' : 'bg-white hover:bg-gray-50 text-slate-900 border border-orange-200 shadow-md'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Create Quiz
                  </a>
                  <a 
                    key="action-settings"
                    href="/profile" 
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-bold ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Settings
                  </a>
                </div>
              </div>

          
              <div className={`lg:col-span-3 rounded-3xl p-6 border backdrop-blur-sm ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-black uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Achievements <span className={`text-sm font-normal normal-case ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={`achievement-${achievement.id}`} 
                      className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-300 cursor-pointer ${achievement.unlocked 
                        ? `${isDark ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/10 border-orange-500 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20'}` 
                        : `${isDark ? 'bg-black/40 border-gray-800 grayscale opacity-40' : 'bg-gray-100 border-gray-200 grayscale opacity-40'}`}`}
                    >
                      <span className="text-4xl mb-2 filter drop-shadow-lg transform group-hover:scale-110 transition-transform">{achievement.icon}</span>
                      <p className={`text-xs font-black text-center leading-tight uppercase tracking-wide ${achievement.unlocked ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-600' : 'text-gray-400')}`}>
                        {achievement.name}
                      </p>
                      
                    
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 ${isDark ? 'bg-gray-900 text-white border border-orange-500/30' : 'bg-slate-900 text-white'}`}>
                        <p className="font-bold">{achievement.name}</p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-300'}`}>{achievement.desc}</p>
                        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${isDark ? 'border-t-gray-900' : 'border-t-slate-900'}`}></div>
                      </div>

                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

           
            <div className={`rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className={`text-2xl font-black uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Quiz History</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Your recent quiz attempts</p>
                </div>
              </div>

              {recentQuizzes.length === 0 ? (
                <div className="text-center py-16">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                    <svg className={`w-10 h-10 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No quizzes yet</h4>
                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Start taking quizzes to see your progress here!</p>
                  <a 
                    key="empty-cta"
                    href="/join-quiz" 
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'}`}
                  >
                    Join Your First Quiz
                  </a>
                </div>
              ) : (
             <div className="grid gap-4">
  {recentQuizzes.reverse().map((quiz, index) => {
    const isPassed = Number(quiz.score) >= Number(quiz.passing_score)

    
    return (
      <div 
        key={index}
        className={`group relative overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 hover:border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50/80 border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Background Gradient Blob */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-30 ${
          isPassed ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />
        
        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            
            {/* Left: Status Icon & Rank */}
            <div className="flex items-center gap-4">
              <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 ${
                isPassed 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30' 
                  : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30'
              }`}>
                {isPassed ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${ isDark ? "text-white" : "text-black"} shadow-md ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {index + 1}
                </div>
              </div>
              
              {/* Quick Stats Mobile */}
              <div className="lg:hidden flex-1">
                <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {quiz.quiz_name}
                </h3>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getRelativeTime(Number(quiz.date_taken))}
                </span>
              </div>
            </div>

            {/* Center: Quiz Info */}
            <div className="flex-1 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {quiz.quiz_name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getRelativeTime(Number(quiz.date_taken))}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">{formatDuration(quiz.time_taken)}</span>
                </div>
                
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Pass: {quiz.passing_score}%</span>
                </div>

                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Score: {quiz.score}%</span>
                </div>
              </div>
            </div>

            {/* Right: Score Display */}
            <div className="flex items-center gap-6">
              {/* Score Badge */}
              <div className="text-center">
                <div className={`text-4xl font-black tracking-tight ${
                  isPassed 
                    ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                    : (isDark ? 'text-rose-400' : 'text-rose-600')
                }`}>
                  {quiz.score}
                  <span className="text-lg ml-0.5">%</span>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                  isPassed 
                    ? (isDark ? 'text-emerald-500/80' : 'text-emerald-600/80')
                    : (isDark ? 'text-rose-500/80' : 'text-rose-600/80')
                }`}>
                  {isPassed ? 'Excellent' : 'Try Again'}
                </div>
              </div>

              {/* Animated Progress Ring */}
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className={isDark ? 'text-gray-800' : 'text-gray-200'}
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * quiz.score) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${
                      isPassed ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isPassed ? (
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  isPassed 
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300' 
                    : 'bg-gradient-to-r from-rose-500 via-rose-400 to-orange-400'
                }`}
                style={{ width: `${quiz.score}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium">
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>0%</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Pass: {quiz.passing_score}%</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>100%</span>
            </div>
          </div>
        </div>
      </div>
    )
  })}
</div>
              )}
            </div>

         
           <div className={`rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-black/40 border-orange-500/10' : 'bg-white border-orange-100'}`}>
  <h3 className={`text-xl font-black uppercase tracking-wide mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
    Performance Trend
  </h3>
  

  {!performanceData || performanceData.length === 0 ? (
    <div className={`h-56 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-900/50' : 'bg-slate-50'}`}>
      <span className="text-gray-500">No data available</span>
    </div>
  ) : (
    <div className={`h-56 rounded-2xl flex items-end justify-between gap-1 p-4 ${isDark ? 'bg-gray-900/50' : 'bg-slate-50'}`}>
      {performanceData.map((score, i) => {
        
        const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);
        
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded transition-opacity z-10 whitespace-nowrap">
              {safeScore}%
            </div>
            
            {/* Bar */}
            <div 
              className={`w-full min-h-[4px] rounded-t-lg transition-all duration-500 ease-out group-hover:brightness-110 ${safeScore >= 80 ? 'bg-gradient-to-t from-orange-500 to-amber-400' : safeScore >= 60 ? 'bg-gradient-to-t from-orange-400 to-orange-300' : 'bg-gradient-to-t from-slate-500 to-slate-400'}`}
              style={{ height: `${safeScore}%` }}
            />
          </div>
        );
      })}
    </div>
  )}
  
  <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-wide text-gray-500">
    <span>Oldest</span>
    <span>Recent</span>
  </div>
</div>

          </div>
        )}
      </main>

      <footer className={`relative z-10 border-t mt-12 transition-colors duration-500 ${isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100'}`}>
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
              </div>
              <div>
                <span className={`font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Hyper<span className="text-orange-500">Quizzes</span>
                </span>
                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>© 2024 All rights reserved.</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['About', 'Privacy', 'Terms', 'Contact'].map((link) => (
                <a 
                  key={`footer-${link}`} 
                  href={`/${link.toLowerCase()}`} 
                  className={`transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-slate-600 hover:text-orange-600'}`}
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {[
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84', key: 'twitter' },
                { name: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z', key: 'github' }
              ].map((social) => (
                <a 
                  key={social.key} 
                  href="#" 
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 border ${isDark ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border-orange-500/20' : 'text-slate-600 hover:text-orange-500 hover:bg-orange-50 border-slate-200'}`}
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}