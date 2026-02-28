
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <i className={`fa-solid ${icon} text-indigo-600 dark:text-indigo-400 text-xl`}></i>}
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
