import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  const getColorFromName = (name) => {
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div 
      className={`
        ${sizes[size]} 
        ${getColorFromName(name)}
        rounded-full flex items-center justify-center
        text-white font-medium
        ${className}
      `}
    >
      {getInitials(name || 'U')}
    </div>
  );
};

export default Avatar;