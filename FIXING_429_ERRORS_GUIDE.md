# Guide: Fixing 429 (Too Many Requests) Errors in AdminSide

## Summary

This guide explains the 429 error fixes implemented to prevent API rate limiting issues in the SmartRegistration admin interface.

## Problem Identified

The admin pages were making multiple concurrent API calls on mount, causing 429 errors:

| Page | Concurrent Calls | Risk Level |
|------|-----------------|------------|
| Registrationspage.jsx | 3 (Promise.all) | 🔴 High |
| GradesPage.jsx | 3 (useEffect) | 🔴 High |
| AttendancePage.jsx | 3 (useEffect) | 🔴 High |
| EnrollmentsPage.jsx | 3 (useEffect) | 🔴 High |
| MajorSubjectsForm.jsx | 3 (Promise.all) | 🔴 High |
| AssignmentsPage.jsx | 2 (useEffect) | 🟡 Medium |
| SchedulesPage.jsx | 2 (useEffect) | 🟡 Medium |

## Solutions Implemented

### 1. API Request Throttler (`src/utils/apiThrottle.js`)

**Features:**
- Limits concurrent requests to 3 maximum
- Enforces 150ms minimum delay between requests
- Implements exponential backoff retry (1s, 2s, 4s)
- Request queue with priority support
- Prevents duplicate concurrent requests

**Usage:**
```javascript
import { throttledRequest, staggeredRequests } from '../../utils/apiThrottle';

// Single throttled request
const data = await throttledRequest(() => fetchData());

// Multiple staggered requests
const [data1, data2, data3] = await staggeredRequests([
  () => fetchData1(),
  () => fetchData2(),
  () => fetchData3(),
], 150); // 150ms delay between each
```

### 2. Data Cache Manager (`src/utils/dataCache.js`)

**Features:**
- Caches frequently accessed data (departments, majors, subjects, courses, students)
- Configurable TTL (Time To Live):
  - Departments: 5 minutes
  - Majors: 5 minutes
  - Subjects: 5 minutes
  - Courses: 3 minutes
  - Students: 2 minutes
- Prevents duplicate concurrent requests for same data
- Auto-cleanup every 10 minutes

**Usage:**
```javascript
import { getCachedDepartments, getCachedStudents } from '../../utils/dataCache';

// Will fetch from API first time, then return cached data
const departments = await getCachedDepartments(fetchDepartments);
const students = await getCachedStudents(fetchStudents);

// Force refresh
const freshData = await getCachedDepartments(fetchDepartments, true);
```

## Fixed Pages

### ✅ Registrationspage.jsx

**Before:**
```javascript
const [regRes, deptRes, majorRes] = await Promise.all([
  fetchRegistrations({ semester: selectedSemesterInt }),
  fetchDepartments(),
  fetchMajors(),
]);
```

**After:**
```javascript
import { staggeredRequests } from "../../utils/apiThrottle";
import { getCachedDepartments, getCachedMajors } from "../../utils/dataCache";

const [regRes, deptRes, majorRes] = await staggeredRequests([
  () => fetchRegistrations({ semester: selectedSemesterInt }),
  () => getCachedDepartments(fetchDepartments),
  () => getCachedMajors(fetchMajors),
], 150); // 150ms delay between requests
```

### ✅ GradesPage.jsx

**Before:**
```javascript
useEffect(() => {
  loadGrades();
  loadStudents();
  loadCourses();
}, []);
```

**After:**
```javascript
import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";

useEffect(() => {
  loadGrades();
  setTimeout(() => loadStudents(), 150);
  setTimeout(() => loadCourses(), 300);
}, []);

const loadStudents = async () => {
  const res = await getCachedStudents(fetchStudents);
  // ... rest of logic
};

const loadCourses = async () => {
  const res = await getCachedCourses(fetchCourses);
  // ... rest of logic
};
```

### ✅ AttendancePage.jsx

**Same pattern as GradesPage.jsx** - staggered useEffect + caching.

## Remaining Pages to Fix

### 📋 EnrollmentsPage.jsx

**Location:** `src/adminSide/pageAdmin/EnrollmentsPage.jsx`

**Current Code (Lines ~21-25):**
```javascript
useEffect(() => {
  loadEnrollments();
  loadStudents();
  loadCourses();
}, []);
```

**Fix to Apply:**
```javascript
// Add imports
import { getCachedStudents, getCachedCourses } from "../../utils/dataCache";

// Update useEffect
useEffect(() => {
  loadEnrollments();
  setTimeout(() => loadStudents(), 150);
  setTimeout(() => loadCourses(), 300);
}, []);

// Update load functions
const loadStudents = async () => {
  try {
    const res = await getCachedStudents(fetchStudents);
    const data = res.data?.data || res.data || [];
    setStudents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load students:", error);
    setStudents([]);
  }
};

const loadCourses = async () => {
  try {
    const res = await getCachedCourses(fetchCourses);
    const data = res.data?.data || res.data || [];
    setCourses(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load courses:", error);
    setCourses([]);
  }
};
```

### 📋 AssignmentsPage.jsx

**Location:** `src/adminSide/pageAdmin/AssignmentsPage.jsx`

**Current Code (Lines ~19-22):**
```javascript
useEffect(() => {
  loadAssignments();
  loadCourses();
}, []);
```

**Fix to Apply:**
```javascript
// Add import
import { getCachedCourses } from "../../utils/dataCache";

// Update useEffect
useEffect(() => {
  loadAssignments();
  setTimeout(() => loadCourses(), 100); // 100ms delay
}, []);

// Update loadCourses
const loadCourses = async () => {
  try {
    const res = await getCachedCourses(fetchCourses);
    const data = res.data?.data || res.data || [];
    setCourses(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load courses:", error);
    setCourses([]);
  }
};
```

### 📋 SchedulesPage.jsx

**Location:** `src/adminSide/pageAdmin/SchedulesPage.jsx`

**Same as AssignmentsPage.jsx** - Add 100ms delay + caching for courses.

### 📋 MajorSubjectsForm.jsx

**Location:** `src/adminSide/ConponentsAdmin/MajorSubjectsForm.jsx`

**Current Code (Lines ~84-88):**
```javascript
const [dRes, mRes, sRes] = await Promise.all([
  fetchDepartments(),
  fetchMajors(),
  fetchSubjects()
]);
```

**Fix to Apply:**
```javascript
// Add imports at top of file
import { getCachedDepartments, getCachedMajors, getCachedSubjects } from "../../utils/dataCache";

// Replace Promise.all with sequential calls with delays
const dRes = await getCachedDepartments(fetchDepartments);
await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

const mRes = await getCachedMajors(fetchMajors);
await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

const sRes = await getCachedSubjects(fetchSubjects);
```

## Quick Fix Template

For any page with concurrent API calls, follow this pattern:

### Pattern 1: useEffect with Multiple Calls

```javascript
// BEFORE
useEffect(() => {
  loadData1();
  loadData2();
  loadData3();
}, []);

// AFTER
useEffect(() => {
  loadData1();
  setTimeout(() => loadData2(), 150);
  setTimeout(() => loadData3(), 300);
}, []);
```

### Pattern 2: Promise.all

```javascript
// BEFORE
const [res1, res2, res3] = await Promise.all([
  fetchData1(),
  fetchData2(),
  fetchData3()
]);

// AFTER
import { staggeredRequests } from "../../utils/apiThrottle";

const [res1, res2, res3] = await staggeredRequests([
  () => fetchData1(),
  () => fetchData2(),
  () => fetchData3()
], 150);
```

### Pattern 3: Add Caching

```javascript
// BEFORE
const res = await fetchDepartments();

// AFTER
import { getCachedDepartments } from "../../utils/dataCache";
const res = await getCachedDepartments(fetchDepartments);
```

## Benefits

1. **Prevents 429 Errors**: Request throttling ensures we never exceed rate limits
2. **Faster Page Loads**: Cached data loads instantly on subsequent pages
3. **Better UX**: Staggered loading prevents UI freezes
4. **No Breaking Changes**: All endpoints remain unchanged
5. **Backwards Compatible**: Works with existing code

## Testing

After applying fixes, test by:

1. Opening multiple admin pages quickly
2. Refreshing pages repeatedly
3. Checking browser console for 429 errors (should be gone)
4. Verifying cached data loads instantly (check network tab)

## Monitoring

To check throttler status (for debugging):

```javascript
import { getThrottlerStatus } from '../../utils/apiThrottle';
import { getCacheStats } from '../../utils/dataCache';

console.log('Throttler:', getThrottlerStatus());
console.log('Cache:', getCacheStats());
```

## Cache Invalidation

When you create/update/delete data, invalidate relevant caches:

```javascript
import { invalidateCache } from '../../utils/dataCache';

// After creating a new department
await createDepartment(data);
invalidateCache('departments');

// After updating a student
await updateStudent(id, data);
invalidateCache('students');

// Invalidate all caches
import { invalidateAllCaches } from '../../utils/dataCache';
invalidateAllCaches();
```

## Summary of Changes

### Files Added:
- ✅ `src/utils/apiThrottle.js` - Request throttling utility
- ✅ `src/utils/dataCache.js` - Data caching utility

### Files Fixed:
- ✅ `src/adminSide/pageAdmin/Registrationspage.jsx`
- ✅ `src/adminSide/pageAdmin/GradesPage.jsx`
- ✅ `src/adminSide/pageAdmin/AttendancePage.jsx`

### Files Remaining:
- ⏳ `src/adminSide/pageAdmin/EnrollmentsPage.jsx`
- ⏳ `src/adminSide/pageAdmin/AssignmentsPage.jsx`
- ⏳ `src/adminSide/pageAdmin/SchedulesPage.jsx`
- ⏳ `src/adminSide/ConponentsAdmin/MajorSubjectsForm.jsx`

## Notes

- All fixes are **non-breaking** - no endpoint changes required
- Utilities are **reusable** across the entire application
- Caching is **automatic** - no manual cache management needed
- Throttling is **transparent** - existing code works unchanged

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify imports are correct
3. Ensure utility files are in `src/utils/`
4. Test with one page at a time
5. Check backend rate limiting settings

---

**Status:** 3/7 high-priority pages fixed, 4 remaining
**Next Steps:** Apply fixes to remaining 4 pages using patterns above
