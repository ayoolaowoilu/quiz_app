import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg";
import {
  Search,
  Filter,
  Users,
  Trophy,
  Heart,
  Play,
  BookOpen,
  Grid,
  X,

  Type,
  Target,
  Plus,
  Bookmark,
  Clock,

  CircleQuestionMark,
} from "lucide-react";
import { fetchRandomQuizzes, fetchSearchByQuery } from "../../lib/quiz";
import SEO from "../seo";

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


// const DUMMY_QUIZZES: Quiz[] = [
//   { id: 1, _type: "MCQ", quiz_name: "JavaScript Fundamentals", creator_id: "@johndoe", material: "Core JS concepts and ES6+ features", saves: 234, views: 4520, reward: 10, completed: 1200, passed: 980, failed: 220, isOneTime: 0, isTimed: 1, duration: 15, quiz_tags: ["Coding", "Tech"], time_posted: String(Date.now() - 1000000), passingScore: "70", likes: 156 },
//   { id: 2, _type: "TOF", quiz_name: "World History Basics", creator_id: "@sarahsmith", material: "Ancient civilizations to modern era", saves: 189, views: 3200, reward: 0, completed: 890, passed: 650, failed: 240, isOneTime: 0, isTimed: 0, duration: 10, quiz_tags: ["History"], time_posted: String(Date.now() - 5000000), passingScore: "60", likes: 98 },
//   { id: 3, _type: "SAQ", quiz_name: "Python for Beginners", creator_id: "@mikejones", material: "Basic syntax and data structures", saves: 567, views: 8900, reward: 25, completed: 3400, passed: 2800, failed: 600, isOneTime: 1, isTimed: 1, duration: 20, quiz_tags: ["Coding", "Tech"], time_posted: String(Date.now() - 200000), passingScore: "80", likes: 423 },
//   { id: 4, _type: "MCQ", quiz_name: "Space Exploration", creator_id: "@emilychen", material: "NASA missions and solar system facts", saves: 445, views: 6700, reward: 15, completed: 2100, passed: 1800, failed: 300, isOneTime: 0, isTimed: 1, duration: 12, quiz_tags: ["Science"], time_posted: String(Date.now() - 800000), passingScore: "70", likes: 312 },
//   { id: 5, _type: "TOF", quiz_name: "Chemistry 101", creator_id: "@davidwilson", material: "Periodic table and chemical bonds", saves: 123, views: 2100, reward: 0, completed: 560, passed: 400, failed: 160, isOneTime: 0, isTimed: 0, duration: 8, quiz_tags: ["Science"], time_posted: String(Date.now() - 12000000), passingScore: "60", likes: 67 },
//   { id: 6, _type: "MCQ", quiz_name: "Literature Classics", creator_id: "@sarahsmith", material: "Shakespeare and modern literature", saves: 234, views: 3400, reward: 5, completed: 780, passed: 600, failed: 180, isOneTime: 0, isTimed: 1, duration: 15, quiz_tags: ["Arts"], time_posted: String(Date.now() - 3000000), passingScore: "70", likes: 145 },
//   { id: 7, _type: "SAQ", quiz_name: "Math Challenge", creator_id: "@johndoe", material: "Algebra and geometry problems", saves: 678, views: 12000, reward: 30, completed: 4500, passed: 3200, failed: 1300, isOneTime: 1, isTimed: 1, duration: 25, quiz_tags: ["Math"], time_posted: String(Date.now() - 150000), passingScore: "80", likes: 567 },
//   { id: 8, _type: "MCQ", quiz_name: "Geography Wonders", creator_id: "@emilychen", material: "Capitals, rivers, and mountains", saves: 345, views: 5600, reward: 10, completed: 1500, passed: 1200, failed: 300, isOneTime: 0, isTimed: 0, duration: 10, quiz_tags: ["Geography"], time_posted: String(Date.now() - 4000000), passingScore: "60", likes: 234 },
//   { id: 9, _type: "TOF", quiz_name: "Physics Principles", creator_id: "@mikejones", material: "Newton's laws and thermodynamics", saves: 289, views: 4300, reward: 20, completed: 1100, passed: 850, failed: 250, isOneTime: 0, isTimed: 1, duration: 18, quiz_tags: ["Science"], time_posted: String(Date.now() - 2500000), passingScore: "75", likes: 178 },
//   { id: 10, _type: "MCQ", quiz_name: "Art History", creator_id: "@davidwilson", material: "Renaissance to contemporary art", saves: 156, views: 2800, reward: 0, completed: 620, passed: 480, failed: 140, isOneTime: 0, isTimed: 0, duration: 12, quiz_tags: ["Arts"], time_posted: String(Date.now() - 6000000), passingScore: "60", likes: 89 },
//   { id: 11, _type: "SAQ", quiz_name: "Music Theory", creator_id: "@sarahsmith", material: "Scales, chords, and composition", saves: 412, views: 5200, reward: 12, completed: 1300, passed: 1000, failed: 300, isOneTime: 0, isTimed: 1, duration: 15, quiz_tags: ["Arts"], time_posted: String(Date.now() - 1800000), passingScore: "70", likes: 267 },
//   { id: 12, _type: "MCQ", quiz_name: "Biology Basics", creator_id: "@emilychen", material: "Cells, genetics, and ecosystems", saves: 523, views: 7800, reward: 18, completed: 2800, passed: 2300, failed: 500, isOneTime: 0, isTimed: 1, duration: 20, quiz_tags: ["Science"], time_posted: String(Date.now() - 900000), passingScore: "75", likes: 389 },
// ];



const AnimatedBackground = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
    <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`} />
    <div className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-40'}`} 
         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
  </div>
);

// Mature, minimal card design
const QuizCard = ({
  quiz,
  index,
  isDark,
  isSaved,
  isLiked,
  onSave,
  onLike,
  onPlay
}: {
  quiz: Quiz;
  index: number;
  isDark: boolean;
  isSaved: boolean;
  isLiked: boolean;
  onSave: (e: React.MouseEvent) => void;
  onLike: (e: React.MouseEvent) => void;
  onPlay: () => void;
}) => {
  const getTypeIcon = (type: QuizType) => {
    switch(type) {
      case "MCQ": return Grid;
      case "TOF": return Target;
      case "SAQ": return Type;
      default: return BookOpen;
    }
  };

  const getTypeLabel = (type: QuizType) => {
    switch(type) {
      case "MCQ": return "MCQ";
      case "TOF": return "T/F";
      case "SAQ": return "Short";
    }
  };

  const TypeIcon = getTypeIcon(quiz._type);
  const isNew = Date.now() - Number(quiz.time_posted) < 86400000;

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };
  

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="group"
    >
      <div 
        onClick={onPlay}
        className={`relative flex flex-col rounded-lg border transition-all duration-200 cursor-pointer h-full ${
          isDark 
            ? 'bg-slate-900/80 border-slate-700 hover:border-slate-500' 
            : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm'
        }`}
      >
        <div className="p-4 flex flex-col flex-1">
          {/* Header Row - Clean and minimal */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
            }`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              {quiz.reward > 0 && (
                <span className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 ${
                  isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Trophy className="w-3 h-3" />
                  {quiz.reward}
                </span>
              )}
              {isNew && (
                <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                  isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  New
                </span>
              )}
            </div>
          </div>

          {/* Title - Clean typography */}
          <h3 className={`font-semibold text-sm leading-snug mb-2 line-clamp-2 ${
            isDark ? 'text-slate-200 group-hover:text-slate-100' : 'text-slate-800 group-hover:text-slate-900'
          } transition-colors`}>
            {quiz.quiz_name}
          </h3>

          {/* Creator - Subtle */}
          <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            by {quiz.creator_id}
          </p>

          {/* Tags - Minimal */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {quiz.quiz_tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats Row - Clean icons */}
          <div className="mt-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                <Users className="w-3.5 h-3.5" />
                {formatNumber(quiz.completed)}
              </span>
              <span className={`flex items-center gap-1 ${ isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                <CircleQuestionMark className={`w-3.5 h-3.5 ${""}`} />
                {formatNumber(quiz.questions?.length || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}>
                {getTypeLabel(quiz._type)}
              </span>
              {quiz.isTimed === 1 && (
                <span className={`flex items-center gap-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {quiz.duration}m
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover Actions - Subtle */}
        <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t ${
          isDark ? 'from-slate-900 via-slate-900/95' : 'from-white via-white/95'
        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between`}>
          <div className="flex gap-1">
            <button
              onClick={onSave}
              className={`p-2 rounded-md transition-colors ${
                isSaved 
                  ? 'text-amber-500' 
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onLike}
              className={`p-2 rounded-md transition-colors ${
                isLiked 
                  ? 'text-rose-500' 
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
          <button className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-1.5 ${
            isDark 
              ? 'bg-slate-100 text-slate-900 hover:bg-white' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}>
            <Play className="w-3.5 h-3.5" />
            Play
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default function Explore() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<QuizType | "All">("All");
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "popular" | "reward">("trending");
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading ,setloading ] = useState(false)
 
  const [showFilters, setShowFilters] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<number[]>([]);
  const [likedQuizzes, setLikedQuizzes] = useState<number[]>([]);
  const  [fetchedQuery,setFetchedQuery] = useState<Quiz[]>([])

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const displayName = username ? `@${username}` : `User${userId}`;
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase();

  const categories = ["All", "Science", "History", "Technology", "Sports", "Arts", "Geography", "Math", "Language"];
  const types: { value: QuizType | "All"; label: string }[] = [
    { value: "All", label: "All Types" },
    { value: "MCQ", label: "Multiple Choice" },
    { value: "TOF", label: "True / False" },
    { value: "SAQ", label: "Short Answer" },
  ];

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  

  // Filter and sort
  const filteredFetchQuery = useMemo(() => {
    let result = [...fetchedQuery];
    
    // if (searchQuery) {
    //   result = result?.filter(q => 
    //     q.quiz_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    //     q.creator_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    //     q.quiz_tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
    //   );
    // }
    
    if (selectedCategory !== "All") {
      result = result.filter(q => q.quiz_tags?.includes(selectedCategory));
    }
    
    if (selectedType !== "All") {
      result = result.filter(q => q?._type === selectedType);
    }
    
    switch (sortBy) {
      case "trending":
        result?.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
        break;
      case "newest":
        result?.sort((a, b) => Number(b.time_posted) - Number(a.time_posted));
        break;
      case "popular":
        result?.sort((a, b) => b.completed - a.completed);
        break;
      case "reward":
        result?.sort((a, b) => b.reward - a.reward);
        break;
    }
    
    return result;
  }, [quizzes, searchQuery, selectedCategory, selectedType, sortBy]);
  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes];
    
    if (searchQuery) {
      result = result?.filter(q => 
        q.quiz_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        q.creator_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        q.quiz_tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "All") {
      result = result.filter(q => q.quiz_tags?.includes(selectedCategory));
    }
    
    if (selectedType !== "All") {
      result = result.filter(q => q?._type === selectedType);
    }
    
    switch (sortBy) {
      case "trending":
        result?.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
        break;
      case "newest":
        result?.sort((a, b) => Number(b.time_posted) - Number(a.time_posted));
        break;
      case "popular":
        result?.sort((a, b) => b.completed - a.completed);
        break;
      case "reward":
        result?.sort((a, b) => b.reward - a.reward);
        break;
    }
    
    return result;
  }, [quizzes, searchQuery, selectedCategory, selectedType, sortBy]);

  const visibleFetchedQuery = useMemo(() => {
    return filteredFetchQuery
  }, [filteredFetchQuery, visibleCount]);
  const visibleQuizzes = useMemo(() => {
    return filteredQuizzes;
  }, [filteredQuizzes, visibleCount]);



  // Effects
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  const fetchSearchQuery = useCallback(async()=>{
      try {
          setloading(true)
          setVisibleCount(12)
           const resp = await fetchSearchByQuery(searchQuery)
              setFetchedQuery(resp)
              setloading(false)
      } catch (error) {
        console.log(error)
      }
  },[searchQuery])
 useEffect(()=>{
     if(searchQuery !== ""){
          fetchSearchQuery()
     }else{
          setFetchedQuery([])
     } 
 },[searchQuery])
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
const FetchData = async()=>{
  try {
       setloading(true)
   const resp = await fetchRandomQuizzes();
     console.log(resp)
    resp.forEach((resp:any )=> {
      
      const find = quizzes.find(q => q.id === resp.id);
      
      if (!find) {
        setQuizzes(prev => [...prev, resp]);
        setloading(false)
      }else {
        setQuizzes(prev => prev.map(q => q.id === resp.id ? resp : q));
         setloading(false)
      }

    });
  } catch (error) {
    console.log(error)
     setloading(false)
  }
   
}

useEffect(()=>{
    FetchData()
},[])



  const toggleTheme = () => setIsDark(!isDark);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedQuizzes(prev => prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]);
  };

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedQuizzes(prev => prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]);
  };

  const navigateToQuiz = (id: number) => {
    navigate(`/join-quiz?id=${id}`);
  };

  const loadMore = () => {
       FetchData();
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      <AnimatedBackground isDark={isDark} />
       <SEO
        title="Explore Popular Quizzes" 
        description="discover Popular quizzes" 
      />
      {/* Header - Clean, Professional */}
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

      <div className="h-16" />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
       
        <div className="mb-8">
          <h1 className={`text-2xl font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Explore Quizzes
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Discover and play quizzes from the community
          </p>
        </div>

        {/* Search & Filters - Clean Design */}
        <div className={`mb-6 p-4 rounded-lg border ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className={`flex-1 flex items-center rounded-md border px-3 py-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Search className={`w-4 h-4 mr-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes, creators, or tags..."
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-slate-200 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={`p-1 rounded ${isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-200'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden px-4 py-2.5 rounded-md border text-sm font-medium flex items-center justify-center gap-2 ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2.5 rounded-md border text-sm outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as QuizType | "All")}
                className={`px-3 py-2.5 rounded-md border text-sm outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {types.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2.5 rounded-md border text-sm outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Played</option>
                <option value="reward">Highest Reward</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-3 pt-3 border-t grid grid-cols-2 gap-2"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-md border text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as QuizType | "All")}
                  className={`px-3 py-2 rounded-md border text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  {types.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-3 py-2 rounded-md border text-sm col-span-2 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Played</option>
                  <option value="reward">Highest Reward</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4">
        {fetchedQuery.length ? (  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Showing <span className="font-medium text-slate-700">{visibleFetchedQuery.length}</span> of <span className="font-medium">{fetchedQuery.length}</span> quizzes
          </p>) : (  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Showing <span className="font-medium text-slate-700">{visibleQuizzes.length}</span> of <span className="font-medium">{filteredQuizzes.length}</span> quizzes
          </p>)}
          <div className="flex gap-2">
            {selectedCategory !== "All" && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedType !== "All" && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {types.find(t => t.value === selectedType)?.label}
                <button onClick={() => setSelectedType("All")} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>

        {/* Quiz Grid - Compact Professional */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <Search className={`w-8 h-8 ${isDark ? 'text-slate-700' : 'text-slate-400'}`} />
            </div>
            <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>No quizzes found</h3>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Check Internet Connection or Try adjusting your search or filters</p>
            {loading && (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              
          </div>
        ) :  fetchedQuery.length  ? (  <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleFetchedQuery.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    index={index}
                    isDark={isDark}
                    isSaved={savedQuizzes.includes(quiz.id)}
                    isLiked={likedQuizzes.includes(quiz.id)}
                    onSave={(e) => toggleSave(quiz.id, e)}
                    onLike={(e) => toggleLike(quiz.id, e)}
                    onPlay={() => navigateToQuiz(quiz.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

              <div className="mx-auto justify-center">
                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>

          
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Load More
                </button>
              </div>
          
          </>) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {quizzes.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    index={index}
                    isDark={isDark}
                    isSaved={savedQuizzes.includes(quiz.id)}
                    isLiked={likedQuizzes.includes(quiz.id)}
                    onSave={(e) => toggleSave(quiz.id, e)}
                    onLike={(e) => toggleLike(quiz.id, e)}
                    onPlay={() => navigateToQuiz(quiz.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

              <div className="mx-auto justify-center">
                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>

          
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Load More
                </button>
              </div>
          
          </>
        )}
      </main>

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

      {/* Mobile FAB - Subtle */}
      <button
        onClick={() => navigate('/create-quiz')}
        className={`fixed bottom-6 right-6 lg:hidden w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40 ${
          isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-900 text-white'
        }`}
      >
        <Plus className="w-5 h-5" />
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
