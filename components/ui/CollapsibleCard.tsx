import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface CollapsibleCardProps {
  children: React.ReactNode;
  className?: string;
  title: string; // Title is mandatory for a collapsible header
  icon?: IconDefinition;
  subtitle?: string;
  defaultOpen?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ children, className = '', title, icon, subtitle, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-[#161B22] rounded-xl border border-gray-800 transition-all duration-300 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon} className="text-gray-500" />}
            {title}
          </h3>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-gray-400 transition-transform duration-300" />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;
