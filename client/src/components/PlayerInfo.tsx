import { useEffect, useRef, useState } from "react"
import {followUser, unfollowUser, checkIfFollowing } from "../lib/quiz";
import { useSearchParams } from "react-router-dom";
import { getOtherPlayerDataById } from "../lib/auth";
import { GetQuizesByCreatorId } from "../lib/quiz";
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"



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




export default function PlayerInfo(){

    const [playerQuizes , setPlayerQuiz ] = useState<Quiz[]>([])
    const [PlayerData,setPlayerData] = useState<User>()
    //1: player data loading true 2: quiz data loading true 3:no loading 
    const [isLoading,setIsLoading] = useState<1 | 2 | 3>(1)
     const username = localStorage.getItem("username")
       const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
           const [profileOpen, setProfileOpen] = useState(false)
           const [scrolled, setScrolled] = useState(false)
           const profileRef = useRef<HTMLDivElement>(null)
             const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
          const savedTheme = localStorage.getItem('theme');
          return savedTheme === 'dark' || 
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
      })

      setScrolled(window.scrollY > 20)
    
    // Follow state
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const currentUserId = localStorage.getItem("id")

        const userId = localStorage.getItem("id")
      const displayName = username ? `@${username}` : `User${userId}`
      const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
      const isLoggedIn = !!localStorage.getItem("token")
      const email = localStorage.getItem("email")

    const [searchparams] = useSearchParams()
    const  id = searchparams.get("id")
    
    // Check if viewing own profile
    const isOwnProfile = currentUserId === id


    const fetchUserdata = async()=>{
        try {
            setIsLoading(1)
            const resp = await getOtherPlayerDataById(Number(id))
            setPlayerData(resp)
            setIsLoading(3)


        } catch (error) {
            console.log(error)
        }
    }


     const fetchUserQuiz = async()=>{
        try {
            setIsLoading(2)
            const resp = await GetQuizesByCreatorId(Number(id))
            setPlayerQuiz(resp)
            setIsLoading(3)


        } catch (error) {
            console.log(error)
        }
    }
    
    // Check follow status
    const checkFollowStatus = async () => {
        if (!currentUserId || !id || isOwnProfile) return
        try {
            const status = await checkIfFollowing(Number(currentUserId), Number(id))
            setIsFollowing(status)
        } catch (error) {
            console.log(error)
        }
    }
    
    // Handle follow/unfollow
    const handleFollowToggle = async () => {
        if (!currentUserId || !id || followLoading) return
        
        setFollowLoading(true)
        try {
            if (isFollowing) {
                await unfollowUser(Number(currentUserId), Number(id))
                setIsFollowing(false)
                setPlayerData(prev => prev ? {
                    ...prev,
                    followers: prev.followers ? prev.followers.filter(f => f !== Number(currentUserId)) : []
                } : prev)
            } else {
                await followUser(Number(currentUserId), Number(id))
                setIsFollowing(true)
                setPlayerData(prev => prev ? {
                    ...prev,
                    followers: prev.followers ? [...prev.followers, Number(currentUserId)] : [Number(currentUserId)]
                } : prev)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setFollowLoading(false)
        }
    }


    

    



    useEffect(()=>{
      fetchUserdata()

    },[])
    useEffect(()=>{
        fetchUserQuiz()
    },[isLoading])
    
    useEffect(()=>{
        checkFollowStatus()
    },[id, currentUserId])


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
    return (
        <>
                     return (    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/30'}`}></div>
        
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        )}
      </div>

    
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? (isDark ? 'bg-black/95 shadow-2xl shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-lg shadow-orange-500/10 border-orange-200') : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')} backdrop-blur-xl`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home', active: false },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' , active:true }
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
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{email || 'No email'}</p>
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

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
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
                      <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{email || 'No email'}</p>
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


      <main className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Section */}
        <div className={`rounded-3xl border backdrop-blur-xl p-8 mb-8 transition-all duration-500 ${isDark ? 'bg-black/40 border-orange-500/20' : 'bg-white/80 border-orange-200'}`}>
          {isLoading === 1 ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : PlayerData ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-orange-500/30">
                  {(PlayerData.username || `User${PlayerData.id}`).charAt(0).toUpperCase()}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${isDark ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-orange-100 border-orange-200 text-orange-600'}`}>
                  {PlayerData.points?.toLocaleString() || 0} pts
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {PlayerData.username ? `@${PlayerData.username}` : `User${PlayerData.id}`}
                </h1>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {PlayerData.email || 'No email provided'}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {PlayerData.followers?.length || 0}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {PlayerData.following?.length || 0}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>following</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {playerQuizes.length}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>quizzes</span>
                  </div>
                </div>
              </div>
              
              {/* Follow Button - Professional & Small */}
              {!isOwnProfile && isLoggedIn && (
                <div className="sm:ml-auto">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`
                      group relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold
                      transition-all duration-300 ease-out transform
                      ${isFollowing 
                        ? (isDark 
                            ? 'bg-transparent border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500' 
                            : 'bg-transparent border border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400')
                        : (isDark 
                            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border border-transparent hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-transparent hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105')
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      active:scale-95
                    `}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {followLoading ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : isFollowing ? (
                        <>
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="group-hover:hidden">Following</span>
                          <span className="hidden group-hover:inline">Unfollow</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Follow
                        </>
                      )}
                    </span>
                    
                    {/* Hover glow effect */}
                    {!isFollowing && (
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              User not found
            </div>
          )}
        </div>
        
        {/* Quizzes Grid Section */}
        {isLoading === 2 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : playerQuizes.length > 0 ? (
          <div>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Created Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerQuizes.map((quiz) => (
                <a
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className={`
                    group relative rounded-2xl p-6 border backdrop-blur-sm
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                    ${isDark 
                      ? 'bg-black/30 border-orange-500/20 hover:border-orange-500/40 hover:shadow-orange-500/10' 
                      : 'bg-white/60 border-orange-100 hover:border-orange-300 hover:shadow-orange-500/10'
                    }
                  `}
                >
                  {/* Quiz Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${quiz._type === 'MCQ' 
                        ? (isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600 border border-blue-200')
                        : quiz._type === 'TOF'
                        ? (isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-purple-600 border border-purple-200')
                        : (isDark ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-600 border border-green-200')
                      }
                    `}>
                      {quiz._type}
                    </span>
                    {quiz.isTimed === 1 && (
                      <span className={`
                        flex items-center gap-1 text-xs
                        ${isDark ? 'text-orange-400' : 'text-orange-600'}
                      `}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {quiz.duration}m
                      </span>
                    )}
                  </div>
                  
                  {/* Quiz Title */}
                  <h3 className={`
                    text-lg font-bold mb-2 line-clamp-2
                    ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}
                    transition-colors duration-300
                  `}>
                    {quiz.quiz_name}
                  </h3>
                  
                  {/* Quiz Stats */}
                  <div className="flex items-center gap-4 text-sm mt-4">
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      {quiz.views || 0}
                    </div>
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      {quiz.likes || 0}
                    </div>
                    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      {quiz.saves || 0}
                    </div>
                  </div>
                  
                  {/* Reward Badge */}
                  {quiz.reward > 0 && (
                    <div className={`
                      absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-bold
                      ${isDark ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}
                    `}>
                      +{quiz.reward} pts
                    </div>
                  )}
                  
                  {/* Arrow indicator */}
                  <div className={`
                    absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                    transition-all duration-300 transform translate-x-2 group-hover:translate-x-0
                    ${isDark ? 'text-orange-400' : 'text-orange-600'}
                  `}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className={`
            rounded-2xl border backdrop-blur-sm p-12 text-center
            ${isDark ? 'bg-black/30 border-orange-500/20' : 'bg-white/60 border-orange-100'}
          `}>
            <div className={`
              w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
              ${isDark ? 'bg-orange-500/10' : 'bg-orange-100'}
            `}>
              <svg className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No quizzes yet
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              This user hasn't created any quizzes yet.
            </p>
          </div>
        )}
      </main>
      
 
      
      </div>
      )
         </>
    )
}