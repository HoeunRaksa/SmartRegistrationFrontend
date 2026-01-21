# Teacher Side Implementation Guide

## Overview
This document explains the TeacherSide architecture and how it integrates with the existing AdminSide and StudentSide systems.

## Architecture Analysis

### AdminSide Structure (Reference)
The adminSide follows a well-defined pattern that TeacherSide should replicate:

```
adminSide/
├── ConponentsAdmin/     # Reusable form & list components
│   ├── GradeForm.jsx   # Form for creating/editing grades
│   ├── GradesList.jsx  # Table displaying all grades
│   ├── AssignmentForm.jsx
│   ├── AssignmentsList.jsx
│   ├── AttendanceForm.jsx
│   ├── AttendanceList.jsx
│   ├── ScheduleForm.jsx
│   ├── SchedulesList.jsx
│   └── ... (more components)
└── pageAdmin/           # Full-page container components
    ├── GradesPage.jsx  # Stats + Form + List
    ├── AssignmentsPage.jsx
    ├── AttendancePage.jsx
    └── ... (more pages)
```

### TeacherSide Structure (To Implement)
TeacherSide should mirror this exact structure:

```
teacherSide/
├── ConponentsTeacher/   # Teacher-specific components
│   ├── GradeForm.jsx   # ✅ CREATED (uses teacher_api)
│   ├── GradesList.jsx  # TODO: Create (copy from admin, use teacher_api)
│   ├── AssignmentForm.jsx  # TODO
│   ├── AssignmentsList.jsx # TODO
│   ├── AttendanceForm.jsx  # TODO
│   ├── AttendanceList.jsx  # TODO
│   └── ... (more needed)
└── pageTeacher/
    ├── TeacherDashboard.jsx  # ✅ EXISTS (main container)
    ├── DashboardHome.jsx     # ✅ EXISTS (needs API integration)
    ├── GradesPage.jsx        # TODO: Update to use ConponentsTeacher
    ├── AssignmentsPage.jsx   # TODO
    ├── AttendancePage.jsx    # TODO
    ├── CoursesPage.jsx       # TODO
    ├── StudentsPage.jsx      # TODO
    ├── SchedulePage.jsx      # TODO
    ├── MessagesPage.jsx      # TODO
    └── ProfilePage.jsx       # ✅ EXISTS
```

## API Structure

### ✅ Created: `src/api/teacher_api.jsx`
Teacher API endpoints mirror admin endpoints but use `/teacher/` prefix:

| Admin Endpoint | Teacher Endpoint | Purpose |
|----------------|------------------|---------|
| `/admin/grades` | `/teacher/grades` | Fetch teacher's grades |
| `/admin/assignments` | `/teacher/assignments` | Teacher's assignments |
| `/admin/attendance` | `/teacher/attendance` | Teacher's attendance records |
| `/admin/schedules` | `/teacher/schedules` | Teacher's class schedules |
| `/admin/courses` | `/teacher/courses` | Teacher's assigned courses |
| N/A | `/teacher/students` | Students in teacher's courses |
| N/A | `/teacher/dashboard/stats` | Dashboard statistics |

### API Functions Available:

**Courses:**
- `fetchTeacherCourses()` - Get all courses assigned to teacher
- `fetchCourseStudents(courseId)` - Get students in a specific course

**Grades:**
- `fetchTeacherGrades()` - Get all grades for teacher's courses
- `createTeacherGrade(gradeData)` - Create new grade
- `updateTeacherGrade(gradeId, gradeData)` - Update grade
- `deleteTeacherGrade(gradeId)` - Delete grade

**Assignments:**
- `fetchTeacherAssignments()` - Get all assignments
- `createTeacherAssignment(assignmentData)` - Create assignment
- `updateTeacherAssignment(assignmentId, data)` - Update assignment
- `deleteTeacherAssignment(assignmentId)` - Delete assignment
- `fetchTeacherSubmissions(assignmentId)` - Get submissions
- `gradeTeacherSubmission(submissionId, gradeData)` - Grade submission

**Attendance:**
- `fetchTeacherAttendance()` - Get all attendance records
- `createTeacherClassSession(sessionData)` - Create class session
- `markTeacherAttendance(attendanceData)` - Mark attendance
- `updateTeacherAttendance(attendanceId, status)` - Update status

**Other:**
- `fetchTeacherSchedules()` - Get class schedules
- `fetchTeacherStudents()` - Get all students
- `fetchTeacherDashboardStats()` - Get dashboard stats
- `fetchTeacherConversations()` - Get message conversations
- `sendTeacherMessage(messageData)` - Send message

## Data Structures

### Grade Data Structure
```javascript
{
  student_id: number,
  course_id: number,
  assignment_name: string,
  score: number,
  total_points: number,
  letter_grade: string,        // "A", "B+", etc.
  grade_point: number,          // 4.0, 3.5, etc.
  feedback: string | null,
  semester: string,             // "Fall", "Spring"
  academic_year: string         // "2024-2025"
}
```

### Assignment Data Structure
```javascript
{
  course_id: number,
  title: string,
  description: string | null,
  due_date: string,             // "YYYY-MM-DDTHH:mm"
  total_points: number,
  assignment_type: string       // "homework", "quiz", "exam", "project", "lab"
}
```

### Attendance Data Structure
```javascript
// Class Session
{
  course_id: number,
  session_date: string,         // "YYYY-MM-DD"
  start_time: string,           // "HH:mm"
  end_time: string              // "HH:mm"
}

// Attendance Record
{
  student_id: number,
  class_session_id: number,
  status: string,               // "present", "absent", "late", "excused"
  remarks: string | null
}
```

## Implementation Pattern

### Page Pattern (Example: GradesPage.jsx)

```javascript
import React, { useEffect, useState } from "react";
import GradeForm from "../ConponentsTeacher/GradeForm.jsx";
import GradesList from "../ConponentsTeacher/GradesList.jsx";
import { fetchTeacherGrades } from "../../api/teacher_api.jsx";
import { fetchTeacherStudents } from "../../api/teacher_api.jsx";
import { fetchTeacherCourses } from "../../api/teacher_api.jsx";

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGrades();
    loadStudents();
    loadCourses();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const res = await fetchTeacherGrades();
      const data = res.data?.data || [];
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load grades:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await fetchTeacherStudents();
      const data = res.data?.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await fetchTeacherCourses();
      const data = res.data?.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    loadGrades();
    setEditingGrade(null);
  };

  const handleCancel = () => {
    setEditingGrade(null);
  };

  // Stats calculation
  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (parseFloat(g.grade_point) || 0), 0) / grades.length).toFixed(2)
    : 0;

  const quickStats = [
    {
      label: "Total Grades",
      value: grades.length,
      color: "from-purple-500 to-pink-500",
      icon: Award,
    },
    {
      label: "Students Graded",
      value: new Set(grades.map(g => g.student_id)).size,
      color: "from-blue-500 to-cyan-500",
      icon: Users,
    },
    {
      label: "Avg GPA",
      value: averageGrade,
      color: "from-green-500 to-emerald-500",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "…" : stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <GradeForm
        editingGrade={editingGrade}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        onUpdate={loadGrades}
        students={students}
        courses={courses}
      />

      {/* Grades List */}
      <GradesList
        grades={grades}
        onEdit={handleEdit}
        onRefresh={loadGrades}
      />
    </div>
  );
};

export default GradesPage;
```

## Form Component Pattern

### ✅ Example Created: `ConponentsTeacher/GradeForm.jsx`

Key features:
1. **Edit Mode Detection**: `const isEditMode = !!editingGrade;`
2. **Form State**: Uses `INITIAL_FORM_STATE` constant
3. **useEffect Sync**: Syncs form with `editingGrade` prop
4. **Validation**: Client-side (required fields) + server-side error handling
5. **Loading States**: `loading`, `success`, `error` states
6. **API Calls**: Uses teacher API functions
7. **Animations**: Framer Motion for smooth UX

**Pattern to follow for other forms:**
- Copy `GradeForm.jsx` structure
- Update field definitions in `INPUT_FIELDS`
- Change API calls to appropriate teacher functions
- Update icons and labels

## List Component Pattern

### To Create: `ConponentsTeacher/GradesList.jsx`

Copy from `adminSide/ConponentsAdmin/GradesList.jsx` and make these changes:

```javascript
// Change import
import { deleteTeacherGrade } from "../../api/teacher_api.jsx";

// Update delete handler
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this grade?")) return;
  try {
    await deleteTeacherGrade(id);  // Changed from deleteGrade
    if (onRefresh) onRefresh();
  } catch (err) {
    console.error("Failed to delete grade:", err);
    alert(err.response?.data?.message || "Failed to delete grade");
  }
};
```

**That's it!** The rest of the component stays the same.

## StudentSide Integration

### How StudentSide Gets Data from Admin/Teacher Changes

StudentSide pages should use the existing student APIs which fetch data created by admin/teachers:

**Example: StudentSide AttendancePage**
```javascript
import { useEffect, useState } from 'react';
import API from '../../api';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadAttendance();

    // Optional: Auto-refresh every 30 seconds to get latest data
    const interval = setInterval(loadAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await API.get('/student/attendance');  // Backend returns all attendance records for this student
      const data = res.data?.data || [];
      setAttendance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  };

  return (
    // ... render attendance records
  );
};
```

**Key Points:**
1. StudentSide uses `/student/*` endpoints
2. Backend filters data by authenticated student ID
3. When admin/teacher creates attendance, it's stored in DB
4. Student API fetches from same DB tables
5. No special "sync" needed - it's automatic via shared database

### Student Endpoints That Fetch Admin/Teacher Data

| Student Endpoint | Gets Data Created By | Purpose |
|-----------------|---------------------|---------|
| `/student/courses/enrolled` | Admin (enrollments) | Student's enrolled courses |
| `/student/grades` | Admin/Teacher (grades) | Student's grades |
| `/student/assignments` | Admin/Teacher (assignments) | Assignments for student's courses |
| `/student/attendance` | Admin/Teacher (attendance) | Student's attendance records |
| `/student/schedule` | Admin (schedules) | Class schedules |

### Adding Real-Time Updates (Optional Enhancement)

If you want real-time updates without refresh:

```javascript
// Use existing SignalR/Laravel Echo setup
import Echo from 'laravel-echo';

useEffect(() => {
  // Listen for grade updates
  window.Echo.private(`student.${user.id}`)
    .listen('GradeCreated', (e) => {
      // Reload grades when teacher creates new grade
      loadGrades();
    })
    .listen('AttendanceMarked', (e) => {
      loadAttendance();
    });

  return () => {
    window.Echo.leave(`student.${user.id}`);
  };
}, []);
```

## TODO Checklist

### Teacher Components to Create:

#### ConponentsTeacher/
- [x] GradeForm.jsx
- [ ] GradesList.jsx (copy from admin, change API)
- [ ] AssignmentForm.jsx (copy from admin, change API)
- [ ] AssignmentsList.jsx
- [ ] AttendanceForm.jsx
- [ ] AttendanceList.jsx

#### pageTeacher/
- [ ] Update DashboardHome.jsx to use `fetchTeacherDashboardStats()`
- [ ] Update GradesPage.jsx to match admin pattern
- [ ] Update AssignmentsPage.jsx
- [ ] Update AttendancePage.jsx
- [ ] Update CoursesPage.jsx (show teacher's courses)
- [ ] Update StudentsPage.jsx (show teacher's students)
- [ ] Update SchedulePage.jsx
- [ ] Update MessagesPage.jsx

### StudentSide Updates:
- [ ] Verify all pages use correct `/student/*` endpoints
- [ ] Add auto-refresh intervals (optional)
- [ ] Add real-time listeners (optional, SignalR already configured)

## Quick Start Instructions

### To Create a New Teacher Component:

1. **Copy the equivalent Admin component**
   ```bash
   cp src/adminSide/ConponentsAdmin/GradesList.jsx src/teacherSide/ConponentsTeacher/GradesList.jsx
   ```

2. **Update the imports**
   ```javascript
   // Change this:
   import { deleteGrade } from "../../api/admin_course_api.jsx";

   // To this:
   import { deleteTeacherGrade } from "../../api/teacher_api.jsx";
   ```

3. **Update API function calls**
   ```javascript
   // Change all admin API calls to teacher API calls
   deleteGrade(id) → deleteTeacherGrade(id)
   updateGrade(id, data) → updateTeacherGrade(id, data)
   ```

4. **That's it!** No other changes needed.

### To Update a Teacher Page:

1. **Copy the equivalent Admin page structure**
2. **Import teacher components**
   ```javascript
   import GradeForm from "../ConponentsTeacher/GradeForm.jsx";
   import GradesList from "../ConponentsTeacher/GradesList.jsx";
   import { fetchTeacherGrades } from "../../api/teacher_api.jsx";
   ```

3. **Use teacher API functions**
   - Replace `fetchAllGrades()` with `fetchTeacherGrades()`
   - Replace `fetchStudents()` with `fetchTeacherStudents()`
   - Replace `fetchCourses()` with `fetchTeacherCourses()`

4. **Keep the same UI/structure** - Just swap the APIs!

## Summary

**What's Done:**
- ✅ Teacher API created (`src/api/teacher_api.jsx`)
- ✅ GradeForm component created as template
- ✅ Architecture documented
- ✅ Integration patterns explained

**What You Need:**
- Copy admin components → Rename to teacher components
- Change API imports
- Update function calls
- Test with backend

**Key Principle:**
> TeacherSide is almost identical to AdminSide, just using `/teacher/*` endpoints instead of `/admin/*` endpoints. Copy, rename APIs, done!

This architecture ensures:
- **Consistency** across admin/teacher/student interfaces
- **Maintainability** - Same patterns everywhere
- **Scalability** - Easy to add new features
- **Data Integrity** - Shared database, automatic sync
