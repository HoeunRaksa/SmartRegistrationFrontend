import React, { useState, useMemo } from 'react';
import Icon from '../../../Components/ManageStu-ui/AppIcon';
import Button from '../../../Components/ManageStu-ui/Button';
import Input from '../../..//Components/ManageStu-ui/Input';
import Select from '../../../Components/ManageStu-ui/Select';

const StudentDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('enrollmentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const itemsPerPage = 10;

  const studentData = [
    {
      id: 'STU001',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
      program: 'Computer Science',
      enrollmentDate: '2024-01-15',
      status: 'Active',
      gpa: 3.8,
      credits: 45,
      riskLevel: 'Low',
      lastActivity: '2024-10-06'
    },
    {
      id: 'STU002',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      program: 'Business Administration',
      enrollmentDate: '2024-02-01',
      status: 'Active',
      gpa: 3.2,
      credits: 38,
      riskLevel: 'Medium',
      lastActivity: '2024-10-05'
    },
    {
      id: 'STU003',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      program: 'Engineering',
      enrollmentDate: '2023-09-10',
      status: 'Graduated',
      gpa: 3.9,
      credits: 120,
      riskLevel: 'Low',
      lastActivity: '2024-05-15'
    },
    {
      id: 'STU004',
      name: 'David Thompson',
      email: 'david.thompson@university.edu',
      program: 'Liberal Arts',
      enrollmentDate: '2024-03-20',
      status: 'Active',
      gpa: 2.8,
      credits: 28,
      riskLevel: 'High',
      lastActivity: '2024-09-28'
    },
    {
      id: 'STU005',
      name: 'Lisa Wang',
      email: 'lisa.wang@university.edu',
      program: 'Computer Science',
      enrollmentDate: '2023-08-25',
      status: 'Active',
      gpa: 3.6,
      credits: 67,
      riskLevel: 'Low',
      lastActivity: '2024-10-07'
    },
    {
      id: 'STU006',
      name: 'James Miller',
      email: 'james.miller@university.edu',
      program: 'Business Administration',
      enrollmentDate: '2024-01-08',
      status: 'Dropped',
      gpa: 2.1,
      credits: 15,
      riskLevel: 'High',
      lastActivity: '2024-08-12'
    },
    {
      id: 'STU007',
      name: 'Maria Garcia',
      email: 'maria.garcia@university.edu',
      program: 'Engineering',
      enrollmentDate: '2023-09-15',
      status: 'Active',
      gpa: 3.7,
      credits: 72,
      riskLevel: 'Low',
      lastActivity: '2024-10-06'
    },
    {
      id: 'STU008',
      name: 'Robert Kim',
      email: 'robert.kim@university.edu',
      program: 'Computer Science',
      enrollmentDate: '2024-02-12',
      status: 'Active',
      gpa: 3.4,
      credits: 42,
      riskLevel: 'Medium',
      lastActivity: '2024-10-04'
    }
  ];

  const programOptions = [
    { value: 'all', label: 'All Programs' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Liberal Arts', label: 'Liberal Arts' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Graduated', label: 'Graduated' },
    { value: 'Dropped', label: 'Dropped' }
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = studentData?.filter(student => {
      const matchesSearch = student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           student?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           student?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesProgram = filterProgram === 'all' || student?.program === filterProgram;
      const matchesStatus = filterStatus === 'all' || student?.status === filterStatus;
      
      return matchesSearch && matchesProgram && matchesStatus;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'enrollmentDate' || sortField === 'lastActivity') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [studentData, searchTerm, sortField, sortDirection, filterProgram, filterStatus]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected?.has(studentId)) {
      newSelected?.delete(studentId);
    } else {
      newSelected?.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents?.size === paginatedData?.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(paginatedData.map(student => student.id)));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-success bg-green-50 border-green-200';
      case 'Graduated': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Dropped': return 'text-error bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 glass">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Student Cohort Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed student lifecycle tracking and management
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
          <Button variant="default" size="sm" iconName="Plus">
            Add Student
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
        
        <Select
          options={programOptions}
          value={filterProgram}
          onChange={setFilterProgram}
          placeholder="Filter by program"
        />
        
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={setFilterStatus}
          placeholder="Filter by status"
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedData?.length} students
          </span>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3">
                <input
                  type="checkbox"
                  checked={selectedStudents?.size === paginatedData?.length && paginatedData?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  Student
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('program')}
                  className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  Program
                  <Icon 
                    name={sortField === 'program' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('enrollmentDate')}
                  className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  Enrollment
                  <Icon 
                    name={sortField === 'enrollmentDate' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('gpa')}
                  className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  GPA
                  <Icon 
                    name={sortField === 'gpa' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Risk</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((student) => (
              <tr key={student?.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents?.has(student?.id)}
                    onChange={() => handleSelectStudent(student?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{student?.name}</div>
                    <div className="text-xs text-muted-foreground">{student?.email}</div>
                    <div className="text-xs text-muted-foreground">{student?.id}</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-foreground">{student?.program}</div>
                  <div className="text-xs text-muted-foreground">{student?.credits} credits</div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-foreground">
                    {new Date(student.enrollmentDate)?.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last active: {new Date(student.lastActivity)?.toLocaleDateString()}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium text-foreground">{student?.gpa}</div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student?.status)}`}>
                    {student?.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-sm font-medium ${getRiskColor(student?.riskLevel)}`}>
                    {student?.riskLevel}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" iconName="Eye" />
                    <Button variant="ghost" size="sm" iconName="Edit" />
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData?.length)} of {filteredAndSortedData?.length} students
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentDataTable;