import React, { useState } from 'react';
import Icon from '../../../Components/ManageStu-ui/AppIcon';
import Button from '../../../Components/ManageStu-ui/Button';
import Select from '../../../Components/ManageStu-ui/Select';

const GlobalControls = ({ onFiltersChange }) => {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedDemographic, setSelectedDemographic] = useState('all');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const academicYears = [
    { value: '2024-2025', label: '2024-2025 Academic Year' },
    { value: '2023-2024', label: '2023-2024 Academic Year' },
    { value: '2022-2023', label: '2022-2023 Academic Year' },
    { value: '2021-2022', label: '2021-2022 Academic Year' }
  ];

  const programs = [
    { value: 'all', label: 'All Programs' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'business-admin', label: 'Business Administration' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'liberal-arts', label: 'Liberal Arts' },
    { value: 'health-sciences', label: 'Health Sciences' }
  ];

  const demographics = [
    { value: 'all', label: 'All Demographics' },
    { value: 'age-group', label: 'By Age Group' },
    { value: 'gender', label: 'By Gender' },
    { value: 'location', label: 'By Location' },
    { value: 'enrollment-type', label: 'By Enrollment Type' },
    { value: 'financial-aid', label: 'By Financial Aid Status' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleFilterChange = (filterType, value) => {
    const filters = {
      year: selectedYear,
      program: selectedProgram,
      demographic: selectedDemographic,
      comparison: comparisonMode
    };

    switch (filterType) {
      case 'year':
        setSelectedYear(value);
        filters.year = value;
        break;
      case 'program':
        setSelectedProgram(value);
        filters.program = value;
        break;
      case 'demographic':
        setSelectedDemographic(value);
        filters.demographic = value;
        break;
      case 'comparison':
        setComparisonMode(value);
        filters.comparison = value;
        break;
    }

    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section - Primary Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">Academic Year:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <Select
              options={academicYears}
              value={selectedYear}
              onChange={(value) => handleFilterChange('year', value)}
              placeholder="Select academic year"
            />
            
            <Select
              options={programs}
              value={selectedProgram}
              onChange={(value) => handleFilterChange('program', value)}
              placeholder="Filter by program"
            />
            
            <Select
              options={demographics}
              value={selectedDemographic}
              onChange={(value) => handleFilterChange('demographic', value)}
              placeholder="Segment by demographics"
            />
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-3">
          {/* Comparison Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={comparisonMode ? "default" : "outline"}
              size="sm"
              iconName="GitCompare"
              onClick={() => handleFilterChange('comparison', !comparisonMode)}
            >
              Compare Periods
            </Button>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            loading={refreshing}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          {/* Export Options */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
            >
              Export
            </Button>
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
          >
            <span className="sr-only">Dashboard settings</span>
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      {(selectedProgram !== 'all' || selectedDemographic !== 'all' || comparisonMode) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          <div className="flex items-center gap-2 flex-wrap">
            {selectedProgram !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {programs?.find(p => p?.value === selectedProgram)?.label}
                <button
                  onClick={() => handleFilterChange('program', 'all')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {selectedDemographic !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                {demographics?.find(d => d?.value === selectedDemographic)?.label}
                <button
                  onClick={() => handleFilterChange('demographic', 'all')}
                  className="hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {comparisonMode && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                Comparison Mode
                <button
                  onClick={() => handleFilterChange('comparison', false)}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProgram('all');
              setSelectedDemographic('all');
              setComparisonMode(false);
              handleFilterChange('program', 'all');
            }}
            className="text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            Clear all
          </Button>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">2,250</div>
          <div className="text-xs text-muted-foreground">Total Students</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">89.2%</div>
          <div className="text-xs text-muted-foreground">Retention Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">4</div>
          <div className="text-xs text-muted-foreground">Active Programs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">127</div>
          <div className="text-xs text-muted-foreground">At-Risk Students</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;