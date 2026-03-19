import React from 'react';

interface CardProps {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  className = '',
  children,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2">{title}</p>
          {value && (
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      {children}
    </div>
  );
};

export default Card;
