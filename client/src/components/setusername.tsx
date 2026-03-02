import loder from "../assets/Rolling@1x-1.0s-200px-200px.gif"

import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { FormEvent, useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { checkUsername } from "../lib/auth"
import { Notification } from "./notification"

export default function SetUsername() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [not, setNot] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const navigate = useNavigate()
  
  const [username, setUsername] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
   const [searchParams] = useSearchParams()
    const isAppAuth = searchParams.get('appauth') === 'true'

  // Check if logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
    
    const existingUsername = localStorage.getItem("username")
    if (existingUsername) {
      navigate("/home")
    }
  }, [navigate])

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


  const generateSuggestions = () => {
    const adjectives = ['Happy', 'Clever', 'Bright', 'Quick', 'Smart', 'Cool', 'Super', 'Mega']
    const nouns = ['Carrot', 'Quizzer', 'Learner', 'Brain', 'Scholar', 'Master', 'Ninja', 'Pro']
    const randomNum = Math.floor(Math.random() * 999) + 1
    
    const newSuggestions = adjectives.slice(0, 4).map(adj => {
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      return `${adj}${noun}${randomNum}`
    })
    
    setSuggestions(newSuggestions)
    setShowSuggestions(true)
  }

    useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null)
      return
    }
    
    const timer = setTimeout(async () => {
      setChecking(true)
      try {
     
  
   
        setIsAvailable(true)
      } catch (err) {
        // If API fails, assume available for demo
        setIsAvailable(true)
      }
      setChecking(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (username.length < 3) {
      setNot(true)
      setMsg("## Username must be at least 3 characters")
      return
    }
    
    if (!isAvailable) {
      setNot(true)
      setMsg("## Username is already taken")
      return
    }
    
    setLoading(true)
    setNot(false)
    setMsg("")
    
    try {
      const id = localStorage.getItem("id")
        
           const resp = await checkUsername(id,username)
     
      
      if (resp.msg) {
         setLoading(false)
      setNot(true)
      setMsg(resp.msg || "Username set successfully!")
        localStorage.setItem("username", username)
        setTimeout(() => {
          if(isAppAuth){
              window.location.href = `hyperquizes://auth/callback?token=${resp.msg}`
              return
          }
          navigate("/home")
        }, 1500)
      }

      if(resp.error){
          setMsg("## " + resp.error)
          setChecking(false)
          setIsAvailable(false)
      }
    } catch (err: any) {
      setLoading(false)
      setNot(true)
      setMsg("## " + (err.response?.data?.msg || err.message || "Failed to set username"))
    }
  }

  document.title = "Set Username | Hyper Quizes"

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-stone-950' : 'bg-orange-50'}`}>
      {/* Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-orange-600/10' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-amber-600/10' : 'bg-amber-300/30'}`}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDark ? 'bg-stone-800 text-amber-400 hover:bg-stone-700' : 'bg-white text-stone-600 shadow-lg hover:shadow-xl'}`}
      >
        {isDark ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        )}
      </button>

      {/* Notification */}
       {not && <Notification show={not} message={msg.includes("##")  ? (msg.slice(2,1000)) : msg} type={msg.includes("##") ? "error" : "success"} onClose={() => setNot(false)} />}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl shadow-orange-500/25">
              <img 
                src={logo}
                alt="Logo" 
                className="w-12 h-12 drop-shadow-sm"
              />
            </div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
              Choose Your Username
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              This is how other users will see you on Hyper Quizzes
            </p>
          </div>

          {/* Form Card */}
          <div className={`relative rounded-3xl p-8 shadow-2xl transition-all duration-500 ${isDark ? 'bg-stone-900/80 border border-stone-800' : 'bg-white border border-stone-100'}`}>
            {/* Decorative top line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-t-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                      setShowSuggestions(false)
                    }}
                    className={`w-full rounded-xl px-4 py-3.5 pl-12 pr-12 transition-all duration-300 outline-none focus:ring-2 ${isDark ? 'bg-stone-800/50 border-stone-700 text-stone-100 placeholder-stone-500 focus:ring-orange-500/50 focus:border-orange-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-orange-500/20 focus:border-orange-500'} border`}
                    placeholder="your_username"
                    minLength={3}
                    maxLength={20}
                    required
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-stone-500 group-focus-within:text-orange-400' : 'text-stone-400 group-focus-within:text-orange-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  
                  {/* Availability Indicator */}
                  {username.length >= 3 && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {checking ? (
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : isAvailable ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Validation Message */}
                {username.length > 0 && username.length < 3 && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    Username must be at least 3 characters
                  </p>
                )}
                {username.length >= 3 && !checking && isAvailable === false && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    Username is already taken
                  </p>
                )}
                {username.length >= 3 && !checking && isAvailable === true && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Username is "Valid" now click continue to check availability and set!
                  </p>
                )}
              </div>

              {/* Suggestions */}
              <div>
                <button
                  type="button"
                  onClick={generateSuggestions}
                  className={`text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Need inspiration? Get suggestions
                </button>
                
                {showSuggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUsername(suggestion)
                          setShowSuggestions(false)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-orange-100 border border-stone-200'}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className={`p-4 rounded-xl text-sm space-y-2 transition-colors duration-300 ${isDark ? 'bg-stone-800/50 text-stone-400' : 'bg-stone-50 text-stone-600'}`}>
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${username.length >= 3 ? 'text-green-500' : isDark ? 'text-stone-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>3-20 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${/^[a-z0-9_]*$/.test(username) && username.length > 0 ? 'text-green-500' : isDark ? 'text-stone-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Letters, numbers, and underscores only</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${!/\s/.test(username) ? 'text-green-500' : isDark ? 'text-stone-600' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>No spaces</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isAvailable || username.length < 3}
                className={`w-full relative overflow-hidden rounded-xl py-4 px-4 font-bold text-white transition-all duration-300 ${loading || !isAvailable || username.length < 3 ? 'cursor-not-allowed opacity-60' : 'hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-shift"></div>
                {loading ? (
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-lg">Setting username...</span>
                    <img src={loder} width="24" height="24" alt="Loading" className="invert" />
                  </div>
                ) : (
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Skip Option */}
            <div className={`mt-6 pt-6 text-center border-t transition-colors duration-300 ${isDark ? 'border-stone-800' : 'border-stone-100'}`}>
              <button
                onClick={() => navigate("/home")}
                className={`text-sm transition-colors duration-300 ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Skip for now
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <a 
              href="/home" 
              className={`inline-flex items-center gap-2 text-sm transition-colors duration-300 ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to home
            </a>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}