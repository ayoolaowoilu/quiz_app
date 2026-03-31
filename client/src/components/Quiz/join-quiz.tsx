import { useEffect, useState, useCallback ,useRef} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getQuizById, updateQuiz } from "../../lib/quiz";
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Clock, 
  Target, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Timer,
  Flame,
  BookOpen,
  ArrowLeft,
  Share2,
  Heart,

  Lock,
  LogIn,
  Eye,
  AlertCircle,
  Hash,
  CheckSquare,
  HelpCircle,
  MessageSquare,

  Sparkles,
  ChevronLeft,

  Crown,

  Moon,
  Sun,
  Check,
  RefreshCcwIcon,
  Book,
} from "lucide-react";
import { getUserData } from "../../lib/auth";

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
  comments: null | Comment[];
  time_posted: string;
  passingScore: string;
  likes: number;
}

interface Question {
  answer: string;
  question?: string;
  mcqoptions?: Record<string, string>;
  options?: string[];
}



interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  passed: boolean;
}

const AnimatedBackground = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-orange-50'}`}>
    <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/50 via-orange-50 to-white'}`} />
    <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-20' : 'opacity-40'}`} />
  </div>
);

// Dark Mode Toggle
const DarkModeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <button
    onClick={toggle}
    className={`fixed top-3 right-3 z-50 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
      isDark 
        ? 'bg-slate-900/80 border-orange-500/30 text-orange-400 hover:bg-slate-800' 
        : 'bg-white/80 border-orange-300 text-orange-600 hover:bg-white'
    }`}
  >
    <motion.div initial={false} animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.3 }}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </motion.div>
  </button>
);

// Glass Card
const GlassCard = ({ children, className = "", isDark = true }: { children: React.ReactNode; className?: string; isDark?: boolean }) => (
  <div className={`relative backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
    isDark 
      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
      : 'bg-white/80 border-slate-200 hover:border-orange-300'
  } ${className}`}>
    {children}
  </div>
);

// Button
const Button = ({ children, onClick, disabled = false, variant = "primary", className = "", isDark = true }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  isDark?: boolean;
}) => {
  const baseStyles = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary: isDark 
      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700" 
      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: isDark 
      ? "text-slate-400 hover:text-white hover:bg-slate-800" 
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function JoinQuiz() {
  const [quiz, setQuiz] = useState<Quiz_loaded | any>(null);
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exploreQuery, setExploreQuery] = useState("");


  const quiz_id = searchParams.get("id");

   const email = localStorage.getItem("email")
  const userId = localStorage.getItem("id")
  const username = localStorage.getItem("username")

  const displayName = username ? `@${username}` : `User${userId}`
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
 

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

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);



   const fetchData = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("id");
          const isAuthed = !!token && !!userId;
        

          const quizResp = await getQuizById(Number(quiz_id));
          console.log(quizResp)
          if(!quizResp){
                setStage(7)
                return
          }
       
          if (quizResp.questions && Array.isArray(quizResp.questions)) {
            quizResp.questions = quizResp.questions.map((q: any) => {
              
              const questionText = q.questions || q.question || "";
              
             
              let opts: string[] = [];
              if (quizResp._type === "MCQ" && q.mcqoptions && typeof q.mcqoptions === 'object') {
                opts = Object.values(q.mcqoptions);
              }
              
              return {
                ...q,
                question: questionText,
                options: opts,
               
                mcqoptions: q.mcqoptions,
                answer: q.answer
              };
            });
          } else {
            setStage(6);
            quizResp.questions = [];
          }
          
          setQuiz(quizResp);

          // ONLY for one-time quizzes: check auth and viewed status
          if (quizResp.isOneTime === 1) {
           
            if (!isAuthed) {
              setStage(5); 
              setIsLoading(false);
              return;
            }

            
            if (token) {
              try {
                const userResp = await getUserData(token);
                if (userResp?.viewed?.includes(Number(quiz_id))) {
                  setStage(4)
                  setIsLoading(false);
                  return;
                }
              } catch (err) {
                console.error("Error fetching user data:", err);
              }
            }
          }

          
          setStage(1);
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          setQuizResult(null);
          
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setStage(5);
        } finally {
          setIsLoading(false);
        }
      };


  useEffect(() => {
    if (quiz_id) {
     
      fetchData();
    }
  }, [quiz_id]);

  // Timer effect
  useEffect(() => {
    let interval:any;
    if (stage === 2 && quiz?.isTimed && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, quiz, timeRemaining]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const handleStartQuiz = () => {
    if (quiz?.isTimed) {
      setTimeRemaining(quiz.duration * 60);
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setStage(2);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async() => {
    if (!quiz) return;
    
    const timeTaken = quiz.isTimed ? (quiz.duration * 60) - timeRemaining : 0;
    let correctCount = 0;
    
    quiz.questions.forEach((q:any, index:any) => {
      const userAnswer = selectedAnswers[index];
      if (!userAnswer) return;
      
     
      if (quiz._type === "MCQ" && q.mcqoptions) {
        const correctValue = q.mcqoptions[q.answer];
        if (userAnswer === correctValue) correctCount++;
      } else {
        
        if (userAnswer?.toLowerCase().trim() === q.awnser?.toLowerCase().trim()) correctCount++;
      }
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= Number(quiz.passingScore);

   
      setIsLoading(true)
  const userrr=    await updateQuiz({id:quiz_id,failed: !passed ? 1 : 0 , passed:passed ? 1 : 0})
   setIsLoading(false)
   console.log(userrr) 
    
    setQuizResult({ score, correctAnswers: correctCount, totalQuestions: quiz.questions.length, timeTaken, passed });
    setStage(3);
 
  }, [quiz, selectedAnswers, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins}m ${seconds % 60}s` : `${seconds}s`;
  };

  const getQuizTypeDisplay = (type: string) => {
    switch(type) {
      case "TOF": return { label: "True/False", icon: HelpCircle, color: isDark ? "text-purple-400" : "text-purple-600", bg: isDark ? "bg-purple-500/10" : "bg-purple-100" };
      case "MCQ": return { label: "Multiple Choice", icon: CheckSquare, color: isDark ? "text-blue-400" : "text-blue-600", bg: isDark ? "bg-blue-500/10" : "bg-blue-100" };
      case "SAQ": return { label: "Short Answer", icon: MessageSquare, color: isDark ? "text-emerald-400" : "text-emerald-600", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-100" };
      default: return { label: "Quiz", icon: BookOpen, color: isDark ? "text-orange-400" : "text-orange-600", bg: isDark ? "bg-orange-500/10" : "bg-orange-100" };
    }
  };

  
  if (stage === 5) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <GlassCard className="w-full max-w-sm p-6 text-center" isDark={isDark}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">One-Time Quiz</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in required to take this one-time quiz and track your progress
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate("/signin")} className="w-full" isDark={isDark}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="ghost" onClick={() => navigate("/join-quiz")} className="w-full" isDark={isDark}>
              Back to Explore
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // STAGE 4: Quiz Restricted (One-time already taken - found in viewed)
  if (stage === 4) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <GlassCard className="w-full max-w-sm p-6 text-center" isDark={isDark}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-rose-500" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2 text-rose-500">Already Completed</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            You've already taken this one-time quiz
          </p>
          
          <Button onClick={() => navigate("/join")} className="w-full" isDark={isDark}>
            Explore Other Quizzes
          </Button>
        </GlassCard>
      </div>
    );
  }

    if (stage === 6) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <GlassCard className="w-full max-w-sm p-6 text-center" isDark={isDark}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
            <RefreshCcwIcon className="w-8 h-8 text-rose-500" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2 text-rose-500">Network Error</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
           No Internet connection
          </p>
          
          <Button onClick={() => fetchData()} className="w-full mb-4" isDark={isDark}>
             Try Again
          </Button>
          <Button onClick={() => navigate("/explore")} className="w-full" isDark={isDark}>
             Go To Explore page
          </Button>

        </GlassCard>
      </div>
    );
  }

    if (stage === 7) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <GlassCard className="w-full max-w-sm p-6 text-center" isDark={isDark}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
            <Book className="w-8 h-8 text-rose-500" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2 text-rose-500">Quiz Not Found</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
           The quiz you're looking for doesn't exist or has been removed.
          </p>
          
         
          <Button onClick={() => navigate("/explore")} className="w-full" isDark={isDark}>
             Go To Explore page
          </Button>

        </GlassCard>
      </div>
    );
  }

  // STAGE 1: Welcome/Explore (No ID)
  if (!quiz_id) {
    return (
      <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
       

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
                  { name: 'Home', href: '/home',  },
                  { name: 'Join Quiz', href: '/join-quiz' , active : true },
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
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
              <Sparkles className="w-3 h-3" />
              Live Challenges
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
             
              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Hyper.</span>
               <span className="text-orange-500">Quizzes</span>
            </h1>
            
            <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Enter a code to join or browse trending quizzes
            </p>

            <div className={`flex items-center rounded-xl border p-1.5 max-w-sm mx-auto ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Hash className="w-4 h-4 ml-3 text-orange-500" />
              <input
                type="text"
                placeholder="Quiz ID..."
                value={exploreQuery}
                onChange={(e) => setExploreQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && exploreQuery && navigate(`?id=${exploreQuery}`)}
                className={`flex-1 bg-transparent px-3 py-2 text-sm outline-none ${isDark ? 'text-slate-200 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
              />
              <Button 
                onClick={() => exploreQuery && navigate(`?id=${exploreQuery}`)} 
                disabled={!exploreQuery}
                className="px-3 py-1.5"
                isDark={isDark}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
{/* */}
       
           <div  onClick={()=>navigate("/explore")}>
               <GlassCard  className="p-4 cursor-pointer hover:scale-[1.02] transition-transform" isDark={isDark}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/10' : 'bg-orange-100'}`}>
                    <BookOpen className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-semibold">
                      <Flame className="w-3 h-3" /> HOT
                    </span>
                
                </div>
                
                <h3 className="font-semibold text-sm mb-1">Explore Quizzes </h3>
                <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Test your knowledge of core concepts
                </p>
                
                {/* <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 10</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5m</span>
                </div> */}
              </GlassCard>
           </div>
         
        </div>
      </div>
    );
  }

  if (isLoading || !quiz) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  const quizType = getQuizTypeDisplay(quiz._type);

  
  if (stage === 1) {
    const successRate = quiz.completed > 0 ? Math.round((quiz.passed / quiz.completed) * 100) : 0;
    
    return (
      <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/join-quiz")}
            className={`flex items-center gap-2 mb-4 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <GlassCard className="p-5 mb-4" isDark={isDark}>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${quizType.bg} ${quizType.color}`}>
                <quizType.icon className="w-3 h-3" />
                {quizType.label}
              </span>
              {quiz.isTimed === 1 && (
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                  <Timer className="w-3 h-3" />
                  Timed
                </span>
              )}
              {quiz.isOneTime === 1 && (
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-700'}`}>
                  <Lock className="w-3 h-3" />
                  One-time
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{quiz.quiz_name}</h1>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{quiz.material}</p>
            
            <div className="flex items-center gap-3 text-xs">
              <span className={`px-2.5 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                @{quiz.creator_id}
              </span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                {new Date(Number(quiz.time_posted)).toLocaleDateString()}
              </span>
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { icon: CheckSquare, label: "Qs", value: quiz.questions?.length || 0 },
              { icon: Clock, label: "Time", value: quiz.isTimed ? `${quiz.duration}m` : "∞" },
              { icon: Target, label: "Pass", value: `${quiz.passingScore}%` },
              { icon: Trophy, label: "Pts", value: quiz.reward },
            ].map((stat, idx) => (
              <GlassCard key={idx} className="p-3 text-center" isDark={isDark}>
                <stat.icon className={`w-4 h-4 mx-auto mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          {/* Rules */}
          <GlassCard className="p-4 mb-4" isDark={isDark}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Rules
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                <span>Need {quiz.passingScore}% to pass</span>
              </li>
              {quiz.isTimed === 1 && (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                  <span>{quiz.duration} min limit, auto-submits</span>
                </li>
              )}
              {quiz.isOneTime === 1 && (
                <li className="flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-rose-500">One attempt only</span>
                </li>
              )}
            </ul>
          </GlassCard>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleStartQuiz} className="flex-1" isDark={isDark}>
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button variant="secondary" className="w-12 shrink-0" isDark={isDark}>
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="secondary" className="w-12 shrink-0" isDark={isDark}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <GlassCard className="p-4 mt-4" isDark={isDark}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium">Success Rate</span>
              <span className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{successRate}%</span>
            </div>
            <div className={`h-1.5 rounded-full mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${successRate}%` }} />
            </div>
            <div className="flex gap-2 text-xs">
              <div className={`flex-1 p-2 rounded-lg text-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                <div className="font-bold">{quiz.passed}</div>
                <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Passed</div>
              </div>
              <div className={`flex-1 p-2 rounded-lg text-center ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-700'}`}>
                <div className="font-bold">{quiz.failed}</div>
                <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Failed</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }


  if (stage === 2 && quiz) {

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
   

 
    if (!currentQuestion) {
      return (
        <div className={`min-h-screen relative flex items-center justify-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <AnimatedBackground isDark={isDark} />
          <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
          <GlassCard className="p-6 text-center" isDark={isDark}>
            <p className="text-rose-500 mb-2">Error loading question</p>
            <p className="text-sm text-slate-500 mb-4">Question data not found</p>
            <Button onClick={() => setStage(1)} isDark={isDark}>Go Back</Button>
          </GlassCard>
        </div>
      );
    }

    const renderQuestionInput = () => {
      // Handle MCQ type
      if (quiz._type === "MCQ") {
     
        const options = currentQuestion.options || [];
        return (
          <div className="space-y-2">
            {options.map((option:any, idx:any) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-orange-500 bg-orange-500/10"
                      : isDark
                        ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                        : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Circle indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? "border-orange-500 bg-orange-500" 
                      : isDark ? "border-slate-600" : "border-slate-300"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-sm flex-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{option}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        );
      }
      
      // Handle TOF type
      if (quiz._type === "TOF") {
        return (
          <div className="grid grid-cols-2 gap-3">
            {["True", "False"].map((option) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isSelected
                      ? option === "True" 
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-rose-500 bg-rose-500/10"
                      : isDark
                        ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                        : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`text-2xl font-bold mb-1 ${isSelected ? (option === "True" ? "text-emerald-500" : "text-rose-500") : isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {option === "True" ? "✓" : "✗"}
                  </div>
                  <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{option}</div>
                </button>
              );
            })}
          </div>
        );
      }
      
      // Handle SAQ type
      if (quiz._type === "SAQ") {
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Type answer..."
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && hasAnswered && handleNext()}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
              }`}
            />
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Press Enter to continue</p>
          </div>
        );
      }

      // Unknown type
      return (
        <div className="text-center py-8 text-rose-500">
          Unknown quiz type: {quiz._type}
        </div>
      );
    };



    return (
      <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
       
        
        {/* Header */}
        <div className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowExitConfirm(true)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${quizType.bg} ${quizType.color}`}>
                  {quizType.label}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>

              {quiz.isTimed === 1 && (
                <div className={`px-2 py-1 rounded-md text-xs font-mono font-medium ${
                  timeRemaining < 60 
                    ? "bg-rose-500/20 text-rose-500 animate-pulse" 
                    : isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>
            
            <div className={`h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full bg-orange-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="space-y-4">
         

            
    <div className={`sticky top-0 z-40 space-y-6 backdrop-blur-md ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            <div>
                   Q{currentQuestionIndex + 1}:  {currentQuestion.question}
            </div>

              {renderQuestionInput()}
  
    <div className="flex items-center justify-between pt-4 gap-2">
              <Button 
                variant="ghost" 
                onClick={handlePrevious} 
                disabled={currentQuestionIndex === 0}
                className="px-4"
                isDark={isDark}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              
              {isLastQuestion ? (
                <Button onClick={handleSubmitQuiz} disabled={!hasAnswered} className="px-6" isDark={isDark}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={!hasAnswered} 
                  variant={hasAnswered ? "primary" : "secondary"}
                  className="px-6"
                  isDark={isDark}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

        </div>
          

            {/* Navigation */}
          
          </div>
        </div>

        {/* Exit Modal */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <GlassCard className="w-full max-w-xs p-5 text-center" isDark={isDark}>
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-rose-500" />
                <h3 className="text-lg font-semibold mb-2">Leave Quiz?</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Progress will be lost
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setShowExitConfirm(false)} className="flex-1" isDark={isDark}>
                    Stay
                  </Button>
                  <button
                    onClick={() => navigate("/join-quiz")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // STAGE 3: Results
  if (stage === 3 && quizResult) {
    return (
      <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
        <DarkModeToggle isDark={isDark} toggle={toggleDarkMode} />
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          <GlassCard className={`p-6 text-center mb-4 border-2 ${quizResult.passed ? 'border-emerald-500/30' : 'border-rose-500/30'}`} isDark={isDark}>
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${quizResult.passed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {quizResult.passed ? <Crown className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-rose-500" />}
            </div>

            <h1 className={`text-2xl font-bold mb-1 ${quizResult.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
              {quizResult.passed ? "Passed!" : "Failed"}
            </h1>
            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {quizResult.passed ? "Great job!" : "Keep practicing"}
            </p>

            <div className={`text-5xl font-bold mb-4 ${quizResult.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
              {quizResult.score}%
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Correct", value: `${quizResult.correctAnswers}/${quizResult.totalQuestions}` },
                { label: "Time", value: formatDuration(quizResult.timeTaken) },
                { label: "Points", value: `+${quizResult.passed ? quiz?.reward : 0}` },
              ].map((stat, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <div className="text-sm font-bold">{stat.value}</div>
                  <div className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate("/join-quiz")} className="flex-1" isDark={isDark}>
                Home
              </Button>
              <button
                onClick={() => {
                  setStage(1);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setQuizResult(null);
                }}
                disabled={quiz?.isOneTime === 1}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 ${
                  quizResult.passed 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {quiz?.isOneTime === 1 ? 'Done' : 'Retry'}
              </button>
            </div>
          </GlassCard>

          {/* Review */}
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Eye className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            Review
          </h3>
          
          <div className="space-y-2">
            {quiz?.questions?.map((q:any, idx:number) => {
              const userAnswer = selectedAnswers[idx];
              let isCorrect = false;
              
              if (quiz._type === "MCQ" && q.mcqoptions) {
                const correctValue = q.mcqoptions[q.answer];
                isCorrect = userAnswer === correctValue;
              } else {
                isCorrect = userAnswer?.toLowerCase().trim() === q.awnser?.toLowerCase().trim();
               
              }
              
              return (
                <GlassCard key={idx} className={`p-3 border-l-4 ${isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`} isDark={isDark}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{q.question}</p>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        You: <span className={isCorrect ? 'text-emerald-500' : 'text-rose-500'}>{userAnswer || "-"}</span>
                        {!isCorrect && (
                          <span className="text-emerald-500 ml-2">Correct: {quiz._type === "MCQ" && q.mcqoptions ? q.mcqoptions[q.answer] : q.awnser}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}