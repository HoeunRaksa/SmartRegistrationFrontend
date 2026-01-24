# Global Admin Data State Management

## Overview

A centralized state management system for admin data that prevents unnecessary page refreshes and API calls. When data is updated in one page, all other pages are automatically notified and updated.

---

## Features

✅ **No Page Refresh Needed** - Update data in one page, all pages update automatically
✅ **Prevents 429 Errors** - Reduces redundant API calls through global caching
✅ **Zero Breaking Changes** - Works alongside existing code
✅ **Optional Integration** - Use it where needed, ignore where not
✅ **Type-Safe** - Full TypeScript support (if needed)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     App.jsx (Root)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            AdminDataProvider                         │   │
│  │  • Stores all admin data globally                    │   │
│  │  • Provides update functions                         │   │
│  │  • Notifies all subscribers on changes               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────┬──────────────┬─────────────┐
                              ▼             ▼              ▼             ▼
                       DepartmentsPage  MajorsPage   StudentsPage   Dashboard
                       (Subscribes to   (Subscribes  (Subscribes   (Subscribes
                        departments)     to majors)   to students)   to all)
```

---

## Quick Start

### 1. Already Integrated

The `AdminDataProvider` is already wrapped around your app in `App.jsx`. No setup needed!

### 2. Use in Any Component

```javascript
import { useGlobalData } from '../hooks/useGlobalData';
import { fetchDepartments } from '../api/department_api';

function DepartmentsPage() {
  // Option 1: Use global data hook (recommended)
  const { data: departments, loading, refresh } = useGlobalData(
    'departments',
    fetchDepartments,
    5 * 60 * 1000 // Cache for 5 minutes
  );

  // Option 2: Keep existing code and just add global state update
  const [localDepartments, setLocalDepartments] = useState([]);
  const { updateDepartments } = useAdminData();

  const loadDepartments = async () => {
    const res = await fetchDepartments();
    const data = res.data?.data || [];
    setLocalDepartments(data);
    updateDepartments(data); // Update global state
  };

  // Now other pages will see updated departments automatically!
}
```

---

## Integration Examples

### Example 1: Departments Page (Full Integration)

**Before:**
```javascript
import { useState, useEffect } from 'react';
import { fetchDepartments } from '../api/department_api';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetchDepartments();
      setDepartments(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  return <div>{/* UI */}</div>;
}
```

**After (Full Integration):**
```javascript
import { useGlobalData } from '../hooks/useGlobalData';
import { fetchDepartments } from '../api/department_api';

function DepartmentsPage() {
  // ✅ Instant load from global state if available
  // ✅ Auto-fetches if missing or stale
  // ✅ Updates all pages when refreshed
  const { data: departments, loading, refresh } = useGlobalData(
    'departments',
    fetchDepartments,
    5 * 60 * 1000 // Cache for 5 minutes
  );

  // After creating/updating/deleting, just call refresh()
  const handleCreate = async (formData) => {
    await createDepartment(formData);
    await refresh(); // ✅ All pages update automatically
  };

  return <div>{/* UI */}</div>;
}
```

**After (Minimal Integration - No Breaking Changes):**
```javascript
import { useState, useEffect } from 'react';
import { fetchDepartments } from '../api/department_api';
import { useAdminData } from '../contexts/AdminDataContext';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Just add this one line
  const { updateDepartments } = useAdminData();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetchDepartments();
      const data = res.data?.data || [];
      setDepartments(data);

      // ✅ Add this one line - now all pages get updates!
      updateDepartments(data);
    } finally {
      setLoading(false);
    }
  };

  return <div>{/* UI - NO CHANGES NEEDED */}</div>;
}
```

---

### Example 2: Dashboard (Read-Only)

```javascript
import { useAdminData } from '../contexts/AdminDataContext';

function Dashboard() {
  // ✅ Just read from global state - always up to date!
  const {
    departments,
    majors,
    subjects,
    students
  } = useAdminData();

  // No API calls needed if other pages already loaded the data!
  // Falls back to existing API calls if needed

  return (
    <div>
      <h1>Total Departments: {departments.length}</h1>
      <h1>Total Students: {students.length}</h1>
      {/* Always shows latest data from any page */}
    </div>
  );
}
```

---

### Example 3: Mixed Approach (Recommended)

```javascript
import { useState, useEffect } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';
import { fetchStudents, createStudent } from '../api/student_api';

function StudentsPage() {
  // Read from global state first
  const { students: globalStudents, updateStudents } = useAdminData();

  const [students, setStudents] = useState(globalStudents || []);
  const [loading, setLoading] = useState(false);

  // If global state has data, use it immediately
  useEffect(() => {
    if (globalStudents && globalStudents.length > 0) {
      setStudents(globalStudents);
    } else {
      loadStudents(); // Fetch if not available
    }
  }, [globalStudents]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetchStudents();
      const data = res.data?.data || [];
      setStudents(data);
      updateStudents(data); // Update global state
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (formData) => {
    await createStudent(formData);
    await loadStudents(); // Refresh and update global state
    // ✅ All other pages now see the new student!
  };

  return <div>{/* UI */}</div>;
}
```

---

## API Reference

### useAdminData Hook

```javascript
import { useAdminData } from '../contexts/AdminDataContext';

const {
  // Data (arrays)
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
  getLastUpdate,  // Get timestamp of last update
  resetAllData,   // Clear all data (on logout)
} = useAdminData();
```

### useGlobalData Hook

```javascript
import { useGlobalData } from '../hooks/useGlobalData';
import { fetchDepartments } from '../api/department_api';

const {
  data,           // Array of items
  loading,        // Boolean loading state
  error,          // Error object or null
  refresh,        // Function to force refresh
  isDataFresh,    // Boolean indicating if cache is valid
} = useGlobalData(
  'departments',      // Data key
  fetchDepartments,   // API function
  5 * 60 * 1000      // TTL in milliseconds
);
```

### Helper Hooks

```javascript
import { useCachedGlobalData, useFreshGlobalData } from '../hooks/useGlobalData';

// Long cache (15 minutes) - for rarely changing data
const { data: departments } = useCachedGlobalData('departments', fetchDepartments);

// No cache (always fresh) - for frequently changing data
const { data: registrations } = useFreshGlobalData('registrations', fetchRegistrations);
```

---

## Migration Strategy

### Phase 1: No Changes (Current State) ✅ DONE

- AdminDataProvider is wrapped around the app
- All existing code works unchanged
- Global state is available but not required

### Phase 2: Optional Integration (Recommended)

Add `updateXxx(data)` calls after fetching data:

```javascript
const loadData = async () => {
  const res = await fetchData();
  const data = res.data?.data || [];
  setData(data);
  updateData(data); // ← Add this one line
};
```

**Benefits:**
- Other pages see updates immediately
- Reduced API calls
- Better UX

### Phase 3: Full Integration (Optional)

Replace `useState` + `useEffect` with `useGlobalData`:

```javascript
// Before
const [data, setData] = useState([]);
useEffect(() => { loadData(); }, []);

// After
const { data, refresh } = useGlobalData('dataKey', fetchData);
```

**Benefits:**
- Simpler code
- Automatic caching
- Instant loads from other pages

---

## Benefits Summary

| Feature | Before | After |
|---------|--------|-------|
| **Page Load** | Always fetch API | Instant if cached |
| **After Update** | Manual refresh needed | All pages update automatically |
| **API Calls** | One per page | One shared across all pages |
| **Code Complexity** | useState + useEffect | One hook call |
| **User Experience** | Slow, stale data | Fast, always fresh |

---

## Example Workflow

1. **User opens Departments page**
   - `useGlobalData` fetches departments
   - Stores in global state
   - Displays data

2. **User creates new department**
   - Calls `refresh()`
   - Updates global state
   - Dashboard automatically shows new count! ✅

3. **User navigates to Majors page**
   - Departments still in global state
   - Dashboard still shows correct count without refetch! ✅

4. **User goes back to Departments**
   - Instant load from global state! ✅
   - No API call needed! ✅

---

## Best Practices

### ✅ DO

- Use `updateXxx()` after create/update/delete operations
- Call `refresh()` to force reload and notify all pages
- Use `useCachedGlobalData` for reference data (departments, majors, etc.)
- Use `useFreshGlobalData` for transactional data (registrations, etc.)

### ❌ DON'T

- Don't mix local state and global state without sync
- Don't forget to call `updateXxx()` after data changes
- Don't use global state for form inputs or UI-only data

---

## Troubleshooting

### Data not updating across pages?

Make sure you're calling the update function:

```javascript
const loadData = async () => {
  const res = await fetchData();
  const data = res.data?.data || [];
  updateData(data); // ← Don't forget this!
};
```

### Getting stale data?

Force a refresh:

```javascript
const { refresh } = useGlobalData('dataKey', fetchFn);
await refresh(); // Forces fresh data
```

### Need to clear all data on logout?

```javascript
const { resetAllData } = useAdminData();
resetAllData(); // Clears everything
```

---

## Next Steps

1. **Test with existing code** - Everything should work unchanged ✅
2. **Add `updateXxx()` calls** - Start getting cross-page updates
3. **Migrate to `useGlobalData`** - Simplify code gradually
4. **Monitor performance** - Enjoy faster page loads!

---

**Status:** ✅ IMPLEMENTED - Ready to use, zero breaking changes!

**Last Updated:** January 24, 2026
