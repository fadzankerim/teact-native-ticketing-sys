import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Card from './Card';

// eslint-disable-next-line no-unused-vars
const KPICard = ({ title, value, change, icon: Icon, color, trend }) => (
  <Card className="overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-textSecondary mb-1">{title}</p>
        <p className="text-3xl font-bold text-textPrimary">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUp className="w-4 h-4 text-success mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-error mr-1" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              {change}
            </span>
            <span className="text-sm text-textSecondary ml-1">vs last week</span>
          </div>
        )}
      </div>
      {/* Icon is used here - renders the passed icon component */}
      <div className={`w-16 h-16 ${color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  </Card>
);

export default KPICard;