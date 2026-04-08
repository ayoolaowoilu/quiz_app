import { useEffect, useRef, useState } from "react"
import {followUser} from "../lib/quiz";
import { useSearchParams } from "react-router-dom";
import { getOtherPlayerDataById, getUserData } from "../lib/auth";
import { GetQuizesByCreatorId } from "../lib/quiz";
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { CircleQuestionMark, UsersRoundIcon } from "lucide-react";
import SEO from "./seo";



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

      
    
    // Follow state
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const [userFollowsyou,setUserFollowsYou] = useState(false)
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
            const token = localStorage.getItem("token")
            await getUserData(token)
      const idd= localStorage.getItem("id")
        console.log(resp)
            resp.followers?.find(((foid:any) => foid == idd)) && setIsFollowing(true)
            resp.following?.find(((foid:any) => foid == idd)) && setUserFollowsYou(true)

           
            setPlayerData(resp)
            setIsLoading(2)


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
  
    
    // Handle follow/unfollow
    const handleFollowToggle = async () => {
        if (!currentUserId || !id || followLoading) return
        
        setFollowLoading(true)
        if(isFollowing) return
        try {
          
                await followUser(Number(currentUserId), Number(id))
                setIsFollowing(true)
                setPlayerData(prev => prev ? {
                    ...prev,
                    followers: prev.followers ? [...prev.followers, Number(currentUserId)] : [Number(currentUserId)]
                } : prev)

              
            
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
        if(isLoading == 2){
             fetchUserQuiz()
        }
    },[isLoading])
    

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

  
    return (
        <>
         <SEO
        title={PlayerData?.username as string || "Player Info"} 
        description={PlayerData !== null ? `Followers ${PlayerData?.followers?.length}` : `Player info`} 
      />
                       <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      {/* Subtle Background - Professional & Mature */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/3 rounded-full blur-[100px]"></div>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]"></div>
          </>
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


      <main className="relative z-10 mx-auto max-w-3xl px-0 sm:px-4 py-4">
        {/* Compact Profile Header - TikTok Style */}
        <div className={`px-4 py-5 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
          {isLoading === 1 ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : PlayerData ? (
            <div className="flex items-center gap-4">
              {/* Compact Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {(PlayerData.username || `User${PlayerData.id}`).charAt(0).toUpperCase()}
                </div>
                {Number(PlayerData.points) > 0 && (
                  <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${isDark ? 'bg-orange-500 text-white border-orange-400' : 'bg-orange-500 text-white border-white'}`}>
                    {PlayerData.points?.toLocaleString()}
                  </div>
                )}
              </div>
              
              {/* Compact User Info */}
              <div className="flex-1 min-w-0">
                <h1 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {PlayerData.username || `User${PlayerData.id}`}
                </h1>
                <p className={`text-xs mb-2 truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {PlayerData.email || 'No email provided'}
                </p>
                
                {/* Compact Stats */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {PlayerData.followers?.length || 0}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-slate-400'}>Followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {PlayerData.following?.length || 0}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-slate-400'}>Following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {playerQuizes.length}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-slate-400'}>Quizzes</span>
                  </div>

                   
                    {userFollowsyou && (
      <span className={`
        px-2 py-0.5 rounded-full text-[10px] font-medium
        ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200'}
      `}>
        Follows You
      </span>
    )}
             
                </div>

              </div>
              
              {/* Compact Follow Button */}
              {!isOwnProfile && isLoggedIn && (
                <div className="flex-shrink-0">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`
                      px-5 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 active:scale-95
                      ${isFollowing 
                        ? (isDark 
                            ? 'bg-transparent border border-white/30 text-white hover:border-white/60' 
                            : 'bg-transparent border border-slate-300 text-slate-700 hover:border-slate-400')
                        : (isDark 
                            ? 'bg-white text-black hover:bg-white/90' 
                            : 'bg-slate-900 text-white hover:bg-slate-800')
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {followLoading ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    ) : isFollowing ? (
                      'Following'
                    ) : (
                      'Follow'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              User not found
            </div>
          )}
        </div>
        
       {isLoading === 2 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : playerQuizes.length > 0 ? (
          <div className="px-2 py-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Created Quizzes
              </h2>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {playerQuizes.length} total
              </span>
            </div>
            
            {/* Grid Container - 2 cols mobile, 2 cols sm, 3 cols lg */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {playerQuizes.map((quiz, index) => (
                <a
                  key={quiz.id}
                  href={`/join-quiz?id=${quiz.id}`}
                  className={`
                    group relative flex flex-col
                    rounded-xl sm:rounded-2xl overflow-hidden
                    transition-all duration-300 ease-out
                    hover:scale-[1.02] hover:-translate-y-1
                    ${isDark 
                      ? 'bg-white/[0.03] border border-white/10 hover:border-orange-500/30 hover:bg-white/[0.05]' 
                      : 'bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header - Color coded by type */}
                  <div className={`
                    h-1.5 sm:h-2 w-full
                    ${quiz._type === 'MCQ' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : quiz._type === 'TOF'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    }
                  `}></div>
                  
                  {/* Card Content */}
                  <div className="p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3">
                    {/* Top Row: Type Badge & Reward */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`
                        px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-bold uppercase tracking-wider
                        ${quiz._type === 'MCQ' 
                          ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                          : quiz._type === 'TOF'
                          ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700')
                          : (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                        }
                      `}>
                        {quiz._type}
                      </span>
                      
                      {quiz.reward > 0 && (
                        <span className={`
                          flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-bold
                          ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}
                        `}>
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          +{quiz.reward}
                        </span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className={`
                      font-bold text-xs sm:text-base leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]
                      transition-colors duration-200
                      ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}
                    `}>
                      {quiz.quiz_name}
                    </h3>
                    
                    {/* Material Preview - Hidden on mobile */}
                    {quiz.material && (
                      <p className={`
                        hidden sm:block text-xs line-clamp-2 leading-relaxed
                        ${isDark ? 'text-gray-400' : 'text-slate-500'}
                      `}>
                        {quiz.material}
                      </p>
                    )}
                    
                    {/* Stats Row */}
                    <div className={`
                      flex items-center gap-2 sm:gap-4 pt-2 sm:pt-3 mt-auto
                      border-t ${isDark ? 'border-white/5' : 'border-slate-100'}
                    `}>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <CircleQuestionMark className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                        <span className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                          {quiz.questions?.length || 0}
                        </span>
                      </div>
                      
                      {quiz.isTimed === 1 && (
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                            {quiz.duration}m
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
                        <UsersRoundIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                        <span className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                          {quiz.completed || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Action Overlay */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center gap-2
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    ${isDark ? 'bg-black/60' : 'bg-slate-900/60'}
                    backdrop-blur-sm
                  `}>
                    <span className={`
                      px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold
                      transform translate-y-2 group-hover:translate-y-0
                      transition-transform duration-300 delay-75
                      ${isDark ? 'bg-white text-black' : 'bg-white text-slate-900'}
                    `}>
                      Take Quiz
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className={`
              w-16 h-16 mb-4 rounded-2xl flex items-center justify-center
              ${isDark ? 'bg-white/5' : 'bg-slate-100'}
            `}>
              <svg className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No quizzes yet
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              This user hasn't created any quizzes yet.
            </p>
          </div>
        )}


      </main>


      <div className="h-[450px] md:h-32" ></div>
        <footer className={`relative z-10 border-t transition-colors duration-500 ${isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100'}`}>
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
                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                  © 2024 All rights reserved.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
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

            <div className="flex items-center gap-4">
              {[
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 border ${isDark ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border-orange-500/20' : 'text-slate-600 hover:text-orange-500 hover:bg-orange-50 border-slate-200'}`}
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
 
     
      </div>
      

      
         </>
    )
}


