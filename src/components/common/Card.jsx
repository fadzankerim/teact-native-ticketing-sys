import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  headerAction,
  padding = true,
  hover = false,
  className = '' 
}) => {
  return (
    <div className={`
      bg-surface rounded-xl shadow-card border border-border/60
      ${hover ? 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5' : ''}
      ${className}
    `}>
      {(title || subtitle || headerAction) && (
        <div className={`flex items-center justify-between ${padding ? 'p-6 pb-4' : 'p-0'}`}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-textSecondary mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;
