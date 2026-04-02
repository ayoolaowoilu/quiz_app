import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect, useRef } from "react"
import { deleteUserData, getUserData, logoutAuth, UpdateUserData } from "../lib/auth";

export default function ProfileSettings() {

  
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


  const [username, setUsername] = useState(localStorage.getItem("username") || "")
  const [email, setEmail] = useState(localStorage.getItem("email") || "")
  const [oldEmail] = useState(localStorage.getItem("email") || "")
  const [oldUsername] = useState(localStorage.getItem("username") || "")
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState("")

  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

 
  const userId = localStorage.getItem("id")
  const displayName = username ? `@${username}` : `User${userId}`
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
  const isLoggedIn = !!localStorage.getItem("token")

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
  try {
        e.preventDefault()
    setIsUpdating(true)
    setUpdateStatus('idle')


    if(oldEmail == email || oldUsername == username){
        setUpdateStatus("error")
        setIsUpdating(false)
        setStatusMessage("No changes made!")
        return;
    }
    const token = localStorage.getItem("token")
   await getUserData(token)
   const id = localStorage.getItem("id")
    const payload = {
      type :"EU",
      email : email,
      username : username,
      id:Number(id)
    }
  
      


    
  await UpdateUserData(payload);
    
   
    localStorage.setItem("username", username)
    localStorage.setItem("email", email)

    setIsUpdating(false)
    setUpdateStatus('success')
    setStatusMessage("Profile updated successfully!")
    setTimeout(() => setUpdateStatus('idle'), 3000)
  } catch (error) {
      setIsUpdating(false)
      setUpdateStatus("error")
      setStatusMessage("Internet Error")
  }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    try {
       e.preventDefault()
    setIsUpdating(true)
    setUpdateStatus('idle')

    if (newPassword !== confirmPassword) {
      setIsUpdating(false)
      setUpdateStatus('error')
      setStatusMessage("passwords don't match!")
      return
    }

       const token = localStorage.getItem("token")
   await getUserData(token)
   const id = localStorage.getItem("id")
    const payload = {
      type :"P",
      password:newPassword,
      id:Number(id)
    }
  
    await UpdateUserData(payload)

    setIsUpdating(false)
    setUpdateStatus('success')
    setStatusMessage("Password changed successfully!")
  
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setUpdateStatus('idle'), 3000)
    } catch (error) {
        setUpdateStatus("error")
        setStatusMessage("Network Error")
        setIsUpdating(false)
        
    setNewPassword("")
    setConfirmPassword("")
    }
  }

  const handleDeleteAccount = async () => {
    try {
        if (deleteConfirmation !== "DELETE") {
      setStatusMessage("Please type DELETE to confirm")
      return
    }

    setIsDeleting(true)

      const token = localStorage.getItem("token")
   await getUserData(token)
   const id = localStorage.getItem("id")
    await deleteUserData(Number(id))

    logoutAuth("web")
    } catch (error) {
      setShowDeleteModal(false)
      setStatusMessage("Internet Error")
      setUpdateStatus("error")
      setIsDeleting(false)
    }
  }

  if (!isLoggedIn) {
    window.location.href = "/login"
    return null
  }

  document.title = "Profile Settings | Hyper Quizzes"

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
                  { name: 'Home', href: '/home', active: false },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
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

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Account Settings
          </div>
          
          <h1 className={`text-4xl lg:text-5xl font-black mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Settings</span>
          </h1>
          
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Manage your account details, security settings, and preferences.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Info Card */}
          <div className={`rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/30">
                {avatarLetter}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile Information</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Update your personal details</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 ${isDark ? 'bg-gray-900/50 border-orange-500/30 text-white placeholder-gray-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'}`}
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 ${isDark ? 'bg-gray-900/50 border-orange-500/30 text-white placeholder-gray-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'}`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {updateStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 text-sm ${updateStatus === 'success' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={updateStatus === 'success' ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    {statusMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`ml-auto px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'} ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className={`rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-5">
           
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 ${isDark ? 'bg-gray-900/50 border-orange-500/30 text-white placeholder-gray-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'}`}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 ${isDark ? 'bg-gray-900/50 border-orange-500/30 text-white placeholder-gray-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500'}`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

                <div className="flex items-center justify-between pt-4">
                {updateStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 text-sm ${updateStatus === 'success' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={updateStatus === 'success' ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    {statusMessage}
                  </div>
                )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'} ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                       {isUpdating ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Update Password
                    </>
                  )}
                </button>
              </div>
              </div>
            </form>
          </div>

          {/* Delete Account Card */}
          <div className={`rounded-3xl p-8 border backdrop-blur-sm ${isDark ? 'bg-red-950/30 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-3 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <svg className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              Delete Account
            </h2>
            
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Once you delete your account, there is no going back. This action cannot be undone. All your data, quizzes, and progress will be permanently removed.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30' : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'}`}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-8 border shadow-2xl transform transition-all ${isDark ? 'bg-black border-red-500/30' : 'bg-white border-red-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-full ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Delete Account?
              </h3>
            </div>

            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              This action is permanent and cannot be undone. All your quizzes, statistics, and account data will be permanently deleted.
            </p>

            <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-red-950/50 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                Type <span className="font-bold">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/50 ${isDark ? 'bg-black/50 border-red-500/30 text-white placeholder-gray-600 focus:border-red-500' : 'bg-white border-red-300 text-slate-900 placeholder-slate-400 focus:border-red-500'}`}
                placeholder="Type DELETE here..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation("")
                }}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isDeleting || deleteConfirmation !== "DELETE" ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
  )
}