import React, { useState } from 'react';
import { DailyStats } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  stats: DailyStats[];
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CalendarView: React.FC<CalendarViewProps> = ({ stats }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const changeYear = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + offset);
    setCurrentDate(newDate);
  };

  const selectMonth = (monthIndex: number) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(monthIndex);
      setCurrentDate(newDate);
      setIsSelectorOpen(false);
  };

  const hasActivityInMonth = (monthIndex: number, year: number) => {
      return stats.some(s => {
          const d = new Date(s.date);
          return d.getMonth() === monthIndex && d.getFullYear() === year && s.sessionsCompleted > 0;
      });
  };

  const monthNameFull = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentYear = currentDate.getFullYear();

  const renderDays = () => {
    const daysArray = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-8 sm:h-10" />);
    }
    
    for (let d = 1; d <= days; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const stat = stats.find(s => s.date === dateStr);
      const hasActivity = stat && stat.sessionsCompleted > 0;
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
      
      daysArray.push(
        <div key={d} className="h-8 sm:h-10 flex flex-col items-center justify-center relative group cursor-default animate-in zoom-in duration-200" style={{ animationDelay: `${d * 5}ms` }}>
            <span className={`text-xs sm:text-sm font-medium w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all
                ${hasActivity ? 'bg-pomodoro text-white shadow-glow' : isToday ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
            `}>
                {d}
            </span>
            {hasActivity && (
                 <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 border border-zinc-700 shadow-xl">
                     {stat.sessionsCompleted} sessions
                 </div>
            )}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-surface rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            {!isSelectorOpen ? (
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                    <ChevronLeft size={20} />
                </button>
            ) : (
                 <div className="w-9" /> /* Spacer to keep alignment */
            )}

            <button 
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-wide px-4 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
            >
                {isSelectorOpen ? (
                   <span className="text-sm text-zinc-500 font-normal">Back to Calendar</span>
                ) : (
                   <span>{monthNameFull}</span>
                )}
            </button>

            {!isSelectorOpen ? (
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                    <ChevronRight size={20} />
                </button>
            ) : (
                 <div className="w-9" /> /* Spacer */
            )}
        </div>

        {/* Content Switcher */}
        <div className="relative min-h-[280px]">
            {isSelectorOpen ? (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 absolute inset-0 flex flex-col">
                    {/* Year Selector */}
                    <div className="flex items-center justify-center space-x-6 mb-6">
                        <button onClick={() => changeYear(-1)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{currentYear}</span>
                        <button onClick={() => changeYear(1)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Months Grid */}
                    <div className="grid grid-cols-3 gap-3 flex-1">
                        {MONTH_NAMES.map((m, idx) => {
                            const isCurrentMonth = idx === currentDate.getMonth();
                            const hasActivity = hasActivityInMonth(idx, currentYear);
                            
                            return (
                                <button
                                    key={m}
                                    onClick={() => selectMonth(idx)}
                                    className={`relative rounded-2xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-95
                                        ${isCurrentMonth 
                                            ? 'bg-pomodoro text-white shadow-lg shadow-pomodoro/20' 
                                            : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }
                                    `}
                                >
                                    {m}
                                    {hasActivity && !isCurrentMonth && (
                                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pomodoro"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CalendarView;