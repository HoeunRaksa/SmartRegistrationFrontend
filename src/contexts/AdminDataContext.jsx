import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { initGlobalStateIntegration } from '../utils/globalDataCache';

/**
 * Global Admin Data Context
 *
 * Provides centralized state management for all admin data.
 * When data is updated in one page, all other pages are automatically notified.
 * No need to refresh pages manually.
 */

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
  // Global data stores
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [majorSubjects, setMajorSubjects] = useState([]);

  // Track last update timestamps
  const lastUpdateRef = useRef({});

  // Generic update function with timestamp tracking
  const updateData = useCallback((key, data) => {
    lastUpdateRef.current[key] = Date.now();

    switch(key) {
      case 'departments': setDepartments(data); break;
      case 'majors': setMajors(data); break;
      case 'subjects': setSubjects(data); break;
      case 'students': setStudents(data); break;
      case 'courses': setCourses(data); break;
      case 'registrations': setRegistrations(data); break;
      case 'staff': setStaff(data); break;
      case 'teachers': setTeachers(data); break;
      case 'enrollments': setEnrollments(data); break;
      case 'grades': setGrades(data); break;
      case 'assignments': setAssignments(data); break;
      case 'attendance': setAttendance(data); break;
      case 'schedules': setSchedules(data); break;
      case 'classGroups': setClassGroups(data); break;
      case 'majorSubjects': setMajorSubjects(data); break;
      default: break;
    }
  }, []);

  // Individual update functions
  const updateDepartments = useCallback((data) => updateData('departments', data), [updateData]);
  const updateMajors = useCallback((data) => updateData('majors', data), [updateData]);
  const updateSubjects = useCallback((data) => updateData('subjects', data), [updateData]);
  const updateStudents = useCallback((data) => updateData('students', data), [updateData]);
  const updateCourses = useCallback((data) => updateData('courses', data), [updateData]);
  const updateRegistrations = useCallback((data) => updateData('registrations', data), [updateData]);
  const updateStaff = useCallback((data) => updateData('staff', data), [updateData]);
  const updateTeachers = useCallback((data) => updateData('teachers', data), [updateData]);
  const updateEnrollments = useCallback((data) => updateData('enrollments', data), [updateData]);
  const updateGrades = useCallback((data) => updateData('grades', data), [updateData]);
  const updateAssignments = useCallback((data) => updateData('assignments', data), [updateData]);
  const updateAttendance = useCallback((data) => updateData('attendance', data), [updateData]);
  const updateSchedules = useCallback((data) => updateData('schedules', data), [updateData]);
  const updateClassGroups = useCallback((data) => updateData('classGroups', data), [updateData]);
  const updateMajorSubjects = useCallback((data) => updateData('majorSubjects', data), [updateData]);

  // Get last update timestamp for a data type
  const getLastUpdate = useCallback((key) => {
    return lastUpdateRef.current[key] || 0;
  }, []);

  // Reset all data (for logout, etc.)
  const resetAllData = useCallback(() => {
    setDepartments([]);
    setMajors([]);
    setSubjects([]);
    setStudents([]);
    setCourses([]);
    setRegistrations([]);
    setStaff([]);
    setTeachers([]);
    setEnrollments([]);
    setGrades([]);
    setAssignments([]);
    setAttendance([]);
    setSchedules([]);
    setClassGroups([]);
    setMajorSubjects([]);
    lastUpdateRef.current = {};
  }, []);

  const value = {
    // Data
    departments,
    majors,
    subjects,
    students,
    courses,
    registrations,
    staff,
    teachers,
    enrollments,
    grades,
    assignments,
    attendance,
    schedules,
    classGroups,
    majorSubjects,

    // Update functions
    updateDepartments,
    updateMajors,
    updateSubjects,
    updateStudents,
    updateCourses,
    updateRegistrations,
    updateStaff,
    updateTeachers,
    updateEnrollments,
    updateGrades,
    updateAssignments,
    updateAttendance,
    updateSchedules,
    updateClassGroups,
    updateMajorSubjects,

    // Utilities
    getLastUpdate,
    resetAllData,
  };

  // Initialize integration with existing cache system
  useEffect(() => {
    initGlobalStateIntegration(value);
  }, [value]);

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

// Custom hook to use admin data
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

export default AdminDataContext;
