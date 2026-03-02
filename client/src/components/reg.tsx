import loder from "../assets/Rolling@1x-1.0s-200px-200px.gif"
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { FormEvent, useState, useEffect } from "react"
import { useNavigate, useSearchParams} from "react-router-dom"
import { Notification } from "./notification"
import { registerAuth } from "../lib/auth"

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [not, setNot] = useState(false)
  const [error, setError] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })

  const [searchParams] = useSearchParams()
  
  const isAppAuth = searchParams.get('appauth') === 'true'
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/home")
    }
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (profile.password !== profile.confirmPassword) {
      setError(true)
      setNot(true)
      setMsg("Passwords do not match")
      return
    }
    
    if (profile.password.length < 6) {
      setError(true)
      setNot(true)
      setMsg("Password must be at least 6 characters")
      return
    }
    
    setError(false)
    setLoading(true)
    setNot(false)
    setMsg("")
    
    try {
      const resp:any = await registerAuth({
        email: profile.email,
        password: profile.password
      })
      console.log("Registered , now continue")
      setError(false)
      setLoading(false)
      setNot(true)
      setMsg(resp.msg || "Account created successfully!")
 
      setTimeout(() => {
        if(isAppAuth){
           navigate("/setusername?appauth=true")
           return
        }
        navigate("/setusername")
      }, 2000)
      
    } catch (err: any) {
      setError(true)
      setLoading(false)
      setNot(true)
      setMsg(err.message || "Registration failed")
    }
  }

  document.title = "Create Account | Hyper Quizzes"

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/40'}`}></div>
        <div className={`absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse delay-1000 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/40'}`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] ${isDark ? 'bg-orange-600/5' : 'bg-orange-200/30'}`}></div>
        
        {/* Grid pattern for dark mode */}
        {isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 border ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-white shadow-lg border-orange-100'}`}>
              <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hyper<span className="text-orange-500">Quizes</span>
            </span>
          </a>
          
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30 hover:border-orange-500/50' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Notification */}
      {not && <Notification show={not} message={msg} type={error ? "error" : "success"} onClose={() => setNot(false)} />}

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className={`relative rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border transition-colors duration-500 ${isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/90 border-orange-100'}`}>
            {/* Top Gradient Bar */}
            <div className="h-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"></div>
            
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-orange-500' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Create Account
                </h1>
                <p className={`text-sm sm:text-base transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Join thousands of learners on Hyper Quizes
                </p>

                {isAppAuth && (
                  <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-500 ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    App Auth
                  </span>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-orange-500/60' : 'text-slate-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${isDark ? 'bg-gray-900/50 border-gray-800 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-500/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-orange-500/60' : 'text-slate-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={profile.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${isDark ? 'bg-gray-900/50 border-gray-800 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-500/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  <p className={`mt-1.5 text-xs transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-orange-500/60' : 'text-slate-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${isDark ? 'bg-gray-900/50 border-gray-800 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-500/30' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {profile.confirmPassword && profile.password !== profile.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
                  )}
                  {profile.confirmPassword && profile.password === profile.confirmPassword && profile.password.length >= 6 && (
                    <p className="mt-1.5 text-xs text-green-500">Passwords match!</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className={`w-4 h-4 mt-0.5 rounded border-2 transition-colors ${isDark ? 'border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500/20' : 'border-slate-300 text-orange-500'}`}
                    required
                  />
                  <label htmlFor="terms" className={`text-sm leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    I agree to the{' '}
                    <a href="/terms" className="text-orange-500 hover:text-orange-400 font-medium">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-orange-500 hover:text-orange-400 font-medium">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full relative group overflow-hidden rounded-xl py-4 font-bold text-white shadow-lg transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : 'hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span>Creating account...</span>
                        <img src={loder} width="20" height="20" alt="" className={isDark ? 'invert' : ''} />
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center transition-colors duration-500 ${isDark ? 'text-gray-800' : 'text-slate-300'}`}>
                  <div className={`w-full border-t transition-colors duration-500 ${isDark ? 'border-orange-500/20' : 'border-slate-200'}`}></div>
                </div>
                <div className="relative flex justify-center">
                  <span className={`px-4 text-sm transition-colors duration-500 ${isDark ? 'bg-black text-gray-500' : 'bg-white text-slate-500'}`}>
                    or
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <p className={`text-center text-sm transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                Already have an account?{' '}
                <a href={isAppAuth ? "/login?appauth=true" :"/login"} className="font-semibold text-orange-500 hover:text-orange-400 transition-colors inline-flex items-center gap-1 group">
                  Sign in
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="/" className={`flex items-center gap-1.5 transition-colors duration-500 ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-slate-500 hover:text-slate-700'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to home
            </a>
            <span className={`transition-colors duration-500 ${isDark ? 'text-gray-800' : 'text-slate-300'}`}>|</span>
            <a href="/help" className={`transition-colors duration-500 ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-slate-500 hover:text-slate-700'}`}>
              Need help?
            </a>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}