import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string, est: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSelectActive: (id: string | null) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSelectActive,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estPomodoros, setEstPomodoros] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, estPomodoros);
    setNewTaskTitle('');
    setEstPomodoros(1);
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white dark:bg-surface rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-900">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Tasks</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-zinc-50 dark:bg-surfaceHighlight rounded-2xl animate-in fade-in zoom-in duration-200 border border-zinc-100 dark:border-zinc-800">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full bg-transparent border-none outline-none text-lg placeholder-zinc-400 mb-4 text-zinc-900 dark:text-white"
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Est.</span>
              <input
                type="number"
                min="1"
                max="10"
                className="w-12 bg-white dark:bg-zinc-900 rounded-lg px-2 py-1 text-center text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800"
                value={estPomodoros}
                onChange={(e) => setEstPomodoros(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wide bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
        {tasks.length === 0 && !isAdding && (
          <div className="text-center py-10 text-zinc-400">
            <p className="text-sm">No active tasks</p>
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
              activeTaskId === task.id
                ? 'bg-zinc-50 dark:bg-zinc-900 border-pomodoro dark:border-pomodoro/50 shadow-sm'
                : 'bg-white dark:bg-surface border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
            }`}
            onClick={() => onSelectActive(task.id === activeTaskId ? null : task.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  className={`shrink-0 transition-colors ${task.completed ? 'text-pomodoro' : 'text-zinc-300 hover:text-pomodoro'}`}
                >
                  {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                </button>
                <span className={`font-medium text-zinc-700 dark:text-zinc-200 truncate ${task.completed ? 'line-through text-zinc-400 dark:text-zinc-600' : ''}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                <span className="text-[10px] sm:text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 sm:px-2 py-1 rounded-md whitespace-nowrap">
                  {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 sm:p-1.5 text-zinc-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;