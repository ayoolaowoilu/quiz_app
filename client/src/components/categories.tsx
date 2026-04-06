import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { fetchCategoryQuiz } from "../lib/quiz";

// Quiz_loaded interface definition
interface Question {
  answer: string;
  question?: string;
  mcqoptions?: Record<string, string>;
  options?: string[];
}

interface Quiz_loaded {
  id: number;
  _type: "TOF" | "MCQ" | "SAQ";
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
  questions: Question[];
  comments: null | any[];
  time_posted: string;
  passingScore: string;
  likes: number;
}

// Quiz categories data with icons and colors
const quizCategories = [
  {
    id: "general-knowledge",
    name: "General Knowledge",
    description: "Test your everyday knowledge",
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    questionCount: 120,
    difficulty: "Mixed"
  },
  {
    id: "history",
    name: "History",
    description: "Journey through time",
    icon: "📜",
    color: "from-amber-600 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    questionCount: 85,
    difficulty: "Medium"
  },
  {
    id: "geography",
    name: "Geography",
    description: "Explore the world",
    icon: "🌍",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    questionCount: 95,
    difficulty: "Mixed"
  },
  {
    id: "science",
    name: "Science",
    description: "Discover how things work",
    icon: "🔬",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    questionCount: 110,
    difficulty: "Hard"
  },
  {
    id: "technology",
    name: "Technology",
    description: "Computers, AI, and innovation",
    icon: "💻",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    questionCount: 75,
    difficulty: "Medium"
  },
  {
    id: "sports",
    name: "Sports",
    description: "Athletics and competitions",
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    questionCount: 90,
    difficulty: "Mixed"
  },
  {
    id: "movies",
    name: "Movies",
    description: "Cinema and film trivia",
    icon: "🎬",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    questionCount: 130,
    difficulty: "Easy"
  },
  {
    id: "music",
    name: "Music",
    description: "Songs, artists, and genres",
    icon: "🎵",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    questionCount: 100,
    difficulty: "Mixed"
  },
  {
    id: "literature",
    name: "Literature",
    description: "Books, authors, and poetry",
    icon: "📚",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    questionCount: 70,
    difficulty: "Hard"
  },
  {
    id: "art",
    name: "Art & Culture",
    description: "Paintings, artists, and museums",
    icon: "🎨",
    color: "from-fuchsia-500 to-pink-500",
    bgColor: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/30",
    questionCount: 65,
    difficulty: "Medium"
  },
  {
    id: "animals",
    name: "Animals",
    description: "Wildlife and nature",
    icon: "🦁",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    questionCount: 80,
    difficulty: "Easy"
  },
  {
    id: "food",
    name: "Food & Drink",
    description: "Cuisine and beverages",
    icon: "🍕",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    questionCount: 60,
    difficulty: "Easy"
  }
];

// Error/Offline State Component
function OfflineErrorState({ onRetry }: { onRetry: () => void }) {
  const [isDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-red-600/10' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-red-500/5' : 'bg-amber-300/30'}`}></div>
      </div>

      <div className={`relative max-w-md w-full text-center p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 ${isDark ? 'bg-black/80 border-red-500/30 shadow-2xl shadow-red-500/10' : 'bg-white/90 border-orange-200 shadow-2xl shadow-orange-500/20'}`}>
        {/* Animated WiFi Icon */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-full blur-xl animate-ping ${isDark ? 'bg-red-500/30' : 'bg-orange-500/30'}`}></div>
          <div className={`relative w-24 h-24 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-gradient-to-br from-orange-100 to-orange-200'}`}>
            <svg 
              className={`w-12 h-12 ${isDark ? 'text-red-400' : 'text-orange-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {/* WiFi symbol with X */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 16" className="text-red-500" />
            </svg>
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Connection Lost
        </h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
          Unable to connect to the server. Please check your internet connection and try again.
        </p>

        <div className={`p-4 rounded-xl mb-6 text-left ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-orange-50 border border-orange-200'}`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-orange-600'}`}>
            Troubleshooting Tips:
          </h3>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-400' : 'bg-orange-500'}`}></span>
              Check your WiFi or mobile data connection
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-400' : 'bg-orange-500'}`}></span>
              Try refreshing the page
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-400' : 'bg-orange-500'}`}></span>
              Disable VPN or proxy if active
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-400' : 'bg-orange-500'}`}></span>
              Check if the server is under maintenance
            </li>
          </ul>
        </div>

        <button
          onClick={onRetry}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>

        <Link 
          to="/home"
          className={`mt-4 inline-block text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-slate-500 hover:text-orange-600'}`}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// Quiz Type Badge Component
function QuizTypeBadge({ type }: { type: string; isDark: boolean }) {
  const typeConfig: Record<string, { label: string; color: string }> = {
    "TOF": { label: "True/False", color: "bg-purple-500" },
    "MCQ": { label: "Multiple Choice", color: "bg-blue-500" },
    "SAQ": { label: "Short Answer", color: "bg-green-500" }
  };
  
  const config = typeConfig[type] || { label: type, color: "bg-gray-500" };
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${config.color}`}>
      {config.label}
    </span>
  );
}

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export default function Category(){
    
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
    
      // Get user data from localStorage
      const username = localStorage.getItem("username")
      const email = localStorage.getItem("email")
      const userId = localStorage.getItem("id")
      const displayName = username ? `@${username}` : `User${userId}`
      const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
      const isLoggedIn = !!localStorage.getItem("token")
    
      useEffect(() => {
        // Detect scroll for nav styling
        const handleScroll = () => {
          setScrolled(window.scrollY > 20)
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
      }, [])
    
      // Close dropdowns when clicking outside
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


    const [search] = useSearchParams();
    const category  = search.get("category")
    const [categoryQuiz, setCategoryQuiz] = useState<Quiz_loaded[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    
    const fetchdata = async() => {
           try {
               setLoading(true)
               setError(false)
               const resp = await fetchCategoryQuiz(category as string)

               if(resp.error){
                  setError(true) 
                  setLoading(false)
                  return
               }
              
               setCategoryQuiz(resp || [])
               setLoading(false)
           } catch (error) {
              console.log(error)
              setError(true)
              setLoading(false)
           }
    }

    useEffect(() => {
        if(category){
            fetchdata()
        }   
    }, [category])

    const handleRetry = () => {
      if (category) {
        fetchdata()
      }
    }

    // If there's an error, show the offline error state
    if (error) {
      return <OfflineErrorState onRetry={handleRetry} />
    }

return (
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/30'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] ${isDark ? 'bg-orange-600/5' : 'bg-orange-200/20'}`}></div>
        
        {/* Grid pattern for dark mode */}
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        )}
      </div>

      {/* Fixed Navigation */}
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
                  { name: 'Home', href: '/home' , active:false },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${item?.active ? 'text-orange-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}
                    {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
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

                {/* Auth Buttons or Profile */}
                {isLoggedIn ? (
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

                    {/* Profile Dropdown */}
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
                        <a href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'}`}>
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
                ) : (
                  <div className="flex items-center gap-2">
                    <a href="/login" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      Sign In
                    </a>
                    <a href="/reg" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                      Get Started
                    </a>
                  </div>
                )}
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
                { name: 'Home', href: '/home' , active:false },
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
                
                {!isLoggedIn && (
                  <div className="mt-4 flex flex-col gap-2 px-4">
                    <a href="/login" className={`py-3 px-4 rounded-xl text-center text-sm font-medium border ${isDark ? 'border-orange-500/30 text-white' : 'border-slate-200 text-slate-700'}`}>
                      Sign In
                    </a>
                    <a href="/reg" className={`py-3 px-4 rounded-xl text-center text-sm font-medium ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white' : 'bg-slate-900 text-white'}`}>
                      Get Started
                    </a>
                  </div>
                )}

                {isLoggedIn && (
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
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!category ? (
          /* Categories Grid View */
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className={`text-4xl md:text-5xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Explore Quiz <span className="text-orange-500">Categories</span>
              </h1>
              <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                Choose from our wide range of quiz topics and test your knowledge across different subjects
              </p>
            </div>

            {/* Search/Filter Bar */}
            <div className={`p-4 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-black/40 border-orange-500/20' : 'bg-white/60 border-orange-200'}`}>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-full sm:w-auto ${isDark ? 'bg-gray-900/50 border-orange-500/20' : 'bg-white border-orange-200'}`}>
                  <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search categories..."
                    className={`bg-transparent outline-none text-sm w-full sm:w-64 ${isDark ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'}`}
                  />
                </div> */}
                <div className="flex gap-2">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    {quizCategories.length} Categories
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
                    1000+ Questions
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizCategories.map((cat, index) => (
                <Link
                  key={cat.id}
                  to={`/category?category=${cat.id}`}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isDark ? `bg-black/40 ${cat.borderColor} hover:bg-black/60` : `bg-white/80 ${cat.borderColor} hover:bg-white`} backdrop-blur-sm`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${cat.bgColor} border ${cat.borderColor}`}>
                    {cat.icon}
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white group-hover:text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    {cat.description}
                  </p>

                  {/* Stats */}
                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                        {cat.questionCount} Qs
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
                      {cat.difficulty}
                    </span>
                  </div>

                  {/* Arrow Icon */}
                  <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Section */}
            <div className={`mt-12 p-8 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-orange-600/20 to-orange-900/10 border-orange-500/30' : 'bg-gradient-to-br from-orange-100 to-amber-50 border-orange-200'}`}>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Can't decide? 🎲
                  </h2>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    Let us pick a random category for you!
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const random = quizCategories[Math.floor(Math.random() * quizCategories.length)];
                    window.location.href = `/category?category=${random.id}`;
                  }}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-white text-orange-600 hover:shadow-orange-500/20' : 'bg-slate-900 text-white hover:shadow-slate-900/20'}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Random Category
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Specific Category Quiz View - Updated for Quiz_loaded interface */
          <div className="space-y-6">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Link 
                to="/category"
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${isDark ? 'bg-gray-900 text-gray-400 hover:text-white border border-orange-500/30' : 'bg-white text-slate-600 hover:text-slate-900 border border-orange-200'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex-1">
                <h1 className={`text-3xl font-bold capitalize transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {category.replace(/-/g, ' ')} Quizzes
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {categoryQuiz.length} quizzes available in this category
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`p-6 rounded-2xl border animate-pulse ${isDark ? 'bg-black/40 border-orange-500/20' : 'bg-white border-orange-200'}`}>
                    <div className={`h-32 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}></div>
                    <div className={`h-6 rounded mb-2 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}></div>
                    <div className={`h-4 rounded w-2/3 mb-4 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}></div>
                    <div className="flex gap-2">
                      <div className={`h-6 rounded w-16 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}></div>
                      <div className={`h-6 rounded w-16 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quizzes Grid - Using Quiz_loaded interface */}
            {!loading && categoryQuiz.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryQuiz.map((quiz: Quiz_loaded, index: number) => (
                  <div 
                    key={quiz.id}
                    className={`group p-6 rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isDark ? 'bg-black/40 border-orange-500/30 hover:border-orange-500/50' : 'bg-white border-orange-200 hover:border-orange-400'} backdrop-blur-sm`}
                  >
                    {/* Quiz Header with Type Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                        {quizCategories.find(c => c.id === category)?.icon || '📚'}
                      </div>
                      <QuizTypeBadge type={quiz._type} isDark={isDark} />
                    </div>

                    {/* Quiz Name */}
                    <h3 className={`text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {quiz.quiz_name}
                    </h3>

                    {/* Material/Description */}
                    <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      {quiz.material || 'No description available'}
                    </p>

                    {/* Quiz Stats Row */}
                    <div className={`flex items-center gap-4 mb-4 text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.questions?.length || 0} Qs
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {quiz.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {quiz.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {quiz.saves || 0}
                      </span>
                    </div>

                    {/* Tags */}
                    {quiz.quiz_tags && quiz.quiz_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {quiz.quiz_tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
                            #{tag}
                          </span>
                        ))}
                        {quiz.quiz_tags.length > 3 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
                            +{quiz.quiz_tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quiz Meta Info */}
                    <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                      <div className="flex flex-col">
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                          by {quiz.creator_id}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                          {formatDate(quiz.time_posted)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Completion Stats */}
                        <div className={`text-xs text-right ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                          <div>{quiz.completed || 0} played</div>
                          <div className="text-green-500">{quiz.passed || 0} passed</div>
                        </div>
                        
                        <Link 
                          to={`/quiz/${quiz.id}`}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isDark ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          Play
                        </Link>
                      </div>
                    </div>

                    {/* Timed/One-time Badges */}
                    {(quiz.isTimed === 1 || quiz.isOneTime === 1) && (
                      <div className="flex gap-2 mt-3">
                        {quiz.isTimed === 1 && (
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {quiz.duration > 0 ? `${quiz.duration}m` : 'Timed'}
                          </span>
                        )}
                        {quiz.isOneTime === 1 && (
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            One Try
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && categoryQuiz.length === 0 && (
              <div className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-black/40 border-orange-500/20' : 'bg-white border-orange-200'}`}>
                <div className="text-6xl mb-4">📭</div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  No quizzes found
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Be the first to create a quiz in this category!
                </p>
                <Link 
                  to="/create-quiz"
                  className={`inline-block mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isDark ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  Create Quiz
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
      </div>
)
}
