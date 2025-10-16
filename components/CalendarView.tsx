import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { Task } from '../types';

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

const TaskDot: React.FC<{ task: Task }> = ({ task }) => (
  <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]}`} title={task.title} />
);


interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'year'>('month');

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday is 0

    const grid: (Date | null)[] = [];

    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      grid.push(new Date(year, month - 1, lastDayOfPrevMonth - i));
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(new Date(year, month, i));
    }

    const remainingCells = 42 - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
      grid.push(new Date(year, month + 1, i));
    }
    
    return grid;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="flex-1 flex flex-col bg-[#161B22] p-6 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">{monthName} {year}</h1>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full hover:bg-gray-700/50 flex items-center justify-center text-gray-400" aria-label="Previous month">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full hover:bg-gray-700/50 flex items-center justify-center text-gray-400" aria-label="Next month">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
        <div className="flex items-center bg-[#0D1117] rounded-full p-1">
          <button 
            onClick={() => setView('month')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${view === 'month' ? 'bg-gray-200 text-black' : 'text-gray-400'}`}
          >
            MONTH
          </button>
          <button 
            onClick={() => setView('year')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${view === 'year' ? 'bg-gray-200 text-black' : 'text-gray-400'}`}
          >
            YEAR
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-800 flex-1 border border-gray-800 rounded-lg overflow-hidden">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center py-2 text-xs font-bold text-gray-500 bg-[#161B22]">
            {day}
          </div>
        ))}
        {calendarGrid.map((date, index) => {
          if (!date) return <div key={index} />;
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const tasksOnDay = tasks.filter(t => t.dueDate.toDateString() === date.toDateString());
          
          return (
            <div key={index} className="bg-[#161B22] p-2 flex flex-col min-h-[90px]">
              <span className={`font-semibold text-sm ${isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}`}>
                {date.getDate()}
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                {tasksOnDay.map(task => <TaskDot key={task.id} task={task} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
