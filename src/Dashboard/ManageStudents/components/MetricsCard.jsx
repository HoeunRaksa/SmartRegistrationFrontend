import React from 'react';
import Icon from '../../../Components/ManageStu-ui/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, description }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon name={icon} size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="mb-2">
            <span className="text-2xl font-semibold text-foreground">{value}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricsCard;