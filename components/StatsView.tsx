import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyStats } from '../types';
import { Flame, Trophy, Calendar } from 'lucide-react';

interface StatsViewProps {
  stats: DailyStats[];
  streak: number;
  totalSessions: number;
}

const StatsView: React.FC<StatsViewProps> = ({ stats, streak, totalSessions }) => {
  // Ensure we have data for the last 7 days even if empty
  const data = React.useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const stat = stats.find(s => s.date === dateStr);
      
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: stat ? stat.sessionsCompleted : 0,
      });
    }
    return days;
  }, [stats]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 sm:px-0">
      {/* Responsive Grid: 1 col on mobile, 3 cols on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-surface p-6 rounded-3xl shadow-sm flex flex-row sm:flex-col items-center justify-between sm:justify-center border border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center space-x-4 sm:flex-col sm:space-x-0 sm:space-y-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Flame className="text-orange-500" size={20} />
            </div>
            <span className="text-xs text-zinc-400 uppercase tracking-widest sm:mt-1">Streak</span>
          </div>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{streak}</span>
        </div>

        <div className="bg-white dark:bg-surface p-6 rounded-3xl shadow-sm flex flex-row sm:flex-col items-center justify-between sm:justify-center border border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center space-x-4 sm:flex-col sm:space-x-0 sm:space-y-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Trophy className="text-yellow-500" size={20} />
            </div>
            <span className="text-xs text-zinc-400 uppercase tracking-widest sm:mt-1">Total</span>
          </div>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{totalSessions}</span>
        </div>

        <div className="bg-white dark:bg-surface p-6 rounded-3xl shadow-sm flex flex-row sm:flex-col items-center justify-between sm:justify-center border border-zinc-100 dark:border-zinc-900">
           <div className="flex items-center space-x-4 sm:flex-col sm:space-x-0 sm:space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="text-blue-500" size={20} />
            </div>
            <span className="text-xs text-zinc-400 uppercase tracking-widest sm:mt-1">Hours</span>
          </div>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{(totalSessions * 25 / 60).toFixed(1)}h</span>
        </div>
      </div>

      <div className="bg-white dark:bg-surface p-4 sm:p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-900">
        <h3 className="text-lg font-semibold mb-6 sm:mb-8 text-zinc-800 dark:text-zinc-200">Weekly Activity</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a', 
                    borderRadius: '12px', 
                    color: '#fff' 
                }}
              />
              <Bar dataKey="sessions" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sessions > 0 ? '#e11d48' : '#3f3f46'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsView;