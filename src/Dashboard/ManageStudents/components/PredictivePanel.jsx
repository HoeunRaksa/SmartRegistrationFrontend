import React, { useState } from 'react';
import Icon from '../../../Components/ManageStu-ui/AppIcon';
import Button from '../../../Components/ManageStu-ui/Button';

const PredictivePanel = () => {
  const [selectedModel, setSelectedModel] = useState('enrollment');

  const models = [
    { id: 'enrollment', label: 'Enrollment Forecast', icon: 'TrendingUp' },
    { id: 'retention', label: 'Retention Risk', icon: 'AlertTriangle' },
    { id: 'capacity', label: 'Capacity Planning', icon: 'Users' }
  ];

  const enrollmentForecast = [
    { period: 'Q1 2025', predicted: 2450, confidence: 92, trend: 'up' },
    { period: 'Q2 2025', predicted: 2680, confidence: 88, trend: 'up' },
    { period: 'Q3 2025', predicted: 2520, confidence: 85, trend: 'down' },
    { period: 'Q4 2025', predicted: 2750, confidence: 82, trend: 'up' }
  ];

  const riskIndicators = [
    { 
      category: 'High Risk Students', 
      count: 127, 
      percentage: 6.3, 
      factors: ['Low attendance', 'Poor grades', 'Financial issues'],
      severity: 'high'
    },
    { 
      category: 'Medium Risk Students', 
      count: 284, 
      percentage: 14.1, 
      factors: ['Irregular attendance', 'Academic struggles'],
      severity: 'medium'
    },
    { 
      category: 'Low Risk Students', 
      count: 1599, 
      percentage: 79.6, 
      factors: ['Good performance', 'Regular attendance'],
      severity: 'low'
    }
  ];

  const capacityRecommendations = [
    {
      program: 'Computer Science',
      currentCapacity: 800,
      recommendedCapacity: 950,
      reasoning: 'High demand, 18% increase expected',
      priority: 'high'
    },
    {
      program: 'Business Administration',
      currentCapacity: 650,
      recommendedCapacity: 680,
      reasoning: 'Steady growth, 5% increase expected',
      priority: 'medium'
    },
    {
      program: 'Liberal Arts',
      currentCapacity: 400,
      recommendedCapacity: 350,
      reasoning: 'Declining interest, 12% decrease expected',
      priority: 'low'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-muted border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const renderModelContent = () => {
    switch (selectedModel) {
      case 'enrollment':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground mb-3">
              Enrollment Predictions (Next 12 Months)
            </div>
            {enrollmentForecast?.map((forecast, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon 
                    name={forecast?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className={forecast?.trend === 'up' ? 'text-success' : 'text-error'}
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{forecast?.period}</div>
                    <div className="text-xs text-muted-foreground">{forecast?.confidence}% confidence</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{forecast?.predicted?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">students</div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  Model accuracy: 89.2% based on 3-year historical data. Factors include seasonal trends, economic indicators, and program popularity.
                </div>
              </div>
            </div>
          </div>
        );

      case 'retention':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground mb-3">
              Student Retention Risk Analysis
            </div>
            {riskIndicators?.map((risk, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getSeverityBg(risk?.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">{risk?.category}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold text-foreground">{risk?.count}</span>
                    <span className={`text-xs font-medium ${getSeverityColor(risk?.severity)}`}>
                      ({risk?.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {risk?.factors?.map((factor, factorIndex) => (
                    <div key={factorIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Dot" size={12} />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Button variant="outline" size="sm" iconName="Download" className="w-full">
                Export Risk Report
              </Button>
            </div>
          </div>
        );

      case 'capacity':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground mb-3">
              Capacity Planning Recommendations
            </div>
            {capacityRecommendations?.map((rec, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">{rec?.program}</div>
                  <Icon 
                    name="AlertCircle" 
                    size={16} 
                    className={getPriorityColor(rec?.priority)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="text-sm font-semibold text-foreground">{rec?.currentCapacity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Recommended</div>
                    <div className="text-sm font-semibold text-primary">{rec?.recommendedCapacity}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{rec?.reasoning}</div>
              </div>
            ))}
            <div className="mt-4">
              <Button variant="default" size="sm" iconName="Calendar" className="w-full">
                Schedule Planning Review
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Predictive Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-powered insights and forecasting
          </p>
        </div>
        <Icon name="Brain" size={20} className="text-primary" />
      </div>
      {/* Model Selector */}
      <div className="flex flex-col gap-2 mb-6">
        {models?.map((model) => (
          <Button
            key={model?.id}
            variant={selectedModel === model?.id ? "default" : "ghost"}
            size="sm"
            iconName={model?.icon}
            iconPosition="left"
            onClick={() => setSelectedModel(model?.id)}
            className="justify-start w-full"
          >
            {model?.label}
          </Button>
        ))}
      </div>
      {/* Model Content */}
      <div className="min-h-[400px]">
        {renderModelContent()}
      </div>
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Last updated: {new Date()?.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PredictivePanel;