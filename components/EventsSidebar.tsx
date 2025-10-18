import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClipboardList } from '@fortawesome/free-solid-svg-icons';
// Fix: Use relative path for local module import.
import type { Task } from '../types';
import CreateTaskModal from './CreateTaskModal';
import Button from './ui/Button';
// Fix: Use relative path for local module import.
import { useDataContext } from '../contexts/DataContext';

const PRIORITY_CLASSES: Record<Task['priority'], string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

const TaskCard: React.FC<{ task: Task; onToggle: (id: number) => void }> = ({ task, onToggle }) => {
  return (
    <div className={`p-4 rounded-lg bg-[#0D1117] flex items-center gap-4 transition-opacity duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
      <div className={`w-2 h-2 rounded-full ${PRIORITY_CLASSES[task.priority]} mt-1.5 flex-shrink-0`}></div>
      <div className="flex-1">
        <h3 className={`font-bold text-white ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
        <p className="text-xs text-gray-400">{task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>
      <label htmlFor={`task-${task.id}`} className="cursor-pointer">
          <input
              type="checkbox"
              id={`task-${task.id}`}
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="sr-only peer"
          />
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#161B22] border-2 border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
              <svg className="w-3 h-3 text-white hidden peer-checked:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
          </div>
      </label>
    </div>
  );
};

const TasksSidebar: React.FC = () => {
  const { tasks, handleAddTask, handleToggleTask } = useDataContext();
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
      <aside className="w-full lg:w-96 bg-[#161B22] flex-shrink-0 flex flex-col p-6 rounded-xl border border-gray-800">
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
                <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                <FontAwesomeIcon icon={faClipboardList} className="text-4xl mb-3 text-gray-600" />
                <h4 className="font-semibold text-gray-400">All Clear!</h4>
                <p>No {filter !== 'All' && filter.toLowerCase()} tasks found.</p>
              </div>
            )}
        </div>
      </aside>
      {isModalOpen && <CreateTaskModal onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />}
    </>
  );
};

export default TasksSidebar;