import world from "../assets/world-1-svgrepo-com.svg"
import create from "../assets/plus-svgrepo-com.svg"
import join from "../assets/link-svgrepo-com.svg"
import logo from "../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
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

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const cards = [
    {
      title: "Join a Quiz",
      info: "Use a token sent by the quiz creator to join the quiz room. Your results will be sent directly to your email. Have fun! 🎉",
      path: "/join-quiz",
      img: join,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Create Quiz Code",
      info: "For quiz setters only. Apply to become one and start creating engaging quizzes for others!",
      path: "/create-quiz",
      img: create,
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Explore Random Quizzes",
      info: "Coming soon! Access public quizzes about world affairs, science, history, and more. Available to everyone!",
      path: "#",
      img: world,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      comingSoon: true
    }
  ]

  document.title = "Home | Hyper Quizes"

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-stone-950' : 'bg-orange-50/30'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-orange-600/10' : 'bg-orange-300/20'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-3xl transition-colors duration-700 ${isDark ? 'bg-amber-600/10' : 'bg-amber-300/20'}`}></div>
      </div>

      {/* Header */}
      <header className={`relative z-50 sticky top-0 backdrop-blur-md border-b transition-colors duration-500 ${isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-stone-200'}`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                Hyper<span className="text-orange-500">Quizes</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home', active: true },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative ${item.active ? 'text-orange-500' : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    {item.name}
                    {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {/* Get App Button */}
                <button
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-orange-500 text-stone-950 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Get App
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDark ? 'bg-stone-800 text-amber-400 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
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

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Get App Button */}
              <button
                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-orange-500 text-stone-950' : 'bg-stone-900 text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-stone-800 text-amber-400' : 'bg-stone-100 text-stone-600'}`}
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
                className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'}`}
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
            <div className={`lg:hidden py-4 border-t transition-colors duration-300 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <nav className="flex flex-col gap-2">
                {[
                  { name: 'Home', href: '/home' },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${isDark ? 'text-stone-300 hover:bg-stone-800' : 'text-stone-700 hover:bg-stone-100'}`}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Get App Button Full */}
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold mt-2 ${isDark ? 'bg-orange-500 text-stone-950' : 'bg-stone-900 text-white'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download App
                </button>

                <button
                  onClick={logout}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors duration-300 mt-2 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl lg:text-6xl font-black mb-4 transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
            What would you like to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">do today?</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            Choose from the options below to start your quiz journey. Join existing quizzes, create your own, or explore public quizzes.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.path}
              className={`group relative block rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${isDark ? 'bg-stone-900/80 border border-stone-800' : 'bg-white border border-stone-100'} ${card.comingSoon ? 'opacity-75' : ''}`}
            >
              {/* Gradient Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.color}`}></div>
              
              {/* Coming Soon Badge */}
              {card.comingSoon && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg">
                  Coming Soon
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${card.bgColor}`}>
                  <img src={card.img} alt={card.title} className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  {card.title}
                </h3>
                
                <p className={`flex-1 leading-relaxed transition-colors duration-300 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {card.info}
                </p>

                {/* Action */}
                <div className="mt-6 flex items-center gap-2 font-semibold text-orange-500 group-hover:text-orange-400 transition-colors duration-300">
                  <span>{card.comingSoon ? 'Notify Me' : 'Get Started'}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isDark ? 'bg-gradient-to-br from-orange-500/5 to-transparent' : 'bg-gradient-to-br from-orange-50 to-transparent'}`}></div>
            </a>
          ))}
        </div>

        {/* Quick Stats */}
        <div className={`mt-16 max-w-4xl mx-auto rounded-2xl p-8 backdrop-blur-sm border transition-colors duration-500 ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white/50 border-stone-200'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Quizzes' },
              { value: '50K+', label: 'Users' },
              { value: '100K+', label: 'Questions' },
              { value: '99%', label: 'Satisfaction' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className={`text-3xl font-bold mb-1 transition-colors duration-300 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{stat.value}</div>
                <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t transition-colors duration-500 ${isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-stone-200'}`}>
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
              </div>
              <div>
                <span className={`font-bold transition-colors duration-300 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  Hyper<span className="text-orange-500">Quizes</span>
                </span>
                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                  © 2024 All rights reserved.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['About', 'Privacy', 'Terms', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className={`transition-colors duration-300 ${isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDark ? 'text-stone-400 hover:text-orange-400 hover:bg-stone-800' : 'text-stone-600 hover:text-orange-500 hover:bg-orange-50'}`}
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