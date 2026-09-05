import React, { useState, useEffect, useRef } from 'react';
import { TimerMode } from '../types';
import { Edit3 } from 'lucide-react';

interface CircularTimerProps {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  onToggle: () => void;
  onEditTime: (minutes: number) => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
  mode,
  timeLeft,
  totalTime,
  isActive,
  onToggle,
  onEditTime
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(Math.floor(timeLeft / 60).toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // SVG Dimensions
  const size = 300; // Base size for viewBox calculations
  const stroke = 8;
  const radius = size / 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Progress Calculation
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - (progress * circumference);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getColor = () => {
    switch (mode) {
      case TimerMode.POMODORO: return 'stroke-pomodoro';
      case TimerMode.SHORT_BREAK: return 'stroke-shortBreak';
      case TimerMode.LONG_BREAK: return 'stroke-longBreak';
      default: return 'stroke-pomodoro';
    }
  };
  
  const getBgColor = () => {
      switch (mode) {
      case TimerMode.POMODORO: return 'stroke-pomodoro-light/10';
      case TimerMode.SHORT_BREAK: return 'stroke-shortBreak-light/10';
      case TimerMode.LONG_BREAK: return 'stroke-longBreak-light/10';
      default: return 'stroke-zinc-200 dark:stroke-zinc-800';
    }
  }

  useEffect(() => {
      if (isEditing && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
      }
  }, [isEditing]);

  const handleEditSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      const val = parseInt(editValue);
      if (!isNaN(val) && val > 0 && val <= 120) {
          onEditTime(val);
      }
      setIsEditing(false);
  };

  return (
    <div className="relative flex items-center justify-center group w-full max-w-[280px] sm:max-w-[320px] aspect-square mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full rotate-[-90deg] transition-all duration-500"
      >
        <circle
          className={`${getBgColor()} transition-colors duration-500`}
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`${getColor()} transition-all duration-1000 ease-linear`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Inner Content - Absolutely Positioned to Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800 dark:text-zinc-100">
        {isEditing ? (
            <form onSubmit={handleEditSubmit} className="flex items-center justify-center mb-2 sm:mb-4">
                <input 
                    ref={inputRef}
                    type="number" 
                    className="w-24 sm:w-32 text-5xl sm:text-6xl font-bold bg-transparent text-center border-b-2 border-pomodoro outline-none text-zinc-900 dark:text-white"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditSubmit()}
                />
            </form>
        ) : (
            <div 
                className="relative group/time cursor-pointer"
                onClick={() => {
                    if (!isActive) {
                        setEditValue(Math.floor(timeLeft / 60).toString());
                        setIsEditing(true);
                    }
                }}
            >
                <div className="text-6xl sm:text-7xl font-light tracking-tighter font-sans select-none tabular-nums">
                    {formattedTime}
                </div>
                {!isActive && (
                    <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/time:opacity-100 transition-opacity text-zinc-400">
                        <Edit3 size={16} />
                    </div>
                )}
            </div>
        )}
        
        <button
          onClick={onToggle}
          className={`mt-4 sm:mt-6 px-8 sm:px-10 py-2.5 sm:py-3 rounded-full font-medium uppercase tracking-widest text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95
            ${isActive 
                ? 'bg-zinc-200 dark:bg-surfaceHighlight text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700' 
                : 'bg-pomodoro text-white hover:bg-pomodoro-dark shadow-glow'
            }`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
      </div>
    </div>
  );
};

export default CircularTimer;