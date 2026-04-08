import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import { useState, useEffect, useCallback } from "react";
import { getDaillyQuiz, updateDailyQuiz } from "../../lib/quiz";
import { motion, AnimatePresence } from "framer-motion";
import { BookAudioIcon, CheckCheckIcon, CircleQuestionMark, Gift, TimerIcon } from "lucide-react";
import { getUserData } from "../../lib/auth";
import SEO from "../seo";




// Types
interface DailyQuiz {
    _name :string;
  id: number;
  _type: "TOF" | "MCQ" | "SAQ";
  material: string;
  completed: number;
  passed: number;
  failed: number;
  reward: number;
  duration: number;
  quiz_tags: string[];
  questions: Question[];
  comments: any[];
  _date: string;
  passingScore: number;
  players: Player[];
}

interface Question {
  question: string;
  options?: string[];
  answer: string;
  type?: "TOF" | "MCQ" | "SAQ";
}

interface Player {
  id: number;
  name: string;
  score: number;
  time_taken: number;
  email:string
}

interface QuizState {
  currentQuestionIndex: number;
  answers: (string | null)[];
  score: number;
  isCompleted: boolean;
  timeRemaining: number;
  showResults: boolean;
}

// Utility Functions
const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Main Component
export default function DailyQuiz() {
  // Theme State
  const [isDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  // Quiz Data State
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz Gameplay State
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isCompleted: false,
    timeRemaining: 0,
    showResults: false
  });

  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Auth
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem("token");
  const userId = typeof window !== 'undefined' ? localStorage.getItem("id") : null;
 

  // Fetch Quiz Data
  const fetchTodaysQuiz = useCallback(async () => {

    const todayDate = getTodayDate();
  
    try {
      setLoading(true);
      setError(null);
      const quizData = await getDaillyQuiz(todayDate);
      if(quizData.error){
           return setQuiz(null)
      }
      setQuiz(quizData);
      
    
      if (quizData.players && userId) {
        const userHasTaken = quizData.players.some((player:any)=> String(player.id) === userId);
        setHasTakenQuiz(userHasTaken);
      }
      
      // Initialize quiz state
      setQuizState(prev => ({
        ...prev,
        timeRemaining: quizData.duration * 60,
        answers: new Array(quizData.questions?.length).fill(null)
      }));
    } catch (err) {
      setError('Failed to load today\'s quiz. Please try again later.');
      console.error('Error fetching today\'s quiz:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTodaysQuiz();
  }, [fetchTodaysQuiz]);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (quizStarted && !quizState.isCompleted && quizState.timeRemaining > 0) {
      interval = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 1) {
            return { ...prev, timeRemaining: 0, isCompleted: true, showResults: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizState.isCompleted, quizState.timeRemaining]);


  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answer: string) => {
    setQuizState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answer;
      return { ...prev, answers: newAnswers };
    });
  };

  const handleNext = () => {
    if (quiz && quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    }
  };



  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (quizState.answers[idx]?.toLowerCase() === q.answer.toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  }, [quiz, quizState.answers]);

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    const timeTaken = quiz ? (quiz.duration * 60) - quizState.timeRemaining : 0;
    
    setQuizState(prev => ({
      ...prev,
      score: finalScore,
      isCompleted: true,
      showResults: true,timeTaken:timeTaken
    }));
   
    try {
      const token = localStorage.getItem("token")
   await getUserData(token)
    const payload = {
         player_data:{  name:localStorage.getItem("username"),
         email:localStorage.getItem("email"),score:finalScore,id:localStorage.getItem("id") , time_taken:timeTaken},
         id:getTodayDate(),
         passed:finalScore >= Number(quiz?.passingScore) ? 1 : 0,
         failed: finalScore >= Number(quiz?.passingScore) ? 0 : 1
    }
      const resp = await updateDailyQuiz(payload)
      console.log(resp)
      setHasTakenQuiz(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  // Theme Classes
  const themeClasses = isDark 
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white"
    : "bg-gradient-to-br from-orange-50 via-white to-orange-100 text-slate-900";

  const glassClasses = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
    : "bg-white/80 backdrop-blur-xl border border-orange-200/50 shadow-2xl";

    if(!isAuthed){
       return (
      <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 transition-colors duration-500`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassClasses} rounded-3xl p-8 max-w-md text-center`}
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">You are not logged in!</h2>
          <p className={isDark ? "text-white/70 mb-6" : "text-slate-600 mb-6"}>
            you need to login to continue
          </p>
          <button
            onClick={()=>window.location.href = "/login"}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
           login
          </button>
        </motion.div>
      </div>
    );
    }
  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses} flex items-center justify-center transition-colors duration-500`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${glassClasses} rounded-3xl p-12 flex flex-col items-center gap-6`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            HyperQuizzes
          </h2>
          <p className={isDark ? "text-white/70" : "text-slate-600"}>
            Loading today's challenge...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 transition-colors duration-500`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassClasses} rounded-3xl p-8 max-w-md text-center`}
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className={isDark ? "text-white/70 mb-6" : "text-slate-600 mb-6"}>
            {error}
          </p>
          <button
            onClick={fetchTodaysQuiz}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // No Quiz Available
  if (!quiz) {
    return (
      <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 transition-colors duration-500`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${glassClasses} rounded-3xl p-12 text-center max-w-lg`}
        >
          <img src={logo} alt="HyperQuizzes" className="w-24 h-24 mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            HyperQuizzes
          </h1>
          <p className={`text-lg ${isDark ? "text-white/70" : "text-slate-600"}`}>
            No quiz available for today. Check back tomorrow!
          </p>
        </motion.div>
      </div>
    );
  }

  // Already Taken Quiz - Success Message
  if (hasTakenQuiz) {
    const userPlayer = quiz.players?.find(p => String(p.id) === userId);
    
    return (
      <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <img src={logo} alt="HyperQuizzes" className="w-10 h-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                HyperQuizzes
              </h1>
            </div>
            <div className={`${glassClasses} px-4 py-2 rounded-full text-sm font-medium`}>
              {getTodayDate()}
            </div>
          </motion.header>

        
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${glassClasses} rounded-3xl p-8 md:p-12 text-center relative overflow-hidden`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Quiz Completed! 🎉
              </h2>
              
              <p className={`text-lg mb-6 ${isDark ? "text-white/80" : "text-slate-600"}`}>
                You have successfully taken today's quiz. 
              
              </p>

              {userPlayer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`inline-block ${isDark ? "bg-white/10" : "bg-orange-100"} rounded-2xl p-6 mb-6`}
                >
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-3xl font-bold text-orange-500">{userPlayer.score}%</p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>Score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-amber-500">
                        {Math.floor(userPlayer.time_taken / 60)}:{String(userPlayer.time_taken % 60).padStart(2, '0')}
                      </p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>Time</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-emerald-500">#{quiz.players.findIndex(p => p.id === userPlayer.id) + 1}</p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>Rank</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Leaderboard Preview */}
            {  quiz?.players?.length > 10 ? (  <div className={`mt-8 ${isDark ? "bg-white/5" : "bg-white/50"} rounded-2xl p-6`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🏆</span> Today's Leaderboard
                </h3>
                <div className="space-y-3">
                  {quiz.players?.slice(0, 5).map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        String(player.id) === userId 
                          ? (isDark ? "bg-orange-500/20 border border-orange-500/50" : "bg-orange-100 border border-orange-300") 
                          : (isDark ? "bg-white/5" : "bg-white/80")
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? "bg-yellow-500 text-yellow-900" :
                        idx === 1 ? "bg-slate-300 text-slate-700" :
                        idx === 2 ? "bg-amber-600 text-white" :
                        (isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700")
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{player.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-500">{player.score}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>) : (<p>Leader board not available yet!</p>)
              }
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Not Started - Welcome Screen
  if (!quizStarted) {
    return (
      <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
           <SEO
        title="Daily Quizzes" 
        description="Take the Daily challenge" 
      />
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.img 
                src={logo} 
                alt="HyperQuizzes" 
                className="w-10 h-10"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                HyperQuizzes
              </h1>
            </div>
            <div className={`${glassClasses} px-4 py-2 rounded-full text-sm font-medium`}>
              {getTodayDate()}
            </div>
          </motion.header>

          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${glassClasses} rounded-3xl p-8 md:p-12 relative overflow-hidden`}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ 
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                  className="inline-block p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-6 shadow-lg"
                >
                  <span className="text-4xl"><BookAudioIcon /></span>
                </motion.div>
                
                <h2 className="text-sm md:text-2sm font-bold mb-4">
                  Daily Challenge
                </h2>
                  <p className={`text-xl md:text-3xl font-bold mb-4 text-white `}>
                  {quiz._name}
                </p>
                <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
                 {quiz.material}
                </p>
              </div>

              {/* Quiz Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Questions", value: quiz.questions?.length, icon: "question" },
                  { label: "Duration", value: `${quiz.duration} min`, icon: "time" },
                
                  { label: "Passing", value: `${quiz.passingScore}%`, icon: "✅" },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`${isDark ? "bg-white/10" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-4 text-center border border-orange-500/20`}
                  >
                    <div className="text-2xl mb-1"></div>
                    <div className="text-2xl font-bold flex gap-2 justify-center text-orange-500"><div className="my-auto text-white">{stat.icon == "question" ? <CircleQuestionMark /> : stat.icon == "time" ? <TimerIcon /> : stat.icon == "gift" ? <Gift /> : <CheckCheckIcon />}</div> {stat.value}</div>
                    <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {quiz.quiz_tags?.map((tag, idx) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + idx * 0.05 }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      isDark 
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" 
                        : "bg-orange-100 text-orange-700 border border-orange-300"
                    }`}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="text-center"
              >
                <motion.button
                  onClick={handleStartQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Quiz 
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                  />
                </motion.button>
                
                <p className={`mt-4 text-sm ${isDark ? "text-white/50" : "text-slate-400"}`}>
                {quiz?.players?.length > 10 ? (<p> {quiz.players?.length} players have already taken this quiz</p>) : null}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active Quiz Interface
  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = quizState.answers[quizState.currentQuestionIndex] !== null;

  return (
    <div className={`min-h-screen ${themeClasses} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <img src={logo} alt="HyperQuizzes" className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              HyperQuizzes
            </h1>
          </div>
          
          {/* Timer */}
          <motion.div 
            className={`${glassClasses} px-4 py-2 rounded-full flex items-center gap-2`}
            animate={quizState.timeRemaining < 60 ? { 
              scale: [1, 1.05, 1],
              borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.8)", "rgba(239,68,68,0.2)"]
            } : {}}
            transition={{ duration: 1, repeat: quizState.timeRemaining < 60 ? Infinity : 0 }}
          >
            <span className="text-lg"><TimerIcon /></span>
            <span className={`font-mono font-bold ${quizState.timeRemaining < 60 ? "text-red-500" : ""}`}>
              {formatTime(quizState.timeRemaining)}
            </span>
          </motion.div>
        </motion.header>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className={`h-2 ${isDark ? "bg-white/10" : "bg-slate-200"} rounded-full overflow-hidden`}>
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={`flex justify-between mt-2 text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
            <span>Question {quizState.currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`${glassClasses} rounded-3xl p-6 md:p-10 mb-6`}
          >
            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options ? (
                // MCQ or TOF
                currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      quizState.answers[quizState.currentQuestionIndex] === option
                        ? "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20"
                        : isDark 
                          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/50"
                          : "border-slate-200 bg-white/50 hover:bg-orange-50 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        quizState.answers[quizState.currentQuestionIndex] === option
                          ? "bg-orange-500 text-white"
                          : isDark ? "bg-white/10 text-white/70" : "bg-slate-200 text-slate-600"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {quizState.answers[quizState.currentQuestionIndex] === option && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-orange-500"
                        >
                          ✓
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                ))
              ) : (
                // SAQ (Short Answer)
                <div className="space-y-4">
                  <input
                    type="text"
                    value={quizState.answers[quizState.currentQuestionIndex] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className={`w-full p-4 rounded-xl border-2 outline-none transition-all duration-300 ${
                      isDark 
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-orange-500 focus:bg-white/10"
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-orange-50"
                    }`}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={handlePrevious}
            disabled={quizState.currentQuestionIndex === 0}
            whileHover={quizState.currentQuestionIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={quizState.currentQuestionIndex > 0 ? { scale: 0.95 } : {}}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              quizState.currentQuestionIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : isDark 
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            ← Previous
          </motion.button>

          {/* Question Dots */}
          <div className="hidden md:flex gap-2">
            {quiz.questions.map((_, idx) => (
              <motion.div
                key={idx}
                onClick={() => setQuizState(prev => ({ ...prev, currentQuestionIndex: idx }))}
                whileHover={{ scale: 1.2 }}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === quizState.currentQuestionIndex
                    ? "bg-orange-500 w-6"
                    : quizState.answers[idx] !== null
                      ? "bg-green-500"
                      : isDark ? "bg-white/20" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <motion.button
              onClick={handleSubmit}
              disabled={!hasAnsweredCurrent}
              whileHover={hasAnsweredCurrent ? { scale: 1.05 } : {}}
              whileTap={hasAnsweredCurrent ? { scale: 0.95 } : {}}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                hasAnsweredCurrent
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-green-500/30"
                  : "opacity-30 cursor-not-allowed bg-slate-500 text-white"
              }`}
            >
              Submit Quiz ✓
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              whileHover={hasAnsweredCurrent ? { scale: 1.05 } : {}}
              whileTap={hasAnsweredCurrent ? { scale: 0.95 } : {}}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                hasAnsweredCurrent
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-orange-500/30"
                  : "opacity-30 cursor-not-allowed bg-slate-500 text-white"
              }`}
            >
              Next →
            </motion.button>
          )}
        </div>

        {/* Submit Warning */}
        {isLastQuestion && hasAnsweredCurrent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-sm text-orange-500/80"
          >
            ⚠️ Make sure to review your answers before submitting!
          </motion.p>
        )}
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {quizState.showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${glassClasses} rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden`}
            >
              {/* Confetti Effect (CSS-based) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -20, 
                      x: Math.random() * 400 - 200,
                      rotate: 0 
                    }}
                    animate={{ 
                      y: 400, 
                      rotate: 360,
                      x: Math.random() * 400 - 200
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    className="absolute top-0 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#f97316', '#fbbf24', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)],
                      left: `${50 + (Math.random() * 40 - 20)}%`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    quizState.score >= quiz.passingScore
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : "bg-gradient-to-br from-orange-400 to-amber-500"
                  }`}
                >
                  <span className="text-4xl text-white font-bold">{quizState.score}%</span>
                </motion.div>

                <h2 className="text-3xl font-bold mb-2">
                  {quizState.score >= quiz.passingScore ? "Congratulations! 🎉" : "Good Try! 💪"}
                </h2>
                
                <p className={`mb-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {quizState.score >= quiz.passingScore 
                    ? "You passed the quiz! Check your email for the full leaderboard."
                    : "You didn't pass this time, but keep practicing! Check your email for details."
                  }
                </p>

                <div className={`grid grid-cols-2 gap-4 mb-6 ${isDark ? "bg-white/10" : "bg-orange-100"} rounded-2xl p-4`}>
                  <div>
                    <p className="text-2xl font-bold text-orange-500">
                      {quizState.answers.filter((a, i) => a?.toLowerCase() === quiz.questions[i].answer.toLowerCase()).length}
                    </p>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-500">
                      {formatTime((quiz.duration * 60) - quizState.timeRemaining)}
                    </p>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>Time Used</p>
                  </div>
                </div>

                <motion.button
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                >
                  Back to Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
