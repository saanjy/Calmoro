export enum TimerMode {
  POMODORO = 'POMODORO',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  minutesFocused: number;
  sessionsCompleted: number;
}

export interface Settings {
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // sessions before long break
  dailyGoal: number;
}

export interface AppState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  isActive: boolean;
  sessionsCompleted: number;
  stats: DailyStats[];
  tasks: Task[];
  activeTaskId: string | null;
  settings: Settings;
  streak: number;
  lastActiveDate: string;
}

export type SoundType = 'none' | 'rain' | 'white_noise' | 'brown' | 'cafe';