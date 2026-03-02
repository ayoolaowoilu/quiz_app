// components/Notification.tsx
interface NotificationProps {
  show: boolean;
  message: string;
  type: "error" | "success" | "info";
  onClose: () => void;
}

export function Notification({ show, message, type, onClose }: NotificationProps) {
  if (!show) return null;

  const styles = {
    error: {
      bg: "bg-red-500",
      lightBg: "bg-white dark:bg-slate-900",
      border: "border-red-500",
      text: "text-red-600 dark:text-red-400",
      subtext: "text-slate-600 dark:text-slate-400",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      bg: "bg-green-500",
      lightBg: "bg-white dark:bg-slate-900",
      border: "border-green-500",
      text: "text-green-600 dark:text-green-400",
      subtext: "text-slate-600 dark:text-slate-400",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bg: "bg-orange-500",
      lightBg: "bg-white dark:bg-slate-900",
      border: "border-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      subtext: "text-slate-600 dark:text-slate-400",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentStyle = styles[type];

  return (
    <div className="fixed inset-x-0 top-0 z-50 p-4 sm:p-6 animate-slide-in">
      <div className="mx-auto max-w-sm sm:max-w-md">
        <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${currentStyle.lightBg} border-l-4 ${currentStyle.border}`}>
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${currentStyle.bg}`}></div>
          
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${currentStyle.bg} flex items-center justify-center shadow-lg`}>
                {currentStyle.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <h3 className={`text-sm sm:text-base font-bold ${currentStyle.text}`}>
                  {type === "error" ? "Oops!" : type === "success" ? "Success!" : "Heads Up!"}
                </h3>
                <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${currentStyle.subtext}`}>
                  {message}
                </p>
              </div>
              
              {/* Close button */}
              <button 
                onClick={onClose}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors duration-200 ${type === "error" ? "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400" : type === "success" ? "hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500 dark:text-green-400" : "hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500 dark:text-orange-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Progress bar auto-close indicator */}
          <div className={`absolute bottom-0 left-0 h-0.5 ${currentStyle.bg} animate-shrink`}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-in {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink 5s linear forwards;
        }
      `}</style>
    </div>
  );
}