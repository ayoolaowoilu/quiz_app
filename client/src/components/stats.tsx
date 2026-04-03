import { useEffect, useRef, useState } from "react";
import { fetchRecents, getUserData } from "../lib/auth";
import { GetQuizesByCreatorId, GetQuizParticipantsHistory} from "../lib/quiz";
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"

import {  CircleQuestionMarkIcon } from "lucide-react";

interface RecentQuiz {
  quiz_id: number;
  quiz_name: string;
  user_id: number;
  score: number;
  passing_score: number;
  time_taken: number;
  date_taken: number;
  creator_id?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  followers: any[] | null;
  following: any[] | null;
  viewed: number[];
  points: number;
}

type QuizType = "TOF" | "MCQ" | "SAQ";
interface Quiz {
  id: number;
  _type: QuizType;
  quiz_name: string;
  creator_id: string;
  material: string;
  saves: number;
  views: number;
  reward: number;
  completed: number;
  passed: number;
  failed: number;
  isOneTime: number;
  isTimed: number;
  duration: number;
  quiz_tags: string[];
  time_posted: string;
  passingScore: string;
  likes: number;
  questions?: any[];
}



export default function Stats() {
  // states
  const [isOtherDataLoading, SetIsOtherDataLoading] = useState(false)
  const [myAttempted, setmyAttempted] = useState<RecentQuiz[]>([])
  const [mySetHistory, setMySetHistory] = useState<RecentQuiz[]>([])
  const [myData, setmyData] = useState<User>()
  const [myQuizData, setMyQuizData] = useState<Quiz[]>([])
  //stage map -> 1:loading 2:display 3:error(Internet)
  const [stages, setStages] = useState<1 | 2 | 3>(1)
 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  
  // Modal states
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })

  const userId = localStorage.getItem("id")
  const displayName = myData?.username ? `@${myData.username}` : `User${userId}`
  const avatarLetter = (myData?.username || `User${userId}`).charAt(0).toUpperCase()
  const isLoggedIn = !!localStorage.getItem("token")

  // Analytics calculations
  const calculateStats = () => {
    const totalAttempted = myAttempted.length
    const totalCreated = myQuizData.length
    const averageScore = totalAttempted > 0 
      ? myAttempted.reduce((acc, q) => acc + ((Number(q.score))  / Number(100)) * 100, 0) / totalAttempted 
      : 0
    const totalParticipants = mySetHistory.length
    const passRate = totalAttempted > 0
      ? (myAttempted.filter(q => Number(q.score) >= Number(q.passing_score)).length / totalAttempted) * 100
      : 0
    
    return { totalAttempted, totalCreated, averageScore: Math.round(averageScore), totalParticipants, passRate: Math.round(passRate) }
  }

  const stats = calculateStats()
  
  // Followers/Following counts
  const followersCount = myData?.followers?.length || 0
  const followingCount = myData?.following?.length || 0

  //fetch functions 
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      const resp = await getUserData(token)
      setmyData(resp)
      setStages(2)
    } catch (error) {
      console.log(error)
      setStages(3)
    }
  }

  const fetchOtherUserData = async () => {
    try {
      SetIsOtherDataLoading(true)
      const id = localStorage.getItem("id")
      const myQuizes = await GetQuizesByCreatorId(Number(id))
      setMyQuizData(myQuizes)
      const attempted = await fetchRecents(Number(id))
      setmyAttempted(attempted)
      const sethistorydatasheet = await GetQuizParticipantsHistory(Number(id))
      console.log(sethistorydatasheet)
      setMySetHistory(sethistorydatasheet)
      SetIsOtherDataLoading(false)
      
    } catch (error) {
      console.log(error)
      SetIsOtherDataLoading(false)
    
      setErrorMessage("Failed to load quiz data. Please check your connection.")
      setErrorModalOpen(true)
    }
  }

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setHistoryModalOpen(true)
  }

  const getQuizSpecificHistory = (quizId: number) => {
    return mySetHistory.filter(h =>Number(h.quiz_id) === quizId)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  //useEffects 
  useEffect(() => {
    if (isLoggedIn) { fetchUserData() } else {
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    if (stages == 2) {
      fetchOtherUserData()
    }
  }, [stages])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
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
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("id")
    window.location.href = "/login"
  }


  // Error Stage
  if (stages == 3) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
        <div className={`max-w-md w-full mx-4 p-8 rounded-3xl border text-center ${isDark ? 'bg-gray-900/80 border-orange-500/20' : 'bg-white border-orange-100'}`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
            <svg className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Connection Error</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Unable to connect to the server. Please check your internet connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  // Loading Stage
  if (stages == 1) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
            <img src={logo} alt="Loading" className="absolute inset-0 m-auto w-10 h-10 animate-bounce" />
          </div>
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Loading your stats...</p>
        </div>
      </div>
    )
  }

  // Main Display Stage
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/30'}`}></div>
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        )}
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? (isDark ? 'bg-black/95 shadow-2xl shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-lg shadow-orange-500/10 border-orange-200') : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')} backdrop-blur-xl`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                  <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Hyper<span className="text-orange-500">Quizzes</span>
                </span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home', active: false },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats', active: true }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${item.active ? 'text-orange-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}
                    {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30 hover:border-orange-500/50' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-orange-300'}`}
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

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border ${isDark ? 'bg-gray-900/80 border-orange-500/30 hover:border-orange-500/60' : 'bg-white border-slate-200 hover:border-orange-300'} ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-slate-500'} ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'} ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{myData?.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <a href="/home" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Dashboard
                      </a>
                      <a href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile Settings
                      </a>
                      <div className={`my-2 border-t ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}></div>
                      <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
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
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-300 border ${isDark ? 'bg-gray-900 text-white border-orange-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className={`lg:hidden py-4 border-t transition-colors duration-300 ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <nav className="flex flex-col gap-2">
                {[
                  { name: 'Home', href: '/home', active: false },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${item.active ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600') : (isDark ? 'text-gray-300 hover:bg-gray-900' : 'text-slate-700 hover:bg-slate-100')}`}
                  >
                    {item.name}
                  </a>
                ))}
                <div className={`mt-4 p-4 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-orange-500/20' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                      <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{myData?.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href="/home" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-orange-500/10' : 'text-slate-700 hover:bg-orange-50'}`}>
                      Dashboard
                    </a>
                    <button
                      onClick={logout}
                      className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="h-16"></div>

      <main className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`mb-8 p-8 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20' : 'bg-gradient-to-br from-orange-100 to-amber-50 border-orange-200'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, <span className="text-orange-500">{myData?.username || 'User'}</span>! 👋
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Here's your learning journey at a glance
            </p>
          </div>
        </div>

        {/* Profile Stats - Followers & Following */}
        <div className={`mb-8 p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-orange-500/20' : 'bg-white border-orange-100'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-orange-500/30">
                {avatarLetter}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{myData?.username || 'User'}</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{myData?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>@{myData?.username || 'user'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    {myData?.points || 0} pts
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="text-center group cursor-pointer">
                <p className={`text-3xl font-bold transition-colors ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                  {followersCount}
                </p>
                <p className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Followers</p>
              </div>
              <div className={`w-px h-12 ${isDark ? 'bg-orange-500/20' : 'bg-orange-200'}`}></div>
              <div className="text-center group cursor-pointer">
                <p className={`text-3xl font-bold transition-colors ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                  {followingCount}
                </p>
                <p className={`text-sm font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              label: 'Quizzes Attempted', 
              value: stats.totalAttempted, 
              icon: '📝',
              color: 'from-blue-500 to-blue-600'
            },
            { 
              label: 'Quizzes Created', 
              value: stats.totalCreated, 
              icon: '🎯',
              color: 'from-orange-500 to-orange-600'
            },
            { 
              label: 'Average Score', 
              value: `${stats.averageScore}%`, 
              icon: '📊',
              color: 'from-green-500 to-green-600'
            },
            { 
              label: 'Total Verified Participants', 
              value: stats.totalParticipants, 
              icon: '👥',
              color: 'from-purple-500 to-purple-600'
            },{
              label:"Pass Rate",
              value: `${stats.passRate}%`,
              icon: '✅',
              color: 'from-teal-500 to-teal-600'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${isDark ? 'bg-gray-900/50 border-orange-500/20 backdrop-blur-sm' : 'bg-white border-orange-100'}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{stat.label}</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Attempted Quizzes */}
          <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-gray-900/30 border-orange-500/20' : 'bg-white border-orange-100'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Attempts</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                  {myAttempted.length} total
                </span>
              </div>
            </div>
            <div className="p-6">
              {isOtherDataLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-20 rounded-xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              ) : myAttempted.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🤔</div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No quizzes attempted yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {myAttempted.slice(0, 10).map((quiz, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${isDark ? 'bg-gray-900/50 border-orange-500/10 hover:border-orange-500/30' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold truncate pr-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{quiz.quiz_name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${Number(quiz.score) >= Number(quiz.passing_score) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {Number(quiz.score) >= Number(quiz.passing_score) ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          Score: <span className={Number(quiz.score) >= Number(quiz.passing_score) ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>{quiz.score}/{quiz.passing_score}</span>
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          Time: {formatTime(quiz.time_taken)}
                        </span>
                        <span className={`${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                          {formatDate(quiz.date_taken)}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-700/30 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${Number(quiz.score) >= Number(quiz.passing_score) ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                          style={{ width: `${Math.min((Number(quiz.score) / Number(quiz.passing_score)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Created Quizzes */}
          <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-gray-900/30 border-orange-500/20' : 'bg-white border-orange-100'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Quizzes</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                  {myQuizData.length} created
                </span>
              </div>
            </div>
            <div className="p-6">
              {isOtherDataLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              ) : myQuizData.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✨</div>
                  <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No quizzes created yet</p>
                  <a
                    href="/create-quiz"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                  >
                    Create Your First Quiz
                  </a>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {myQuizData.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => handleQuizClick(quiz)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 hover:shadow-md group ${isDark ? 'bg-gray-900/50 border-orange-500/10 hover:border-orange-500/30' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold truncate pr-4 group-hover:text-orange-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {quiz.quiz_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                          {quiz._type}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {quiz.material}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          <CircleQuestionMarkIcon className="w-4 h-4" />
                          {quiz.questions?.length || 0} Qs
                        </span>
                        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.completed} completed
                        </span>
                        {/* <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {quiz.likes}
                        </span> */}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quiz History Modal */}
      {historyModalOpen && selectedQuiz && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHistoryModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border shadow-2xl ${isDark ? 'bg-gray-900 border-orange-500/30' : 'bg-white border-orange-200'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedQuiz.quiz_name}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Quiz Performance History</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {(() => {
                const history = getQuizSpecificHistory(selectedQuiz.id)
                if (history.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">📭</div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No participants yet</p>
                    </div>
                  )
                }
                
                const averageScore = history.reduce((acc, h) => acc + h.score, 0) / history.length
                // const bestScore = Math.max(...history.map(h => h.score))
                const passCount = history.filter(h => Number(h.score) >= Number(selectedQuiz.passingScore)).length
                
                return (
                  <div className="space-y-6">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 rounded-2xl text-center ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                        <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{history.length}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Participants</p>
                      </div>
                      <div className={`p-4 rounded-2xl text-center ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                        <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{Math.round(averageScore)}%</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Avg Score</p>
                      </div>
                      <div className={`p-4 rounded-2xl text-center ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                        <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{Math.round((passCount / history.length) * 100)}%</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Pass Rate</p>
                      </div>
                    </div>

                    {/* Participants List */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Top Performers</h4>
                      <div className="space-y-3">
                        {history
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 10)
                          .map((participant, idx) => {
                     
                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-gray-900/50 border-orange-500/10' : 'bg-slate-50 border-slate-200'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-yellow-500 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-orange-600 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-200 text-slate-600'}`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <button
                                     
                                      className={`font-medium transition-all text-white 'blur-sm hover:blur-none cursor-pointer'}`}
                                      onClick={() => alert(`User ID: ${participant.user_id}`)}
                                    >
                                      {"User0" + participant.user_id}
                                    </button>
                                   
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold ${participant.score >= Number(selectedQuiz.passingScore) ? 'text-green-500' : 'text-red-500'}`}>
                                    {participant.score}%
                                  </p>
                                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{formatTime(participant.time_taken)}</p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

    

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setErrorModalOpen(false)}></div>
          <div className={`relative w-full max-w-md p-6 rounded-3xl border ${isDark ? 'bg-gray-900 border-red-500/30' : 'bg-white border-red-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Error</h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setErrorModalOpen(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setErrorModalOpen(false)
                  fetchOtherUserData()
                }}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

  
    </div>
  )
}