import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  leftIcon?: IconDefinition;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', leftIcon, className, ...props }) => {
  const baseClasses = "font-semibold text-sm py-2 px-4 rounded-lg transition-colors flex items-center gap-2 justify-center";
  
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30',
    secondary: 'bg-transparent border border-gray-700 hover:bg-[#161B22] text-gray-300',
    danger: 'bg-red-900/50 border border-red-500/50 hover:bg-red-900/80 text-red-300',
    ghost: 'text-gray-400 hover:bg-[#161B22]',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {leftIcon && <FontAwesomeIcon icon={leftIcon} />}
      {children}
    </button>
  );
};

export default Button;