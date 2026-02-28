import loder from "../assets/Rolling@1x-1.0s-200px-200px.gif"
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { FormEvent, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Reg() {
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
    
    // Check password match
    if (profile.password !== profile.confirmPassword) {
      setNot(true)
      setMsg("## Passwords do not match")
      return
    }
    
    setLoading(true)
    setNot(false)
    setMsg("")
    
    try {
      const resp = await axios.post(`${import.meta.env.VITE_URL}/auth/reg`, {
        email: profile.email,
        password: profile.password
      })
      setLoading(false)
      setNot(true)
      setMsg(resp.data.msg)
      
      // Optional: Auto redirect to login after successful registration
      if (resp.data.success || resp.data.msg?.toLowerCase().includes("success")) {
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err: any) {
      setLoading(false)
      setNot(true)
      setMsg("## " + (err.response?.data?.msg || err.message || "Registration failed"))
    }
  }

  document.title = "Register | Hyper Quizes"

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
      {not && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down`}>
          <div className={`rounded-2xl border-l-4 p-4 shadow-2xl backdrop-blur-md ${msg?.includes("##") ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500'}`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${msg?.includes("##") ? 'text-red-500' : 'text-green-500'}`}>
                {msg?.includes("##") ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <strong className={`block font-semibold ${msg?.includes("##") ? 'text-red-400' : 'text-green-400'}`}>
                  {msg?.includes("##") ? "Registration Failed" : "Account Created!"}
                </strong>
                <p className={`mt-1 text-sm ${msg?.includes("##") ? 'text-red-300' : 'text-green-300'}`}>
                  {msg?.replace("## ", "")}
                </p>
              </div>
              <button onClick={() => setNot(false)} className="text-stone-400 hover:text-stone-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl shadow-orange-500/25">
              <img 
                src="{logo}" 
                alt="Logo" 
                className="w-12 h-12 drop-shadow-sm"
              />
            </div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
              Create Account
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Start your learning journey with Hyper Quizes
            </p>
          </div>

          {/* Form Card */}
          <div className={`relative rounded-3xl p-8 shadow-2xl transition-all duration-500 ${isDark ? 'bg-stone-900/80 border border-stone-800' : 'bg-white border border-stone-100'}`}>
            {/* Decorative top line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-t-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl px-4 py-3.5 pl-12 transition-all duration-300 outline-none focus:ring-2 ${isDark ? 'bg-stone-800/50 border-stone-700 text-stone-100 placeholder-stone-500 focus:ring-orange-500/50 focus:border-orange-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-orange-500/20 focus:border-orange-500'} border`}
                    placeholder="you@example.com"
                    required
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-stone-500 group-focus-within:text-orange-400' : 'text-stone-400 group-focus-within:text-orange-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl px-4 py-3.5 pl-12 transition-all duration-300 outline-none focus:ring-2 ${isDark ? 'bg-stone-800/50 border-stone-700 text-stone-100 placeholder-stone-500 focus:ring-orange-500/50 focus:border-orange-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-orange-500/20 focus:border-orange-500'} border`}
                    placeholder="••••••••"
                    required
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-stone-500 group-focus-within:text-orange-400' : 'text-stone-400 group-focus-within:text-orange-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-xl px-4 py-3.5 pl-12 transition-all duration-300 outline-none focus:ring-2 ${isDark ? 'bg-stone-800/50 border-stone-700 text-stone-100 placeholder-stone-500 focus:ring-orange-500/50 focus:border-orange-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:ring-orange-500/20 focus:border-orange-500'} border`}
                    placeholder="••••••••"
                    required
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-stone-500 group-focus-within:text-orange-400' : 'text-stone-400 group-focus-within:text-orange-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  className={`w-4 h-4 mt-1 rounded border transition-colors duration-300 ${isDark ? 'border-stone-600 bg-stone-800 text-orange-500' : 'border-stone-300 text-orange-500'}`}
                  required
                />
                <label htmlFor="terms" className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  I agree to the{' '}
                  <a href="/terms" className="text-orange-500 hover:text-orange-400 font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-orange-500 hover:text-orange-400 font-medium">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden rounded-xl py-4 px-4 font-bold text-white transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-80' : 'hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-shift"></div>
                {loading ? (
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-lg">Creating account...</span>
                    <img src={loder} width="24" height="24" alt="Loading" className="invert" />
                  </div>
                ) : (
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    Create Account
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className={`mt-8 pt-6 text-center border-t transition-colors duration-300 ${isDark ? 'border-stone-800' : 'border-stone-100'}`}>
              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <a 
              href="/" 
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