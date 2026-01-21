import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Calendar, Users, FileText } from 'lucide-react';

const AssignmentsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'CS301', name: 'Web Development' },
    { id: 'CS402', name: 'Database Systems' },
    { id: 'CS501', name: 'Software Engineering' },
  ];

  const assignments = [
    {
      id: 1,
      title: 'Build a React Todo App',
      course: 'Web Development',
      courseCode: 'CS301',
      dueDate: '2024-02-15',
      totalStudents: 28,
      submitted: 22,
      graded: 18,
      status: 'active',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Database Design Project',
      course: 'Database Systems',
      courseCode: 'CS402',
      dueDate: '2024-02-20',
      totalStudents: 32,
      submitted: 30,
      graded: 30,
      status: 'grading',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'UML Diagrams Assignment',
      course: 'Software Engineering',
      courseCode: 'CS501',
      dueDate: '2024-02-25',
      totalStudents: 24,
      submitted: 5,
      graded: 0,
      status: 'active',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const filteredAssignments = selectedCourse === 'all'
    ? assignments
    : assignments.filter(a => a.courseCode === selectedCourse);

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-blue-100 text-blue-700';
    if (status === 'grading') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  const getProgress = (submitted, total) => {
    return ((submitted / total) * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assignments</h1>
        <p className="text-gray-600">Create and manage course assignments</p>
      </motion.div>

      {/* Course Filter and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="flex-1 px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </motion.div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${assignment.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.course} ({assignment.courseCode})</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{assignment.totalStudents} Students</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Submissions</span>
                    <span className="font-semibold text-gray-800">{assignment.submitted}/{assignment.totalStudents}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                      style={{ width: `${getProgress(assignment.submitted, assignment.totalStudents)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Graded</span>
                    <span className="font-semibold text-gray-800">{assignment.graded}/{assignment.submitted}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${assignment.submitted > 0 ? getProgress(assignment.graded, assignment.submitted) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all text-gray-700 font-medium">
                  View Submissions
                </button>
                <button className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${assignment.color} text-white font-medium hover:shadow-lg transition-all`}>
                  Grade
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No assignments found</p>
        </motion.div>
      )}
    </div>
  );
};

export default AssignmentsPage;
