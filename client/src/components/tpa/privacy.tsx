import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect, useRef } from "react"
import SEO from "../seo";


export default function Privacy() {

  
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

  const lastUpdated = "January 1, 2024"

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us when you:

• Create an account (email, username, password)
• Create or participate in quizzes
• Contact our support team
• Use our mobile applications

We also collect certain information automatically:

• Device information (type, OS version, unique identifiers)
• Log data (IP address, browser type, pages visited)
• Usage data (quiz participation, scores, time spent)
• Cookies and similar technologies`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process and complete quiz transactions
• Send technical notices, updates, and support messages
• Respond to your comments and questions
• Monitor and analyze trends, usage, and activities
• Personalize your experience and deliver relevant content
• Detect, investigate, and prevent fraudulent transactions and abuse
• Carry out any other purpose described at the time of collection

We process your data based on:
• Your consent (when you create an account)
• Contract necessity (to provide our services)
• Legal obligations (compliance with laws)
• Legitimate interests (improving our platform)`
    },
    {
      title: "3. Information Sharing",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:

• With service providers who perform services on our behalf
• To comply with legal obligations or respond to lawful requests
• To protect the rights, property, or safety of HyperQuizzes, our users, or others
• In connection with a merger, sale, or acquisition of all or part of our company
• With your consent or at your direction

Quiz creators can see participant scores and usernames, but never email addresses or passwords.`
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your data:

• Encryption of data in transit (TLS/SSL) and at rest
• Regular security assessments and penetration testing
• Access controls and authentication requirements
• Monitoring for suspicious activities
• Employee training on data protection

However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`
    },
    {
      title: "5. Your Data Rights",
      content: `Depending on your location, you may have the following rights:

• Access: Request a copy of your personal data
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your account and data
• Portability: Receive your data in a structured format
• Restriction: Limit how we process your data
• Objection: Object to certain processing activities
• Withdraw Consent: Revoke consent at any time

To exercise these rights, contact us at privacy@hyperquizzes.com. We respond to all requests within 30 days.`
    },
    {
      title: "6. Cookies & Tracking",
      content: `We use cookies and similar technologies to:

• Keep you logged in during sessions
• Remember your preferences (theme, language)
• Analyze site traffic and usage patterns
• Improve our services and user experience

Types of cookies we use:
• Essential: Required for basic functionality
• Functional: Remember your preferences
• Analytics: Help us understand usage patterns
• Marketing: Deliver relevant content (if opted in)

You can control cookies through your browser settings. Disabling essential cookies may affect site functionality.`
    },
    {
      title: "7. Data Retention",
      content: `We retain your information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain business records

Specific retention periods:
• Account data: Until account deletion + 30 days grace period
• Quiz content: Until deleted by creator or 2 years of inactivity
• Usage logs: 12 months for analytics, then anonymized
• Deleted accounts: Permanently removed within 90 days

You may request early deletion by contacting us.`
    },
    {
      title: "8. Children's Privacy",
      content: `HyperQuizzes is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

If we learn we have collected personal information from a child under 13, we will:

• Delete that information immediately
• Terminate the associated account
• Notify parents/guardians if contact information is available

Parents or guardians who believe their child has provided us with information may contact us at privacy@hyperquizzes.com.`
    },
    {
      title: "9. International Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.

We ensure appropriate safeguards are in place:

• Standard Contractual Clauses for EU data transfers
• Adequacy decisions where recognized by regulatory authorities
• Data Processing Agreements with all service providers

By using our services, you consent to the transfer of your information to countries that may not provide equivalent data protection.`
    },
    {
      title: "10. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time to reflect:

• Changes in our practices or services
• New legal requirements or regulations
• Improvements to our data protection measures

We will notify you of significant changes by:

• Email notification to registered users
• Prominent notice on our website
• Update to the "Last Updated" date

Continued use of our services after changes constitutes acceptance of the updated policy. We encourage you to review this policy periodically.`
    },
    {
      title: "11. Contact Us",
      content: `For privacy-related questions, concerns, or to exercise your data rights, please contact:

Email: privacy@hyperquizzes.com
Data Protection Officer: dpo@hyperquizzes.com
Address: HyperQuizzes Inc., 123 Quiz Street, San Francisco, CA 94102

We aim to respond to all privacy inquiries within 48 hours. For formal data requests, please include "Data Request" in the subject line.

If you believe we have not addressed your concern, you have the right to complain to your local data protection authority.`
    }
  ]

  

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-orange-50 via-white to-amber-50'}`}>
      {/* Animated Background Effects */}
       <SEO
        title="Privacy Policy" 
        description="Our Privacy policy" 
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-700 ${isDark ? 'bg-orange-600/20' : 'bg-orange-300/30'}`}></div>
        <div className={`absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-700 ${isDark ? 'bg-orange-500/10' : 'bg-amber-300/30'}`}></div>
        
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

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Your Data Matters
          </div>
          
          <h1 className={`text-4xl lg:text-5xl font-black mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Policy</span>
          </h1>
          
          <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Last updated: <span className="font-semibold text-orange-500">{lastUpdated}</span>
          </p>
        </div>

        {/* Privacy Content */}
        <div className="max-w-4xl mx-auto">
          {/* Introduction Card */}
          <div className={`rounded-3xl p-8 mb-8 border backdrop-blur-sm ${isDark ? 'bg-black/60 border-orange-500/20' : 'bg-white border-orange-100'}`}>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              At HyperQuizzes, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform. We are committed to being transparent about our data practices and giving you control over your information.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`group rounded-2xl p-6 lg:p-8 border transition-all duration-300 hover:scale-[1.01] ${isDark ? 'bg-black/40 border-orange-500/10 hover:border-orange-500/30' : 'bg-white/80 border-orange-100 hover:border-orange-300'}`}
              >
                <h2 className={`text-xl lg:text-2xl font-bold mb-4 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    {index + 1}
                  </span>
                  {section.title.split('. ')[1]}
                </h2>
                <div className={`space-y-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <div key={pIndex}>
                      {paragraph.startsWith('•') ? (
                        <ul className="space-y-2 ml-4">
                          {paragraph.split('\n').map((item, iIndex) => (
                            <li key={iIndex} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1.5">•</span>
                              <span className="leading-relaxed">{item.replace('• ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      ) : paragraph.includes(':') && !paragraph.includes('.') ? (
                        <p className="font-semibold text-orange-500 mb-2">{paragraph}</p>
                      ) : (
                        <p className="leading-relaxed">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA Card */}
          <div className={`mt-12 rounded-2xl p-8 border text-center ${isDark ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'}`}>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Have Privacy Concerns?
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Your privacy is our priority. If you have any questions about how we handle your data, our privacy team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:privacy@hyperquizzes.com" className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                Email Privacy Team
              </a>
              <a href="/terms" className={`px-6 py-3 rounded-xl font-semibold border transition-all duration-300 ${isDark ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                View Terms of Service
              </a>
            </div>
          </div>

          {/* Data Rights Quick Links */}
          <div className={`mt-8 grid md:grid-cols-3 gap-4`}>
            {[
              { title: "Access Your Data", desc: "Request a copy of all your personal information", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { title: "Delete Account", desc: "Permanently remove your account and all data", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" },
              { title: "Export Data", desc: "Download your data in a portable format", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }
            ].map((item, idx) => (
              <a 
                key={idx}
                href="mailto:privacy@hyperquizzes.com"
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-black/40 border-orange-500/10 hover:border-orange-500/30' : 'bg-white border-orange-100 hover:border-orange-300'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${isDark ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                  </svg>
                </div>
                <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t transition-colors duration-500 ${isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100'}`}>
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
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

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {['About', 'Privacy', 'Terms', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className={`transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-slate-600 hover:text-orange-600'} ${link === 'Privacy' ? 'font-semibold text-orange-500' : ''}`}
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