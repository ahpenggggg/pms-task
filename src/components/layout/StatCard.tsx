import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  color: 'yellow' | 'red' | 'green';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color }) => {
  const colorClasses = {
    yellow: 'bg-yellow-100',
    red: 'bg-red-200',
    green: 'bg-green-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-6 text-center`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;