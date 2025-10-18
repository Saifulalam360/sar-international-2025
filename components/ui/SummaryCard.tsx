import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SummaryCardProps {
  title: string;
  icon: IconDefinition;
  amount: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
  footerText?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, icon, amount, bgColor, iconColor, onClick, footerText }) => {
  return (
    <div 
        className={`group p-6 rounded-xl relative overflow-hidden transition-transform transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${bgColor}`}
        onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-white/80">{title}</p>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor} bg-white/20`}>
                <FontAwesomeIcon icon={icon} size="lg" />
            </div>
        </div>
        <p className="text-4xl font-bold text-white">{amount}</p>
        {footerText && <p className="text-xs text-white/60 mt-2">{footerText}</p>}
      </div>
      <FontAwesomeIcon icon={icon} className={`absolute -right-4 -bottom-4 text-white/5 text-7xl z-0 transition-transform transform group-hover:scale-110`} />
    </div>
  );
};

export default SummaryCard;
