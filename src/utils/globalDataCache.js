/**
 * Enhanced Data Cache with Global State Integration
 *
 * This utility bridges the existing dataCache.js with the new AdminDataContext,
 * ensuring backward compatibility while adding global state benefits.
 */

import { getCachedDepartments, getCachedMajors, getCachedSubjects, getCachedStudents, getCachedCourses } from './dataCache';

// Global state updater - will be set by AdminDataProvider
let globalStateUpdater = null;

/**
 * Initialize global state integration
 * Call this from AdminDataProvider
 */
export const initGlobalStateIntegration = (updater) => {
  globalStateUpdater = updater;
};

/**
 * Enhanced cache functions that also update global state
 */

export const getCachedDepartmentsGlobal = async (fetchFn, forceRefresh = false) => {
  const result = await getCachedDepartments(fetchFn, forceRefresh);

  // Update global state if available
  if (globalStateUpdater && globalStateUpdater.updateDepartments) {
    const data = result?.data?.data || result?.data || [];
    globalStateUpdater.updateDepartments(Array.isArray(data) ? data : []);
  }

  return result;
};

export const getCachedMajorsGlobal = async (fetchFn, forceRefresh = false) => {
  const result = await getCachedMajors(fetchFn, forceRefresh);

  if (globalStateUpdater && globalStateUpdater.updateMajors) {
    const data = result?.data?.data || result?.data || [];
    globalStateUpdater.updateMajors(Array.isArray(data) ? data : []);
  }

  return result;
};

export const getCachedSubjectsGlobal = async (fetchFn, forceRefresh = false) => {
  const result = await getCachedSubjects(fetchFn, forceRefresh);

  if (globalStateUpdater && globalStateUpdater.updateSubjects) {
    const data = result?.data?.data || result?.data || [];
    globalStateUpdater.updateSubjects(Array.isArray(data) ? data : []);
  }

  return result;
};

export const getCachedStudentsGlobal = async (fetchFn, forceRefresh = false) => {
  const result = await getCachedStudents(fetchFn, forceRefresh);

  if (globalStateUpdater && globalStateUpdater.updateStudents) {
    const data = result?.data?.data || result?.data || [];
    globalStateUpdater.updateStudents(Array.isArray(data) ? data : []);
  }

  return result;
};

export const getCachedCoursesGlobal = async (fetchFn, forceRefresh = false) => {
  const result = await getCachedCourses(fetchFn, forceRefresh);

  if (globalStateUpdater && globalStateUpdater.updateCourses) {
    const data = result?.data?.data || result?.data || [];
    globalStateUpdater.updateCourses(Array.isArray(data) ? data : []);
  }

  return result;
};

/**
 * Wrapper for any data fetch that automatically updates global state
 */
export const fetchWithGlobalUpdate = async (dataKey, fetchFn) => {
  try {
    const result = await fetchFn();
    const data = result?.data?.data || result?.data || [];

    // Update global state
    if (globalStateUpdater) {
      const updateFnName = `update${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`;
      const updateFn = globalStateUpdater[updateFnName];

      if (updateFn) {
        updateFn(Array.isArray(data) ? data : []);
      }
    }

    return result;
  } catch (error) {
    console.error(`Failed to fetch ${dataKey}:`, error);
    throw error;
  }
};

export default {
  initGlobalStateIntegration,
  getCachedDepartmentsGlobal,
  getCachedMajorsGlobal,
  getCachedSubjectsGlobal,
  getCachedStudentsGlobal,
  getCachedCoursesGlobal,
  fetchWithGlobalUpdate,
};
