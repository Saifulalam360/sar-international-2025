import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: IconDefinition;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon, subtitle, ...props }) => {
  return (
    <div className={`bg-[#161B22] p-6 rounded-xl border border-gray-800 ${className}`} {...props}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon} className="text-gray-500" />}
            {title}
          </h3>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;