import { Settings, TimerMode } from './types';

export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  dailyGoal: 8,
};

export const MODE_COLORS = {
  [TimerMode.POMODORO]: 'text-pomodoro bg-pomodoro-light/20 border-pomodoro',
  [TimerMode.SHORT_BREAK]: 'text-shortBreak bg-shortBreak-light/20 border-shortBreak',
  [TimerMode.LONG_BREAK]: 'text-longBreak bg-longBreak-light/20 border-longBreak',
};

export const MOTIVATIONAL_QUOTES = [
  "Focus on being productive instead of busy.",
  "The key is in not spending time, but in investing it.",
  "Small steps lead to big changes.",
  "Don't watch the clock; do what it does. Keep going.",
  "Your future is created by what you do today, not tomorrow.",
  "Starve your distractions, feed your focus.",
];
