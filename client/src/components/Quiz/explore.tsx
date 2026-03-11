import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg";
import {
  Search,
  Filter,
  Users,
  Trophy,
  Heart,
  Share2,
  MoreVertical,
  Copy,
  Check,
  Eye,
  Play,
  BookOpen,
  Grid,
  List,
  X,
  Moon,
  Sun,
  Type,
  BarChart3,
  ChevronLeft,
  Target,
  Timer,
  Lock,
  Sparkles,
  ChevronDown,Plus
} from "lucide-react";

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
}

const AnimatedBackground = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-orange-50'}`}>
    <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/50 via-orange-50 to-white'}`} />
    <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-20' : 'opacity-40'}`} />
    {isDark && (
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    )}
  </div>
);

const GlassCard = ({ children, className = "", isDark = true, hover = true }: { children: React.ReactNode; className?: string; isDark?: boolean; hover?: boolean }) => (
  <div className={`relative backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
    isDark 
      ? 'bg-black/60 border-orange-500/20' 
      : 'bg-white/80 border-orange-200'
  } ${hover ? (isDark ? 'hover:border-orange-500/40 hover:bg-black/70' : 'hover:border-orange-300 hover:shadow-lg') : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, variant = "primary", className = "", isDark = true }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "orange";
  className?: string;
  isDark?: boolean;
}) => {
  const baseStyles = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary: isDark 
      ? "bg-gray-900 hover:bg-gray-800 text-gray-300 border border-orange-500/30" 
      : "bg-white hover:bg-gray-50 text-gray-700 border border-orange-200",
    ghost: isDark 
      ? "text-gray-400 hover:text-white hover:bg-gray-900" 
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20",
    orange: isDark
      ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30"
      : "bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, type = "default", isDark = true }: { children: React.ReactNode; type?: "default" | "hot" | "new" | "trending"; isDark?: boolean }) => {
  const styles = {
    default: isDark ? "bg-orange-500/10 text-orange-400 border-orange-500/30" : "bg-orange-100 text-orange-600 border-orange-200",
    hot: "bg-gradient-to-r from-red-500 to-orange-500 text-white border-transparent",
    new: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-600 border-emerald-200",
    trending: isDark ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-purple-100 text-purple-600 border-purple-200",
  };

  return (
    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[type]}`}>
      {children}
    </span>
  );
};

export default function Explore() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<QuizType | "All">("All");
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "popular" | "reward">("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<number[]>([]);
  

 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const displayName = username ? `@${username}` : `User${userId}`;
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase();

  const categories = ["All", "Science", "History", "Technology", "Sports", "Arts", "Geography", "Math", "Language"];
  const types: { value: QuizType | "All"; label: string; icon: any; color: string }[] = [
    { value: "All", label: "All Types", icon: BookOpen, color: "text-orange-500" },
    { value: "MCQ", label: "Multiple Choice", icon: Grid, color: "text-blue-500" },
    { value: "TOF", label: "True/False", icon: Target, color: "text-purple-500" },
    { value: "SAQ", label: "Short Answer", icon: Type, color: "text-emerald-500" },
  ];

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock data fetch
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuizzes: Quiz[] = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        _type: ["MCQ", "TOF", "SAQ"][Math.floor(Math.random() * 3)] as QuizType,
        quiz_name: [
          "JavaScript Fundamentals", "World History Basics", "Python for Beginners",
          "Space Exploration", "Chemistry 101", "Literature Classics",
          "Math Challenge", "Geography Wonders", "Physics Principles",
          "Art History", "Music Theory", "Biology Basics",
          "Web Development", "Data Structures", "Machine Learning Intro",
          "Ancient Civilizations", "Modern Politics", "Economics 101",
          "Psychology Facts", "Philosophy Thoughts", "Coding Interview Prep",
          "React Mastery", "CSS Tricks", "Algorithm Design"
        ][i],
        creator_id: ["@johndoe", "@sarahsmith", "@mikejones", "@emilychen", "@davidwilson"][Math.floor(Math.random() * 5)],
        material: "Test your knowledge with this comprehensive quiz covering essential concepts and practical applications.",
        saves: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 10000),
        reward: Math.random() > 0.5 ? Math.floor(Math.random() * 60) + 1 : 0,
        completed: Math.floor(Math.random() * 5000),
        passed: Math.floor(Math.random() * 4000),
        failed: Math.floor(Math.random() * 1000),
        isOneTime: Math.random() > 0.7 ? 1 : 0,
        isTimed: Math.random() > 0.5 ? 1 : 0,
        duration: [5, 10, 15, 20, 30][Math.floor(Math.random() * 5)],
        quiz_tags: [["Science", "Tech"], ["History"], ["Coding"], ["Math"], ["Arts"]][Math.floor(Math.random() * 5)],
        time_posted: String(Date.now() - Math.floor(Math.random() * 1000000000)),
        passingScore: String([60, 70, 80][Math.floor(Math.random() * 3)]),
        likes: Math.floor(Math.random() * 500),
      }));
      
      setQuizzes(mockQuizzes);
      setFilteredQuizzes(mockQuizzes);
      setIsLoading(false);
    };
    
    fetchQuizzes();
  }, []);

  // Filter and sort
  useEffect(() => {
    let result = [...quizzes];
    
    // Search
    if (searchQuery) {
      result = result.filter(q => 
        q.quiz_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.creator_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.quiz_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(q => q.quiz_tags.includes(selectedCategory));
    }
    
    // Type filter
    if (selectedType !== "All") {
      result = result.filter(q => q._type === selectedType);
    }
    
    // Sort
    switch (sortBy) {
      case "trending":
        result.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
        break;
      case "newest":
        result.sort((a, b) => Number(b.time_posted) - Number(a.time_posted));
        break;
      case "popular":
        result.sort((a, b) => b.completed - a.completed);
        break;
      case "reward":
        result.sort((a, b) => b.reward - a.reward);
        break;
    }
    
    setFilteredQuizzes(result);
  }, [quizzes, searchQuery, selectedCategory, selectedType, sortBy]);

  const toggleTheme = () => setIsDark(!isDark);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  const copyLink = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://hyperquizes.netlify.app/join?id=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setOpenMenuId(null);
  };

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedQuizzes(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
    setOpenMenuId(null);
  };


  const shareQuiz = (quiz: Quiz, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: quiz.quiz_name,
        text: `Check out this quiz: ${quiz.quiz_name}`,
        url: `https://hyperquizzes.com/join?id=${quiz.id}`,
      });
    } else {
      copyLink(quiz.id, e);
    }
    setOpenMenuId(null);
  };

  const getTypeIcon = (type: QuizType) => {
    switch(type) {
      case "MCQ": return Grid;
      case "TOF": return Target;
      case "SAQ": return Type;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: QuizType, isDark: boolean) => {
    switch(type) {
      case "MCQ": return isDark ? "text-blue-400 bg-blue-500/10 border-blue-500/30" : "text-blue-600 bg-blue-100 border-blue-200";
      case "TOF": return isDark ? "text-purple-400 bg-purple-500/10 border-purple-500/30" : "text-purple-600 bg-purple-100 border-purple-200";
      case "SAQ": return isDark ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-emerald-600 bg-emerald-100 border-emerald-200";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getSuccessRate = (quiz: Quiz) => {
    return quiz.completed > 0 ? Math.round((quiz.passed / quiz.completed) * 100) : 0;
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <AnimatedBackground isDark={isDark} />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? (isDark ? 'bg-black/95 shadow-lg shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-md shadow-orange-500/10 border-orange-200') 
          : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')
      } backdrop-blur-xl`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/home" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 border ${
                  isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'
                }`}>
                  <img src={logo} alt="Hyper Quizes" className="w-8 h-8" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Hyper<span className="text-orange-500">Quizzes</span>
                </span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home' },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Explore', href: '/explore', active: true },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                      item.active 
                        ? 'text-orange-500' 
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 border ${
                    isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30 hover:border-orange-500/50' : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border ${
                      isDark ? 'bg-gray-900/80 border-orange-500/30 hover:border-orange-500/60' : 'bg-white border-gray-200 hover:border-orange-300'
                    } ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${profileOpen ? '-rotate-90' : ''}`} />
                  </button>

                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${
                    profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  } ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{displayName}</p>
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <a href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}>
                        <Type className="w-5 h-5" />
                        Profile Settings
                      </a>
                      <a href="/stats" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}>
                        <BarChart3 className="w-5 h-5" />
                        My Stats
                      </a>
                      <div className={`my-2 border-t ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`} />
                      <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
                      }`}>
                        <X className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors duration-300 border ${
                isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg transition-colors duration-300 border ${
                isDark ? 'bg-gray-900 text-white border-orange-500/30' : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Grid className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
              <nav className="flex flex-col gap-2">
                {['Home', 'Join Quiz', 'Create Quiz', 'Explore', 'Stats'].map((item) => (
                  <a key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    item === 'Explore' 
                      ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600') 
                      : (isDark ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100')
                  }`}>
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="h-16" />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border ${
              isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-600 border-orange-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Discover Amazing Quizzes
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl lg:text-5xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Quizzes</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm lg:text-base max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Find, play, and share quizzes from our community of creators
          </motion.p>
        </div>

        {/* Search & Filters Bar */}
        <GlassCard className="p-4 mb-6 sticky top-20 z-50" isDark={isDark} hover={false}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className={`flex-1 flex items-center rounded-xl border px-4 py-2.5 ${
              isDark ? 'bg-black/50 border-orange-500/30' : 'bg-white border-orange-200'
            }`}>
              <Search className={`w-5 h-5 mr-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes, creators, or tags..."
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={`p-1 rounded-full hover:bg-gray-800 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button 
              variant="secondary" 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
              isDark={isDark}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none px-4 py-2.5 pr-10 rounded-xl border text-sm font-medium outline-none cursor-pointer ${
                    isDark 
                      ? 'bg-gray-900 border-orange-500/30 text-white hover:border-orange-500/50' 
                      : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              {/* Type Dropdown */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as QuizType | "All")}
                  className={`appearance-none px-4 py-2.5 pr-10 rounded-xl border text-sm font-medium outline-none cursor-pointer ${
                    isDark 
                      ? 'bg-gray-900 border-orange-500/30 text-white hover:border-orange-500/50' 
                      : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  {types.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`appearance-none px-4 py-2.5 pr-10 rounded-xl border text-sm font-medium outline-none cursor-pointer ${
                    isDark 
                      ? 'bg-gray-900 border-orange-500/30 text-white hover:border-orange-500/50' 
                      : 'bg-white border-orange-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  <option value="trending">🔥 Trending</option>
                  <option value="newest">✨ Newest</option>
                  <option value="popular">⭐ Popular</option>
                  <option value="reward">🏆 Highest Reward</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              {/* View Toggle */}
              <div className={`flex items-center rounded-xl border p-1 ${isDark ? 'border-orange-500/30 bg-gray-900' : 'border-orange-200 bg-white'}`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? (isDark ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? (isDark ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-dashed overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-900 border-orange-500/30 text-white' : 'bg-white border-orange-200 text-gray-700'}`}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as QuizType | "All")}
                    className={`px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-900 border-orange-500/30 text-white' : 'bg-white border-orange-200 text-gray-700'}`}
                  >
                    {types.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-2 rounded-lg border text-sm col-span-2 ${isDark ? 'bg-gray-900 border-orange-500/30 text-white' : 'bg-white border-orange-200 text-gray-700'}`}
                  >
                    <option value="trending">🔥 Trending</option>
                    <option value="newest">✨ Newest</option>
                    <option value="popular">⭐ Popular</option>
                    <option value="reward">🏆 Highest Reward</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing <span className="font-bold text-orange-500">{filteredQuizzes.length}</span> quizzes
          </p>
          <div className="flex gap-2">
            {selectedCategory !== "All" && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-600 border-orange-200'
              }`}>
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedType !== "All" && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-600 border-orange-200'
              }`}>
                {types.find(t => t.value === selectedType)?.label}
                <button onClick={() => setSelectedType("All")} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="h-64 animate-pulse" isDark={isDark} hover={false}>
                <div className={`h-full ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`} />
              </GlassCard>
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No quizzes found</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          /* Quiz Grid/List */
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredQuizzes.map((quiz, index) => {
              const TypeIcon = getTypeIcon(quiz._type);
              const isSaved = savedQuizzes.includes(quiz.id);
              const isLiked = null
              const successRate = getSuccessRate(quiz);
              const isHot = quiz.views > 5000 || quiz.likes > 300;
              const isNew = Date.now() - Number(quiz.time_posted) < 86400000; // 24 hours

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                //   onClick={() => navigate(`/join-quiz?id=${quiz.id}`)}
                  className="group relative"
                >
                  <GlassCard 
                    className={`${viewMode === "list" ? 'flex flex-col md:flex-row md:items-center gap-4 p-4' : 'flex flex-col h-full'} cursor-pointer`} 
                    isDark={isDark}
                  >
                
                    <div className={`${viewMode === "list" ? 'w-full md:w-48 shrink-0' : 'w-full h-48'} relative overflow-hidden rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${getTypeColor(quiz._type, isDark)}`}>
                          <TypeIcon className="w-10 h-10" />
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isHot && <Badge type="hot" isDark={isDark}>🔥 HOT</Badge>}
                        {isNew && <Badge type="new" isDark={isDark}>✨ NEW</Badge>}
                        {quiz.reward > 0 && (
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                            isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-600 border-amber-200'
                          }`}>
                            <Trophy className="w-3 h-3 inline mr-1" />
                            {quiz.reward} pts
                          </span>
                        )}
                      </div>

                      
                      <div className="absolute top-3 right-3" ref={openMenuId === quiz.id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === quiz.id ? null : quiz.id);
                          }}
                          className={`p-2 rounded-lg backdrop-blur-md border transition-all ${
                            isDark 
                              ? 'bg-black/50 border-orange-500/30 text-white hover:bg-orange-500/20' 
                              : 'bg-white/80 border-orange-200 text-gray-700 hover:bg-orange-100'
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                       
                        <AnimatePresence>
                          {openMenuId === quiz.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 ${
                                isDark ? 'bg-black/95 border-orange-500/30' : 'bg-white border-orange-200'
                              }`}
                            >
                              <div className="p-2 space-y-1">
                                <button
                                  onClick={(e) => copyLink(quiz.id, e)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    copiedId === quiz.id 
                                      ? (isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-100')
                                      : (isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600')
                                  }`}
                                >
                                  {copiedId === quiz.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copiedId === quiz.id ? "Copied!" : "Copy Link"}
                                </button>
                                <button
                                  onClick={(e) => toggleSave(quiz.id, e)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isSaved
                                      ? (isDark ? 'text-orange-400 bg-orange-500/10' : 'text-orange-600 bg-orange-100')
                                      : (isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600')
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                                  {isSaved ? "Saved" : "Save Quiz"}
                                </button>
                                <button
                                  onClick={(e) => shareQuiz(quiz, e)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isDark ? 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                  }`}
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share
                                </button>
                                <div className={`border-t my-1 ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`} />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/join-quiz?id=${quiz.id}`);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                    isDark ? 'text-orange-400 hover:bg-orange-500/10' : 'text-orange-600 hover:bg-orange-50'
                                  }`}
                                >
                                  <Play className="w-4 h-4" />
                                  Start Quiz
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/80' : 'from-white/80'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4`}>
                        <Button variant="primary" className="shadow-xl" isDark={isDark}>
                          <Play className="w-4 h-4" />
                          Start Quiz
                        </Button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`flex-1 ${viewMode === "grid" ? 'p-4' : ''} flex flex-col`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-bold text-lg leading-tight line-clamp-2 ${isDark ? 'text-white group-hover:text-orange-400' : 'text-gray-900 group-hover:text-orange-600'} transition-colors`}>
                          {quiz.quiz_name}
                        </h3>
                      </div>

                      <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {quiz.material}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {quiz.quiz_tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            isDark ? 'bg-gray-900 border-orange-500/20 text-gray-400' : 'bg-gray-100 border-orange-100 text-gray-600'
                          }`}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className={`flex items-center gap-4 text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {formatNumber(quiz.completed)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {formatNumber(quiz.views)}
                        </span>
                        <span className={`flex items-center gap-1 ${isLiked ? 'text-rose-500' : ''}`}>
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                          {formatNumber(quiz.likes + (isLiked ? 1 : 0))}
                        </span>
                      </div>

                      {/* Footer Info */}
                      <div className={`mt-auto pt-3 border-t flex items-center justify-between ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                            {quiz.creator_id.charAt(1).toUpperCase()}
                          </div>
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {quiz.creator_id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {quiz.isTimed === 1 && (
                            <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                              <Timer className="w-3 h-3" />
                              {quiz.duration}m
                            </span>
                          )}
                          {quiz.isOneTime === 1 && (
                            <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                              <Lock className="w-3 h-3" />
                              1x
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeColor(quiz._type, isDark)}`}>
                            {quiz._type}
                          </span>
                        </div>
                      </div>

                      {/* Success Rate Bar (List View Only) */}
                      {viewMode === "list" && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1">
                            <div className={`h-1.5 rounded-full ${isDark ? 'bg-gray-900' : 'bg-gray-200'}`}>
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"
                                style={{ width: `${successRate}%` }}
                              />
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {successRate}% pass
                          </span>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredQuizzes.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="secondary" onClick={() => {}} isDark={isDark}>
              Load More Quizzes
            </Button>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => navigate('/create-quiz')}
        className={`fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40 ${
          isDark ? 'bg-orange-500 text-white shadow-orange-500/30' : 'bg-orange-500 text-white shadow-orange-500/30'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}