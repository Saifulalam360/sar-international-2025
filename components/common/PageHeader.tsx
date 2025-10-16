import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: IconDefinition;
  children?: React.ReactNode; // For action buttons
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, children }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          {icon && <FontAwesomeIcon icon={icon} />}
          {title}
        </h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
