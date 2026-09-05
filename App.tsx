import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings as SettingsIcon, Calendar as CalendarIcon, Moon, Sun, Maximize2, Minimize2, Clock, ListTodo } from 'lucide-react';
import { TimerMode, Task, DailyStats, Settings, SoundType } from './types';
import { DEFAULT_SETTINGS, MODE_COLORS, MOTIVATIONAL_QUOTES } from './constants';
import CircularTimer from './components/CircularTimer';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import SettingsModal from './components/SettingsModal';
import bgDark from './src/assets/images/cozy_bg_dark_1788616348168.jpg';
import bgLight from './src/assets/images/cozy_bg_light_1788616363653.jpg';

function App() {
  // --- State ---
  const [mode, setMode] = useState<TimerMode>(TimerMode.POMODORO);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoroDuration * 60);
  // Keep track of the total time for the current session to calculate progress correctly when custom time is set
  const [currentSessionTotalTime, setCurrentSessionTotalTime] = useState(DEFAULT_SETTINGS.pomodoroDuration * 60);

  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ht_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ht_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  const [stats, setStats] = useState<DailyStats[]>(() => {
    const saved = localStorage.getItem('ht_stats');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(0);
  
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark
  const [activeView, setActiveView] = useState<'timer' | 'tasks' | 'calendar'>('timer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  const timerRef = useRef<number | null>(null);
  const expectedFinishTimeRef = useRef<number | null>(null);

  // --- Effects ---

  // Theme init
  useEffect(() => {
    const storedTheme = localStorage.getItem('ht_theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ht_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ht_theme', 'light');
    }
  }, [isDarkMode]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('ht_settings', JSON.stringify(settings));
  }, [settings]);
  
  useEffect(() => {
    localStorage.setItem('ht_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ht_stats', JSON.stringify(stats));
  }, [stats]);

  // Timer Logic using Delta Time for accuracy
  const tick = useCallback(() => {
    if (!isActive || !expectedFinishTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.ceil((expectedFinishTimeRef.current - now) / 1000);

    if (remaining <= 0) {
      handleTimerComplete();
    } else {
      setTimeLeft(remaining);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      // Setup timer based on current timeLeft
      const now = Date.now();
      expectedFinishTimeRef.current = now + timeLeft * 1000;
      
      timerRef.current = window.setInterval(tick, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]); 

  // --- Handlers ---

  const handleTimerComplete = () => {
    setIsActive(false);
    setTimeLeft(0);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === TimerMode.POMODORO) {
        // Update Stats
        const today = new Date().toISOString().split('T')[0];
        const newStats = [...stats];
        const todayStatIndex = newStats.findIndex(s => s.date === today);
        const durationMinutes = Math.floor(currentSessionTotalTime / 60);

        if (todayStatIndex >= 0) {
            newStats[todayStatIndex].sessionsCompleted += 1;
            newStats[todayStatIndex].minutesFocused += durationMinutes;
        } else {
            newStats.push({ date: today, sessionsCompleted: 1, minutesFocused: durationMinutes });
        }
        setStats(newStats);
        
        setStreak(s => s + 1);

        if (activeTaskId) {
            setTasks(prev => prev.map(t => 
                t.id === activeTaskId 
                ? { ...t, completedPomodoros: t.completedPomodoros + 1 } 
                : t
            ));
        }

        // Switch Mode Logic
        const sessionsToday = todayStatIndex >= 0 ? newStats[todayStatIndex].sessionsCompleted : 1;
        if (sessionsToday % settings.longBreakInterval === 0) {
            switchMode(TimerMode.LONG_BREAK);
        } else {
            switchMode(TimerMode.SHORT_BREAK);
        }
        
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

        if (settings.autoStartBreaks) {
             setTimeout(() => setIsActive(true), 1000);
        }

    } else {
        switchMode(TimerMode.POMODORO);
        if (settings.autoStartPomodoros) {
             setTimeout(() => setIsActive(true), 1000);
        }
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    let duration = 0;
    switch (newMode) {
      case TimerMode.POMODORO:
        duration = settings.pomodoroDuration * 60;
        break;
      case TimerMode.SHORT_BREAK:
        duration = settings.shortBreakDuration * 60;
        break;
      case TimerMode.LONG_BREAK:
        duration = settings.longBreakDuration * 60;
        break;
    }
    setTimeLeft(duration);
    setCurrentSessionTotalTime(duration);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleCustomTime = (minutes: number) => {
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setCurrentSessionTotalTime(seconds);
  };

  const handleAddTask = (title: string, est: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      estimatedPomodoros: est,
      completedPomodoros: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  useEffect(() => {
      if (!isActive) {
          let newDuration = 0;
          if (mode === TimerMode.POMODORO) newDuration = settings.pomodoroDuration * 60;
          if (mode === TimerMode.SHORT_BREAK) newDuration = settings.shortBreakDuration * 60;
          if (mode === TimerMode.LONG_BREAK) newDuration = settings.longBreakDuration * 60;
          
          setTimeLeft(newDuration);
          setCurrentSessionTotalTime(newDuration);
      }
  }, [settings, mode]);

  const navButtonClass = (view: string) => `
    flex items-center justify-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 text-sm whitespace-nowrap
    ${activeView === view 
        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-medium shadow-lg' 
        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'}
  `;

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-500 ${isFocusMode ? 'justify-center' : ''}`}>
      
      {/* Dynamic Blurred Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-500">
        <img 
          src={isDarkMode ? bgDark : bgLight} 
          className="w-full h-full object-cover opacity-60 dark:opacity-40 blur-[8px] scale-105 transition-all duration-1000"
          alt="Cozy Background"
        />
        <div className="absolute inset-0 bg-zinc-50/50 dark:bg-black/60 backdrop-blur-sm transition-colors duration-500"></div>
      </div>

      {/* Navbar */}
      {!isFocusMode && (
        <nav className="relative z-10 w-full p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
            <div className="flex items-center gap-3 self-start sm:self-center">
                <h1 className="text-2xl font-light tracking-wide text-zinc-800 dark:text-zinc-100">
                    Calmoro
                </h1>
            </div>
            
            <div className="flex items-center w-full sm:w-auto justify-start sm:justify-center gap-1 bg-white dark:bg-surface rounded-full p-1.5 shadow-sm border border-zinc-200 dark:border-zinc-900 overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveView('timer')} className={`flex-1 sm:flex-none ${navButtonClass('timer')}`}>
                    <Clock size={16} className="shrink-0" />
                    <span>Timer</span>
                </button>
                <button onClick={() => setActiveView('tasks')} className={`flex-1 sm:flex-none ${navButtonClass('tasks')}`}>
                    <ListTodo size={16} className="shrink-0" />
                    <span>Tasks</span>
                </button>
                <button onClick={() => setActiveView('calendar')} className={`flex-1 sm:flex-none ${navButtonClass('calendar')}`}>
                    <CalendarIcon size={16} className="shrink-0" />
                    <span>Calendar</span>
                </button>
            </div>

            <div className="flex items-center space-x-2 absolute right-4 top-4 sm:static">
                <button 
                    onClick={() => setIsFocusMode(true)} 
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400"
                    title="Focus Mode"
                >
                    <Maximize2 size={20} />
                </button>
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400"
                >
                    <SettingsIcon size={20} />
                </button>
            </div>
        </nav>
      )}

      {isFocusMode && (
          <button 
            onClick={() => setIsFocusMode(false)}
            className="absolute top-6 right-6 p-2 bg-white/20 dark:bg-black/40 hover:bg-white/40 dark:hover:bg-black/60 backdrop-blur-md rounded-full transition-colors z-50 text-zinc-600 dark:text-zinc-400"
          >
              <Minimize2 size={20} />
          </button>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto p-4 flex flex-col items-center justify-center">
        
        {activeView === 'timer' && (
            <div className={`w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 ${isFocusMode ? 'scale-110' : ''}`}>
                {/* Mode Toggles */}
                <div className="flex p-1 space-x-1 mb-8 sm:mb-10 bg-white/50 dark:bg-surfaceHighlight/50 backdrop-blur-md rounded-full scale-90 sm:scale-100 origin-center border border-zinc-200/50 dark:border-zinc-800/50">
                    {Object.values(TimerMode).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                                mode === m 
                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                            }`}
                        >
                            {m.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Timer */}
                <div className="mb-8 sm:mb-12 w-full flex justify-center">
                    <CircularTimer 
                        mode={mode}
                        timeLeft={timeLeft}
                        totalTime={currentSessionTotalTime}
                        isActive={isActive}
                        onToggle={toggleTimer}
                        onEditTime={handleCustomTime}
                    />
                </div>

                {/* Controls & Active Task Display */}
                <div className="w-full max-w-md text-center mb-6">
                    <div className="min-h-[3rem] flex items-center justify-center px-4">
                        {activeTaskId ? (
                            <div className="flex items-center gap-3 px-5 py-2 bg-white/80 dark:bg-surface/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full shadow-sm animate-in zoom-in max-w-full">
                                <span className="w-2 h-2 rounded-full bg-pomodoro animate-pulse shrink-0"></span>
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
                                    {tasks.find(t => t.id === activeTaskId)?.title}
                                </span>
                                <button 
                                    onClick={() => setActiveTaskId(null)}
                                    className="text-zinc-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium tracking-wide italic px-4">"{quote}"</p>
                        )}
                    </div>

                </div>
            </div>
        )}

        {activeView === 'tasks' && (
            <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <TaskList 
                    tasks={tasks}
                    activeTaskId={activeTaskId}
                    onAddTask={handleAddTask}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onSelectActive={setActiveTaskId}
                />
            </div>
        )}

        {activeView === 'calendar' && (
            <CalendarView stats={stats} />
        )}

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}

export default App;