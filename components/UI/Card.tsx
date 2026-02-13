
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <i className={`fa-solid ${icon} text-indigo-600 text-xl`}></i>}
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
