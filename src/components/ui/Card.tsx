import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description,
  footer,
}) => {
  return (
    <div
      className={`rounded-lg border bg-white shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-gray-200 p-6">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 