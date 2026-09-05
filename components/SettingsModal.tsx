import React from 'react';
import { Settings } from '../types';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-zinc-200 dark:border-zinc-900 p-6 sm:p-8 mx-0 sm:mx-4 animate-in slide-in-from-bottom-10 sm:zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-light text-zinc-900 dark:text-white tracking-tight">Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide pb-4">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Timer Duration (min)</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] font-medium mb-2 text-zinc-500 truncate">Pomodoro</label>
                <input
                  type="number"
                  value={settings.pomodoroDuration}
                  onChange={(e) => handleChange('pomodoroDuration', Number(e.target.value))}
                  className="w-full p-2 sm:p-3 rounded-xl bg-zinc-50 dark:bg-surfaceHighlight border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none text-center text-base sm:text-lg font-medium dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium mb-2 text-zinc-500 truncate">Short Break</label>
                <input
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', Number(e.target.value))}
                  className="w-full p-2 sm:p-3 rounded-xl bg-zinc-50 dark:bg-surfaceHighlight border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none text-center text-base sm:text-lg font-medium dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium mb-2 text-zinc-500 truncate">Long Break</label>
                <input
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', Number(e.target.value))}
                  className="w-full p-2 sm:p-3 rounded-xl bg-zinc-50 dark:bg-surfaceHighlight border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none text-center text-base sm:text-lg font-medium dark:text-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Automation</h3>
             <div className="flex justify-between items-center p-1">
                <span className="text-sm font-medium dark:text-zinc-300">Auto-start Breaks</span>
                <input 
                    type="checkbox" 
                    checked={settings.autoStartBreaks}
                    onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                    className="w-5 h-5 accent-zinc-900 dark:accent-white rounded cursor-pointer"
                />
             </div>
             <div className="flex justify-between items-center p-1">
                <span className="text-sm font-medium dark:text-zinc-300">Auto-start Pomodoros</span>
                <input 
                    type="checkbox" 
                    checked={settings.autoStartPomodoros}
                    onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                    className="w-5 h-5 accent-zinc-900 dark:accent-white rounded cursor-pointer"
                />
             </div>
          </div>

          {/* Goal */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Daily Goal</h3>
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-zinc-300">Sessions per day</span>
                <input 
                    type="number"
                    value={settings.dailyGoal}
                    onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                    className="w-20 p-2 rounded-xl bg-zinc-50 dark:bg-surfaceHighlight border border-transparent outline-none text-center dark:text-white"
                />
             </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;