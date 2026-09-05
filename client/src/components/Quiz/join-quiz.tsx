import { useEffect, useState, useCallback, useRef, type SVGProps } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getQuizById, getUserNameById, like_quiz, updateQuiz } from "../../lib/quiz";
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import { motion, AnimatePresence } from "framer-motion";
import { getUserData } from "../../lib/auth";
import SEO from "../seo";
import { Users } from "lucide-react";

/* =========================================================================
   ICONS — hand-drawn raw SVGs (no icon library). Same component names as
   before, so every existing <IconName /> usage below keeps working as-is.
   ========================================================================= */

type IconProps = SVGProps<SVGSVGElement>;

const IconBase = ({ children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

const Trophy = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3" />
    <path d="M17 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
    <path d="M12 13v3" />
    <path d="M9 20h6" />
    <path d="M10 16.5h4l.5 3.5h-5l.5-3.5Z" />
  </IconBase>
);

const Clock = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </IconBase>
);

const Target = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </IconBase>
);

const Play = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />
  </IconBase>
);

const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 5l7 7-7 7" />
  </IconBase>
);

const ChevronLeft = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M15 5l-7 7 7 7" />
  </IconBase>
);

const CheckCircle2 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.3 2.3L16 10" />
  </IconBase>
);

const XCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
  </IconBase>
);

const Timer = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M10 2h4" />
    <circle cx="12" cy="14" r="8" />
    <path d="M12 10v4l3 2" />
  </IconBase>
);

const Flame = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.5-2-1-2 1 4-1 6-3 6a4 4 0 0 1-4-4c0-3 2-4 2-7Z" />
  </IconBase>
);

const BookOpen = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 6c-1.5-1.3-3.7-2-6-2v13c2.3 0 4.5.7 6 2 1.5-1.3 3.7-2 6-2V4c-2.3 0-4.5.7-6 2Z" />
    <path d="M12 6v13" />
  </IconBase>
);

const Book = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 4a2 2 0 0 1 2-2h11v18H7a2 2 0 0 0-2 2V4Z" />
    <path d="M8 6h6" />
    <path d="M8 9h6" />
  </IconBase>
);

const ArrowLeft = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </IconBase>
);

const Share2 = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.3 10.7l7.4-4.4" />
    <path d="M8.3 13.3l7.4 4.4" />
  </IconBase>
);

const Heart = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 20.5s-7-4.4-9.5-9C.9 8 2 4.5 5.3 3.7c2-.5 3.9.3 5.2 1.9.4.5.9.5 1.3 0 1.3-1.6 3.2-2.4 5.2-1.9C20.5 4.5 21.6 8 20 11.5c-2.5 4.6-8 9-8 9Z" />
  </IconBase>
);

const Lock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="4" y="10.5" width="16" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </IconBase>
);

const LogIn = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
    <path d="M15 8l4 4-4 4" />
    <path d="M19 12H9" />
  </IconBase>
);

const Eye = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.7" />
  </IconBase>
);

const AlertCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v6" />
    <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
  </IconBase>
);

const Hash = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 3l-2 18" />
    <path d="M17 3l-2 18" />
    <path d="M3.5 9h17" />
    <path d="M2.5 15h17" />
  </IconBase>
);

const CheckSquare = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M7.5 12.5l3 3 6-6.5" />
  </IconBase>
);

const HelpCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.9.5-1.1.9-1.1 1.8" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </IconBase>
);

const MessageSquare = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 4h16v11H8l-4 4V4Z" />
  </IconBase>
);

const Sparkles = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3l1.4 3.9L17 8.5l-3.6 1.6L12 14l-1.4-3.9L7 8.5l3.6-1.6L12 3Z" fill="currentColor" stroke="none" />
    <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" fill="currentColor" stroke="none" />
    <path d="M5 15l.6 1.6L7 17.2l-1.4.6L5 19.4l-.6-1.6L3 17.2l1.4-.6L5 15Z" fill="currentColor" stroke="none" />
  </IconBase>
);

const Crown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 18h16l1-9-5 3.5L12 6l-4 6.5L3 9l1 9Z" />
    <path d="M4 21h16" />
  </IconBase>
);

const Moon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </IconBase>
);

const Sun = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </IconBase>
);

const Check = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </IconBase>
);

const RefreshCcwIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3.5 12a8.5 8.5 0 0 1 14.4-6.1M20.5 12a8.5 8.5 0 0 1-14.4 6.1" />
    <path d="M17.5 3v3.5H14" />
    <path d="M6.5 21v-3.5H10" />
  </IconBase>
);



const APP_DB_NAME = "hyperquizzes-db";
const TAKEN_STORE_NAME = "taken_quizzes";
const SESSION_STORE_NAME = "quiz_sessions";
// Bumped from 1 -> 2 to add the quiz_sessions store alongside the existing taken_quizzes store.
const APP_DB_VERSION = 2;

interface TakenQuizRecord {
  id: number;
  quiz_name: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  quizType: string;
  dateTaken: number;
}

// A session is the "resume point" for a quiz that's in progress: which question
// the user is on, what they've answered so far, and how much time is left.
// Keyed by quiz id, so a hard refresh / accidental close / crash can pick back
// up exactly where the user left off instead of restarting the quiz.
interface QuizSessionRecord {
  id: number; // quiz_id
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  timeRemaining: number | null; // null when the quiz isn't timed
  startedAt: number;
  lastUpdated: number;
}

function openAppDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const request = indexedDB.open(APP_DB_NAME, APP_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TAKEN_STORE_NAME)) {
        const store = db.createObjectStore(TAKEN_STORE_NAME, { keyPath: "id" });
        store.createIndex("dateTaken", "dateTaken");
      }
      if (!db.objectStoreNames.contains(SESSION_STORE_NAME)) {
        db.createObjectStore(SESSION_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveTakenQuiz(record: TakenQuizRecord): Promise<void> {
  try {
    const db = await openAppDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(TAKEN_STORE_NAME, "readwrite");
      tx.objectStore(TAKEN_STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to save taken quiz to IndexedDB:", err);
  }
}

async function getAllTakenQuizzes(): Promise<TakenQuizRecord[]> {
  try {
    const db = await openAppDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(TAKEN_STORE_NAME, "readonly");
      const req = tx.objectStore(TAKEN_STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to load taken quizzes from IndexedDB:", err);
    return [];
  }
}

async function saveQuizSession(record: QuizSessionRecord): Promise<void> {
  try {
    const db = await openAppDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSION_STORE_NAME, "readwrite");
      tx.objectStore(SESSION_STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to save quiz session to IndexedDB:", err);
  }
}

async function getQuizSession(quizId: number): Promise<QuizSessionRecord | undefined> {
  try {
    const db = await openAppDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(SESSION_STORE_NAME, "readonly");
      const req = tx.objectStore(SESSION_STORE_NAME).get(quizId);
      req.onsuccess = () => resolve(req.result || undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to load quiz session from IndexedDB:", err);
    return undefined;
  }
}

async function deleteQuizSession(quizId: number): Promise<void> {
  try {
    const db = await openAppDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSION_STORE_NAME, "readwrite");
      tx.objectStore(SESSION_STORE_NAME).delete(quizId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to delete quiz session from IndexedDB:", err);
  }
}

/* ========================================================================= */

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
    <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-200/50 via-orange-50 to-white'}`} />
    <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] ${isDark ? 'opacity-20' : 'opacity-40'}`} />
  </div>
);


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


const GlassCard = ({ children, className = "", isDark = true, onClick }: { children: React.ReactNode; className?: string; isDark?: boolean; onClick?: () => void }) => (
  <div onClick={onClick} className={`relative backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exploreQuery, setExploreQuery] = useState("");

  // Tracks when the current attempt began, so a restored session keeps its
  // original start time instead of resetting the clock on every reload.
  const sessionStartedAtRef = useRef<number>(Date.now());
  // Prevents fetchData from re-checking/overwriting an already-restored session
  // if it somehow runs more than once for the same quiz id.
  const sessionRestoredForRef = useRef<number | null>(null);

  // Likes — kept as local state so the UI actually re-renders on click
  const [likedQuizzes, setLikedQuizzes] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const parsed = JSON.parse(localStorage.getItem("liked") as string);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [likeBurst, setLikeBurst] = useState(false);

  // Previously taken quizzes, loaded from IndexedDB
  const [takenQuizzes, setTakenQuizzes] = useState<TakenQuizRecord[]>([]);
  const [takenQuizzesLoading, setTakenQuizzesLoading] = useState(true);


  const quiz_id = searchParams.get("id");

   const email = localStorage.getItem("email")
  const userId = localStorage.getItem("id")
  const username = localStorage.getItem("username")

  const displayName = username ? `@${username}` : `User${userId}`
  const avatarLetter = (username || `User${userId}`).charAt(0).toUpperCase()
  const [creatorName , setCreatorName] = useState<string>("")
 

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


  const is_liked = (id: any) => likedQuizzes.includes(Number(id));

  const handleLike = (id: any) => {
    if (is_liked(id)) return;

    const updated = [...likedQuizzes, Number(id)];
    setLikedQuizzes(updated);
    localStorage.setItem("liked", JSON.stringify(updated));
    like_quiz(Number(id));

    // optimistic bump of the visible like count
    setQuiz((prev: any) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev));

    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 550);
  };

console.log(quiz)
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

  // Load quiz-taking history from IndexedDB once on mount
  useEffect(() => {
    getAllTakenQuizzes()
      .then((data) => setTakenQuizzes(data.sort((a, b) => b.dateTaken - a.dateTaken)))
      .finally(() => setTakenQuizzesLoading(false));
  }, []);



   const fetchData = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("id");
          const isAuthed =!!token && !!userId;
        

          const quizResp = await getQuizById(Number(quiz_id));
          
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
          const creatorName = await getUserNameById(Number(quizResp.creator_id));
          setCreatorName(creatorName)
         
          
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


          // Look for an in-progress session for this quiz (question index, answers,
          // time remaining) so a hard refresh / crash / accidental close resumes
          // exactly where the user left off instead of restarting the quiz.
          const session = await getQuizSession(Number(quiz_id));

          if (session) {
            let restoredTimeRemaining = 0;
            let expired = false;

            if (quizResp.isTimed && session.timeRemaining !== null) {
              const elapsedSincePersist = Math.floor((Date.now() - session.lastUpdated) / 1000);
              restoredTimeRemaining = Math.max(0, session.timeRemaining - elapsedSincePersist);
              expired = restoredTimeRemaining <= 0;
            }

            if (expired) {
              // Time ran out while the user was away — the attempt is stale,
              // so clear it and let them start a fresh attempt.
              await deleteQuizSession(Number(quiz_id));
            } else {
              sessionStartedAtRef.current = session.startedAt;
              sessionRestoredForRef.current = Number(quiz_id);
              setSelectedAnswers(session.selectedAnswers || {});
              setCurrentQuestionIndex(
                Math.min(session.currentQuestionIndex || 0, Math.max((quizResp.questions?.length || 1) - 1, 0))
              );
              if (quizResp.isTimed) {
                setTimeRemaining(restoredTimeRemaining);
              }
              setQuizResult(null);
              setStage(2);
              setIsLoading(false);
              return;
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

  
  useEffect(() => {
    let interval:any;
    if (stage === 2 && quiz?.isTimed && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const next = prev <= 1 ? 0 : prev - 1;

          // Throttle timer-driven writes to IndexedDB so we're not hitting it
          // every second — every 5s (and on the final tick) is enough to keep
          // a resumed session's clock roughly honest.
          if (quiz_id && (next % 5 === 0 || next === 0)) {
            saveQuizSession({
              id: Number(quiz_id),
              currentQuestionIndex,
              selectedAnswers,
              timeRemaining: next,
              startedAt: sessionStartedAtRef.current,
              lastUpdated: Date.now(),
            });
          }

          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, quiz, timeRemaining]);

  // Whenever the current question or the set of answers changes while a quiz
  // is actively being taken, persist the session immediately (this covers
  // Next/Prev navigation and every answer selection — the cases that matter
  // most for "don't lose my place on a hard refresh").
  useEffect(() => {
    if (stage === 2 && quiz_id) {
      saveQuizSession({
        id: Number(quiz_id),
        currentQuestionIndex,
        selectedAnswers,
        timeRemaining: quiz?.isTimed ? timeRemaining : null,
        startedAt: sessionStartedAtRef.current,
        lastUpdated: Date.now(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, quiz_id, currentQuestionIndex, selectedAnswers]);

  // Mirror the current question into the URL (?q=) while taking the quiz, so
  // the link itself points at the right question on reload/share, in addition
  // to the IndexedDB session above.
  useEffect(() => {
    if (stage === 2) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("q", String(currentQuestionIndex));
          return next;
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, currentQuestionIndex]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const handleStartQuiz = () => {
    const initialTimeRemaining = quiz?.isTimed ? quiz.duration * 60 : 0;
    if (quiz?.isTimed) {
      setTimeRemaining(initialTimeRemaining);
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setStage(2);

    sessionStartedAtRef.current = Date.now();
    if (quiz_id) {
      saveQuizSession({
        id: Number(quiz_id),
        currentQuestionIndex: 0,
        selectedAnswers: {},
        timeRemaining: quiz?.isTimed ? initialTimeRemaining : null,
        startedAt: sessionStartedAtRef.current,
        lastUpdated: Date.now(),
      });
    }
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

    // Show results immediately (optimistic UI)
    setQuizResult({ score, correctAnswers: correctCount, totalQuestions: quiz.questions.length, timeTaken, passed });
    setStage(3);

    // The attempt is finished — nothing left to resume, so drop the session.
    deleteQuizSession(Number(quiz_id));

    // Persist this attempt locally so the user can revisit it from the home screen
    saveTakenQuiz({
      id: Number(quiz_id),
      quiz_name: quiz.quiz_name,
      score,
      passed,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      timeTaken,
      quizType: quiz._type,
      dateTaken: Date.now(),
    }).then(() => {
      getAllTakenQuizzes().then((data) =>
        setTakenQuizzes(data.sort((a, b) => b.dateTaken - a.dateTaken))
      );
    });

    // Submit in background and show a tiny "Submitting" popup
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await getUserData(token).catch(() => null);
      const userid = localStorage.getItem("id");

      if (!token) {
        const userrr = await updateQuiz({ id: quiz_id, failed: !passed ? 1 : 0, passed: passed ? 1 : 0 });
        console.log(userrr);
      } else {
        const userrr = await updateQuiz({
          id: quiz_id,
          failed: !passed ? 1 : 0,
          passed: passed ? 1 : 0,
          userId: Number(userid),
          score: score,
          time_taken: timeTaken,
          date_taken: Number(Date.now()),
          passingScore: quiz.passingScore,
          name: quiz.quiz_name,
          reward: quiz.reward,
          creator_id: Number(quiz.creator_id)
        });
        console.log(userrr);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setIsSubmitting(false);
    }
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
            <Button variant="ghost" onClick={() => navigate("/explore")} className="w-full" isDark={isDark}>
              Back to Explore
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  
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
          
          <Button onClick={() => navigate("/explore")} className="w-full" isDark={isDark}>
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

  
  if (!quiz_id) {
    return (
      <div className={`min-h-screen relative ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        <AnimatedBackground isDark={isDark} />
         <SEO
        title={quiz?.quiz_name || "Join This Quiz"} 
        description="Try this quiz" 
      />
       

         <header className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 border-b ${scrolled ? (isDark ? 'bg-black/95 shadow-2xl shadow-orange-500/10 border-orange-500/30' : 'bg-white/95 shadow-lg shadow-orange-500/10 border-orange-200') : (isDark ? 'bg-black/80 border-orange-500/20' : 'bg-white/80 border-orange-100')} backdrop-blur-xl`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 border ${isDark ? 'bg-liner-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'bg-orange-100 border-orange-200'}`}>
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
                  { name: 'Home', href: '/home', active:false },
                
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' },
                  {name:"Explore" , href:"/explore"}
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${item.active ? 'text-orange-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}
                    {item.active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-orange-500 to-amber-500 rounded-full"></span>
                    )}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
          
                    <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-900 text-orange-400 border-orange-500/30 hover:border-orange-500/50' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-orange-300'}`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border ${isDark ? 'bg-gray-900/80 border-orange-500/30 hover:border-orange-500/60' : 'bg-white border-slate-200 hover:border-orange-300'} ${profileOpen ? (isDark ? 'border-orange-500' : 'border-orange-400') : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                      {avatarLetter}
                    </div>
                    <ChevronLeft className={`w-4 h-4 -rotate-90 transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-slate-500'} ${profileOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${profileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'} ${isDark ? 'bg-black/95 border-orange-500/20 backdrop-blur-xl' : 'bg-white border-orange-100'}`}>
                    <div className={`p-4 border-b ${isDark ? 'border-orange-500/20' : 'border-orange-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
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
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
               
                  { name: 'Create Quiz', href: '/create-quiz' },
                  { name: 'Stats', href: '/stats' }, {name:"Explore" , href:"/explore"}
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
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">
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
              </GlassCard>
           </div>

          {/* Previously taken quizzes — pulled from IndexedDB so it works fully offline */}
          {!takenQuizzesLoading && takenQuizzes.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                <h2 className="text-sm font-semibold">Quizzes You've Taken</h2>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  saved on this device
                </span>
              </div>
              <div className="space-y-2">
                {takenQuizzes.map((tq) => (
                  <GlassCard
                    key={`${tq.id}-${tq.dateTaken}`}
                    className="p-3 cursor-pointer hover:scale-[1.01] transition-transform"
                    isDark={isDark}
                    onClick={() => navigate(`?id=${tq.id}`)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tq.passed ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-100') : (isDark ? 'bg-rose-500/10' : 'bg-rose-100')}`}>
                          {tq.passed ? (
                            <Crown className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          ) : (
                            <XCircle className={`w-4 h-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{tq.quiz_name}</p>
                          <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {new Date(tq.dateTaken).toLocaleDateString()} · {tq.quizType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className={`text-sm font-bold ${tq.passed ? 'text-emerald-500' : 'text-rose-500'}`}>{tq.score}%</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{tq.passed ? 'Passed' : 'Failed'}</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
         
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
    const liked = is_liked(quiz_id);
    
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
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{quiz.material}</p>

            {quiz.quiz_tags && quiz.quiz_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {quiz.quiz_tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      isDark ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20' : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}
                  >
                    <Hash className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs">
              <span onClick={()=> window.location.href = `/playerinfo?id=${quiz.creator_id}`} className={`cursor-pointer px-2.5 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                @{creatorName || "User0" + quiz.creator_id}
              </span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                {new Date(Number(quiz.time_posted)).toLocaleDateString()}
              </span>
              {/* <span className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-500'}`}>
                <Heart className={`w-3 h-3 ${liked ? 'text-rose-500' : ''}`} fill={liked ? 'currentColor' : 'none'} />
                {quiz.likes} likes
              </span>

                <span className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-500'}`}>
                <Users className={`w-3 h-3 `} />
                {quiz.completed || 0}  played 
              </span> */}

            </div>

             <div className="flex items-center gap-3 text-xs mt-2 ">
              {/* <span onClick={()=> window.location.href = `/playerinfo?id=${quiz.creator_id}`} className={`cursor-pointer px-2.5 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                @{creatorName || "User0" + quiz.creator_id}
              </span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                {new Date(Number(quiz.time_posted)).toLocaleDateString()}
              </span> */}
              <span className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-500'}`}>
                <Heart className={`w-3 h-3 ${liked ? 'text-rose-500' : ''}`} fill={liked ? 'currentColor' : 'none'} />
                {quiz.likes} likes
              </span>

                <span className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-500'}`}>
                <Users className={`w-3 h-3 `} />
                {quiz.completed || 0}  played 
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

            <button
              onClick={() => handleLike(quiz_id)}
              disabled={liked}
              aria-label={liked ? "Already liked" : "Like this quiz"}
              className={`relative w-12 shrink-0 rounded-xl border transition-all duration-200 flex items-center justify-center overflow-visible ${
                liked
                  ? "border-rose-500/60 bg-rose-500/10 cursor-default"
                  : isDark
                    ? "bg-slate-800 border-slate-700 hover:border-rose-500/40 hover:bg-rose-500/5 cursor-pointer active:scale-90"
                    : "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50 cursor-pointer active:scale-90"
              }`}
            >
              <motion.div
                animate={likeBurst ? { scale: [1, 1.5, 0.85, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart
                  className={`w-4 h-4 ${liked ? 'text-rose-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  fill={liked ? 'currentColor' : 'none'}
                />
              </motion.div>
              <AnimatePresence>
                {likeBurst && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                        animate={{
                          opacity: 0,
                          x: Math.cos((i / 6) * Math.PI * 2) * 18,
                          y: Math.sin((i / 6) * Math.PI * 2) * 18,
                          scale: 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-1 h-1 rounded-full bg-rose-500 pointer-events-none"
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </button>

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
         

            
    <div className={`sticky top-0 z-40 space-y-6 backdrop-blur-md p-8 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
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
        {isSubmitting && (
          <div className={`fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-black/80 text-white' : 'bg-white/90 text-slate-800'} shadow-lg`}>
            Submitting...
          </div>
        )}
      </div>
    );
  }

  return null;
}