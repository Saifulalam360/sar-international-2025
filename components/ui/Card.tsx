import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: IconDefinition;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-[#161B22] p-6 rounded-xl border border-gray-800 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          {icon && <FontAwesomeIcon icon={icon} className="text-gray-500" />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
