import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg";
import {
  Plus,
  Trash2,

  Lock,
  Trophy,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Type,
  List,
  HelpCircle,
  Timer,

  CheckSquare,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  Moon,
  Sun,

  Copy,
  Check,
  Settings,
  Tag,
  BarChart3,
  Loader2,
} from "lucide-react";
import { getUserData } from "../../lib/auth";
import { Add_quiz } from "../../lib/quiz";

type QuizType = "TOF" | "MCQ" | "SAQ";

interface Question {
  id: string;
  question: string;
  answer: string;
  options?: string[];
}



const AnimatedBackground = ({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-orange-50'}`}>
    <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/50 via-orange-50 to-white'}`} />
    <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-20' : 'opacity-40'}`} />
  </div>
);

const GlassCard = ({ children, className = "", isDark = true }: { children: React.ReactNode; className?: string; isDark?: boolean }) => (
  <div className={`relative backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
    isDark 
      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
      : 'bg-white/80 border-slate-200 hover:border-orange-300'
  } ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, variant = "primary", className = "", isDark = true, type = "button" }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  isDark?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  const baseStyles = "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary: isDark 
      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700" 
      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: isDark 
      ? "text-slate-400 hover:text-white hover:bg-slate-800" 
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  isDark = true,
  error,
  helper
}: { 
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  isDark?: boolean;
  error?: string;
  helper?: string;
}) => (
  <div className="space-y-1.5">
    <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all ${
        error 
          ? 'border-rose-500 focus:border-rose-500' 
          : isDark 
            ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50' 
            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
      }`}
    />
    {error && <p className="text-xs text-rose-500">{error}</p>}
    {helper && !error && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{helper}</p>}
  </div>
);

const Toggle = ({ 
  label, 
  checked, 
  onChange, 
  isDark = true,
  icon: Icon
}: { 
  label: string; 
  checked: boolean; 
  onChange: (val: boolean) => void;
  isDark?: boolean;
  icon?: any;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between w-full p-3 rounded-xl border-2 transition-all ${
      checked 
        ? 'border-orange-500 bg-orange-500/10' 
        : isDark 
          ? 'border-slate-800 bg-slate-900/30' 
          : 'border-slate-200 bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`w-4 h-4 ${checked ? 'text-orange-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />}
      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-orange-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </div>
  </button>
);

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quizId, setQuizId] = useState<number | null>(null);

  // Quiz Settings - Strictly following Quiz_loaded interface
  const [quizType, setQuizType] = useState<QuizType>("MCQ");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isTimed, setIsTimed] = useState(false);
  const [duration, setDuration] = useState(10);
  const [isOneTime, setIsOneTime] = useState(false);
  const [passingScore, setPassingScore] = useState(70);

  // Questions - Strictly following Question interface
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const displayName = username ? `@${username}` : `User${userId}`;
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase();

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  // Generate random reward between 1-60 only if isOneTime is true
  const generateReward = () => {
    return isOneTime ? Math.floor(Math.random() * 60) + 1 : 0;
  };

  // Question Management - Strictly single type per quiz
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      answer: "",
      options: quizType === "MCQ" ? ["", "", "", ""] : undefined,
    };
    setCurrentQuestion(newQuestion);
    setEditingId(null);
  };

  const saveQuestion = () => {
    if (!currentQuestion?.question.trim() || !currentQuestion?.answer.trim()) return;
    
    if (editingId) {
      setQuestions(questions.map(q => q.id === editingId ? currentQuestion : q));
    } else {
      setQuestions([...questions, currentQuestion]);
    }
    setCurrentQuestion(null);
    setEditingId(null);
  };

  const editQuestion = (question: Question) => {
    setCurrentQuestion({ ...question });
    setEditingId(question.id);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (question: Question) => {
    const newQ = { ...question, id: Date.now().toString() };
    setQuestions([...questions, newQ]);
  };

  const updateOption = (index: number, value: string) => {
    if (!currentQuestion || quizType !== "MCQ") return;
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

 
  const buildQuizPayload = () => {
    const reward = generateReward();
    
    const formattedQuestions = questions.map(q => {
      const base = {
        question: q.question,
        answer: q.answer,
      };
      
      if (quizType === "MCQ" && q.options) {
        return {
          ...base,
          mcqoptions: {
            o1: q.options[0] || "",
            o2: q.options[1] || "",
            o3: q.options[2] || "",
            o4: q.options[3] || "",
          },
        };
      }
      
      return base;
    });
 const token = localStorage.getItem("token")
    getUserData(token).catch((error)=>{
         console.log("Internet error Try again"+error)
         return
    })
const userid = localStorage.getItem("id")

    return {
      type: quizType,
      name: title,
      material: description,
      isOneTime: isOneTime ? 1 : 0,
      isTimed: isTimed ? 1 : 0,
      duration: isTimed ? duration : 0,
      passing_score: passingScore,
      reward: reward,
      tags: tags,
      questions: formattedQuestions,
      time:Date.now(),
      creator_id:Number(userid)
    };
  };

  const handlePublish = async () => {
    setIsLoading(true);
    const payload = buildQuizPayload();
    
    
   
    const resp = await Add_quiz(payload)
    console.log(resp)
    
    
    const mockId = resp.quizId;
    setQuizId(mockId);
    setIsLoading(false);
    setStep(3);
  };

  const copyQuizLink = () => {
    if (quizId) {
      navigator.clipboard.writeText(`https://hyperquizzes.netlify.app/join-quiz?id=${quizId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getQuizTypeIcon = (type: QuizType) => {
    switch(type) {
      case "MCQ": return CheckSquare;
      case "TOF": return HelpCircle;
      case "SAQ": return MessageSquare;
      default: return BookOpen;
    }
  };

  const getQuizTypeColor = (type: QuizType, isDark: boolean) => {
    switch(type) {
      case "MCQ": return isDark ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-100";
      case "TOF": return isDark ? "text-purple-400 bg-purple-500/10" : "text-purple-600 bg-purple-100";
      case "SAQ": return isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-600 bg-emerald-100";
    }
  };

  const getQuizTypeLabel = (type: QuizType) => {
    switch(type) {
      case "MCQ": return "Multiple Choice";
      case "TOF": return "True / False";
      case "SAQ": return "Short Answer";
    }
  };

  // Validation
  const canProceedToQuestions = title.trim().length >= 3 && quizType;
  const canPublish = questions.length > 0 && questions.every(q => q.question.trim() && q.answer.trim());

  return (
    <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      <AnimatedBackground isDark={isDark} />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? (isDark ? 'bg-slate-950/95 shadow-lg shadow-orange-500/10 border-slate-800' : 'bg-white/95 shadow-md shadow-orange-500/10 border-slate-200') 
          : (isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200')
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
                <span className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Hyper<span className="text-orange-500">Quizzes</span>
                </span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {[
                  { name: 'Home', href: '/home' },
                  { name: 'Join Quiz', href: '/join-quiz' },
                  { name: 'Create Quiz', href: '/create-quiz', active: true },
                  { name: 'Stats', href: '/stats' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                      item.active 
                        ? 'text-orange-500' 
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
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
                    isDark ? 'bg-slate-900 text-orange-400 border-slate-800 hover:border-orange-500/50' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border ${
                      isDark ? 'bg-slate-900/80 border-slate-800 hover:border-orange-500/60' : 'bg-white border-slate-200 hover:border-orange-300'
                    } ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'} ${profileOpen ? '-rotate-90' : ''}`} />
                  </button>

                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${
                    profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  } ${isDark ? 'bg-slate-950/95 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
                          <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <a href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isDark ? 'text-slate-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}>
                        <Type className="w-5 h-5" />
                        Profile Settings
                      </a>
                      <a href="/stats" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isDark ? 'text-slate-300 hover:bg-orange-500/10 hover:text-orange-400' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}>
                        <BarChart3 className="w-5 h-5" />
                        My Stats
                      </a>
                      <div className={`my-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
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
                isDark ? 'bg-slate-900 text-orange-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg transition-colors duration-300 border ${
                isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <nav className="flex flex-col gap-2">
                {['Home', 'Join Quiz', 'Create Quiz', 'Stats'].map((item) => (
                  <a key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    item === 'Create Quiz' 
                      ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600') 
                      : (isDark ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100')
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                    : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all ${
                    step > s ? 'bg-orange-500' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {step === 1 ? "Quiz Settings" : step === 2 ? "Add Questions" : "Quiz Published!"}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {step === 1 ? "Configure your quiz details" : step === 2 ? `${getQuizTypeLabel(quizType)} • ${questions.length} question${questions.length !== 1 ? 's' : ''}` : "Your quiz is ready to share"}
            </p>
          </div>
        </div>

        {/* Step 1: Settings */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Quiz Type Selection - LOCKED after selection in step 2 */}
            <GlassCard className="p-6" isDark={isDark}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Settings className="w-4 h-4 text-orange-500" />
                Quiz Type <span className="text-rose-500">*</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["MCQ", "TOF", "SAQ"] as QuizType[]).map((type) => {
                  const Icon = getQuizTypeIcon(type);
                  const isSelected = quizType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setQuizType(type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10'
                          : isDark 
                            ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700' 
                            : 'border-slate-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${getQuizTypeColor(type, isDark)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? (isDark ? 'text-orange-400' : 'text-orange-600') : (isDark ? 'text-slate-400' : 'text-slate-600')}`}>
                        {getQuizTypeLabel(type)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                <AlertCircle className="w-3 h-3 inline mr-1" />
                You cannot mix question types. All questions must be {getQuizTypeLabel(quizType)}.
              </p>
            </GlassCard>

            <GlassCard className="p-6" isDark={isDark}>
              <div className="space-y-6">
                <Input
                  label="Quiz Title"
                  value={title}
                  onChange={setTitle}
                  placeholder="Enter an engaging title..."
                  isDark={isDark}
                  error={title.length > 0 && title.length < 3 ? "Title must be at least 3 characters" : undefined}
                />

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Description / Material
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this quiz about?"
                    rows={3}
                    className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all resize-none ${
                      isDark 
                        ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-rose-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val && !tags.includes(val)) {
                          setTags([...tags, val]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
                    }`}
                  />
                </div>
              </div>
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-4">
              <GlassCard className="p-4" isDark={isDark}>
                <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Settings className="w-4 h-4 text-orange-500" />
                  Quiz Rules
                </h3>
                <div className="space-y-3">
                  <Toggle
                    label="Timed Quiz"
                    checked={isTimed}
                    onChange={setIsTimed}
                    isDark={isDark}
                    icon={Timer}
                  />
                  
                  {isTimed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-4 border-l-2 border-orange-500/30"
                    >
                      <Input
                        label="Duration (minutes)"
                        value={duration}
                        onChange={(val) => setDuration(parseInt(val) || 0)}
                        type="number"
                        isDark={isDark}
                      />
                    </motion.div>
                  )}

                  <Toggle
                    label="One-time Only"
                    checked={isOneTime}
                    onChange={setIsOneTime}
                    isDark={isDark}
                    icon={Lock}
                  />
                  
                  {isOneTime && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-3 rounded-lg text-xs ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}
                    >
                      <Trophy className="w-3 h-3 inline mr-1" />
                      Reward will be randomly generated (1-60 points)
                    </motion.div>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-4" isDark={isDark}>
                <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Trophy className="w-4 h-4 text-orange-500" />
                  Passing Criteria
                </h3>
                <Input
                  label="Passing Score (%)"
                  value={passingScore}
                  onChange={(val) => setPassingScore(Math.min(100, Math.max(0, parseInt(val) || 0)))}
                  type="number"
                  isDark={isDark}
                  helper="Minimum percentage required to pass"
                />
              </GlassCard>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!canProceedToQuestions}
                isDark={isDark}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Questions */}
        {step === 2 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar - Question List */}
            <div className="lg:col-span-1 space-y-4">
              <GlassCard className="p-4" isDark={isDark}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Questions ({questions.length})
                    </h3>
                    <p className={`text-xs ${getQuizTypeColor(quizType, isDark)} inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded`}>
                      {(() => {
                        const Icon = getQuizTypeIcon(quizType);
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {getQuizTypeLabel(quizType)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {questions.length === 0 ? (
                    <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No questions yet
                    </div>
                  ) : (
                    questions.map((q, idx) => {
                     
                      return (
                        <div
                          key={q.id}
                          onClick={() => editQuestion(q)}
                          className={`group p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            editingId === q.id 
                              ? 'border-orange-500 bg-orange-500/10' 
                              : isDark 
                                ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700' 
                                : 'border-slate-200 bg-white hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`text-xs font-bold mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                {q.question || "Untitled question"}
                              </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => { e.stopPropagation(); duplicateQuestion(q); }}
                                className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                                className="p-1 rounded hover:bg-rose-500/20 text-rose-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-slate-700">
                  <Button 
                    onClick={addQuestion} 
                    variant="secondary" 
                    className="w-full"
                    isDark={isDark}
                  >
                    <Plus className="w-4 h-4" />
                    Add {getQuizTypeLabel(quizType)} Question
                  </Button>
                </div>
              </GlassCard>

              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setStep(1)} 
                  className="flex-1"
                  isDark={isDark}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={!canPublish || isLoading}
                  className="flex-1"
                  isDark={isDark}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Main - Question Editor */}
            <div className="lg:col-span-2">
              {!currentQuestion ? (
                <GlassCard className="h-full min-h-[400px] flex items-center justify-center" isDark={isDark}>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      <Plus className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Click "Add Question" to create a new {getQuizTypeLabel(quizType)} question
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard className="p-6" isDark={isDark}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getQuizTypeIcon(quizType);
                        return (
                          <div className={`p-2 rounded-lg ${getQuizTypeColor(quizType, isDark)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        );
                      })()}
                      <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {editingId ? "Edit" : "New"} {getQuizTypeLabel(quizType)}
                      </span>
                    </div>
                    <Button variant="ghost" onClick={() => { setCurrentQuestion(null); setEditingId(null); }} isDark={isDark}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Question <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        placeholder="Enter your question..."
                        rows={2}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all resize-none ${
                          isDark 
                            ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50' 
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
                        }`}
                      />
                    </div>

                    {/* MCQ Options - Strictly o1, o2, o3, o4 format */}
                    {quizType === "MCQ" && (
                      <div className="space-y-3">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Options (o1, o2, o3, o4) <span className="text-rose-500">*</span>
                        </label>
                        {currentQuestion.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentQuestion({ ...currentQuestion, answer: option })}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                currentQuestion.answer === option
                                  ? 'border-orange-500 bg-orange-500'
                                  : isDark ? 'border-slate-600' : 'border-slate-300'
                              }`}
                            >
                              {currentQuestion.answer === option && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span className={`text-xs font-mono w-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              o{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(idx, e.target.value)}
                              placeholder={`Option ${idx + 1}`}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm outline-none transition-all ${
                                isDark 
                                  ? 'bg-slate-900/50 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-orange-500/50' 
                                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-orange-400'
                              }`}
                            />
                          </div>
                        ))}
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          Click the circle to mark the correct answer
                        </p>
                      </div>
                    )}

                    {/* True/False - Stored as "True" or "False" */}
                    {quizType === "TOF" && (
                      <div className="space-y-3">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Correct Answer <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {["True", "False"].map((val) => (
                            <button
                              key={val}
                              onClick={() => setCurrentQuestion({ ...currentQuestion, answer: val })}
                              className={`p-4 rounded-xl border-2 text-center transition-all ${
                                currentQuestion.answer === val
                                  ? val === "True" 
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                    : 'border-rose-500 bg-rose-500/10 text-rose-500'
                                  : isDark 
                                    ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="text-2xl font-bold mb-1">{val === "True" ? "✓" : "✗"}</div>
                              <div className="text-sm font-medium">{val}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short Answer */}
                    {quizType === "SAQ" && (
                      <div className="space-y-3">
                        <Input
                          label="Correct Answer"
                          value={currentQuestion.answer}
                          onChange={(val) => setCurrentQuestion({ ...currentQuestion, answer: val })}
                          placeholder="Enter the correct answer..."
                          isDark={isDark}
                          helper="Answer is case-insensitive"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-dashed border-slate-700">
                      <Button variant="ghost" onClick={() => { setCurrentQuestion(null); setEditingId(null); }} isDark={isDark}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={saveQuestion} 
                        disabled={!currentQuestion.question.trim() || !currentQuestion.answer.trim()}
                        isDark={isDark}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {editingId ? "Update" : "Save"} Question
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <GlassCard className="p-8" isDark={isDark}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Quiz Published!
              </h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your {getQuizTypeLabel(quizType)} quiz is now live
              </p>

              {isOneTime && (
                <div className={`p-3 rounded-xl mb-6 ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                  <Trophy className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className={`text-sm font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                    Reward: {generateReward()} points
                  </p>
                
                </div>
              )}

              <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Quiz Link
                </p>
                <div className="flex items-center gap-2">
                  <code className={`flex-1 px-3 py-2 rounded-lg text-sm font-mono break-all ${
                    isDark ? 'bg-slate-950 text-orange-400' : 'bg-white text-orange-600'
                  }`}>
                    hyperquizzes.netlify.app/join-quiz?id={quizId}
                  </code>
                  <Button onClick={copyQuizLink} variant="secondary" className="shrink-0" isDark={isDark}>
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate('/home')} className="flex-1" isDark={isDark}>
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </Button>
                <Button onClick={() => navigate(`/join-quiz?id=${quizId}`)} className="flex-1" isDark={isDark}>
                  <CheckCircle2 className="w-4 h-4" />
                  View Quiz
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}