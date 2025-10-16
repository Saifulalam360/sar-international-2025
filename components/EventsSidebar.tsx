import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Task } from '../types';
import CreateTaskModal from './CreateTaskModal';
import Button from './ui/Button';

const PRIORITY_CLASSES: Record<Task['priority'], string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

const TaskCard: React.FC<{ task: Task; onToggle: (id: number) => void }> = ({ task, onToggle }) => {
  return (
    <div className={`p-4 rounded-lg bg-[#0D1117] flex items-start gap-4 transition-opacity duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
      <div className={`w-2 h-2 rounded-full ${PRIORITY_CLASSES[task.priority]} mt-1.5 flex-shrink-0`}></div>
      <div className="flex-1">
        <h3 className={`font-bold text-white ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
        <p className="text-xs text-gray-400">{task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="form-checkbox h-5 w-5 bg-transparent border-gray-600 rounded-md text-blue-500 focus:ring-blue-500 cursor-pointer"
      />
    </div>
  );
};

interface TasksSidebarProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (id: number) => void;
}

const TasksSidebar: React.FC<TasksSidebarProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    if (filter === 'Pending') return sorted.filter(task => !task.completed);
    if (filter === 'Completed') return sorted.filter(task => task.completed);
    return sorted;
  }, [tasks, filter]);

  return (
    <>
      <aside className="w-96 bg-[#161B22] flex-shrink-0 flex flex-col p-6 rounded-xl border border-gray-800">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">My Tasks</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              aria-label="Add new task"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="hidden xl:inline">Add Task</span>
            </Button>
        </div>

        <div className="flex items-center bg-[#0D1117] rounded-full p-1 mb-6">
            {(['All', 'Pending', 'Completed'] as const).map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${filter === f ? 'bg-gray-200 text-black' : 'text-gray-400'}`}
                >
                    {f.toUpperCase()}
                </button>
            ))}
        </div>
        
        <div className="flex-1 space-y-4 overflow-y-auto -mr-2 pr-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                <p>No {filter !== 'All' && filter.toLowerCase()} tasks found.</p>
              </div>
            )}
        </div>
      </aside>
      {isModalOpen && <CreateTaskModal onClose={() => setIsModalOpen(false)} onAddTask={onAddTask} />}
    </>
  );
};

export default TasksSidebar;
