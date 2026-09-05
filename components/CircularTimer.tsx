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
    <div className="relative flex items-center justify-center group w-full max-w-[320px] sm:max-w-[380px] aspect-square mx-auto">
      {/* Outer Edit Button */}
      {!isActive && !isEditing && (
        <button
          onClick={() => {
            setEditValue(Math.floor(timeLeft / 60).toString());
            setIsEditing(true);
          }}
          className="absolute -top-2 -right-2 sm:top-2 sm:right-2 p-3 bg-white/20 dark:bg-black/40 hover:bg-white/40 dark:hover:bg-black/60 backdrop-blur-md rounded-full transition-all text-zinc-600 dark:text-zinc-400 z-20 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          title="Edit Time"
        >
          <Edit3 size={18} />
        </button>
      )}

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
            <div 
                className="flex flex-col items-center animate-in zoom-in duration-200 w-full px-8 relative z-20"
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        handleEditSubmit();
                    }
                }}
            >
                <form onSubmit={handleEditSubmit} className="flex flex-col items-center justify-center w-full relative">
                    <input 
                        ref={inputRef}
                        type="number" 
                        className="w-full text-5xl sm:text-7xl font-light tracking-tighter bg-transparent text-center outline-none text-zinc-900 dark:text-white tabular-nums p-0 z-10 relative mb-4 h-16 sm:h-20"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                    />
                    
                    {/* Range Slider Overlay */}
                    <div className="w-4/5 sm:w-3/4 relative h-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-visible flex items-center mb-6">
                        <input 
                            type="range"
                            min="1"
                            max="120"
                            value={editValue || 1}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        {/* Custom Track Fill */}
                        <div 
                            className="h-full bg-pomodoro rounded-full pointer-events-none"
                            style={{ width: `${Math.min(100, (parseInt(editValue || '1') / 120) * 100)}%` }}
                        />
                        {/* Custom Thumb */}
                        <div 
                            className="w-4 h-4 bg-white border-2 border-pomodoro rounded-full absolute pointer-events-none -translate-x-1/2 shadow-md"
                            style={{ left: `${Math.min(100, (parseInt(editValue || '1') / 120) * 100)}%` }}
                        />
                    </div>
                </form>
            </div>
        ) : (
            <div className="text-6xl sm:text-7xl font-light tracking-tighter font-sans select-none tabular-nums cursor-default">
                {formattedTime}
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