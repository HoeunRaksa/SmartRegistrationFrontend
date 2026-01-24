import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdminData } from '../contexts/AdminDataContext';

/**
 * Custom hook to fetch and manage global admin data
 *
 * Features:
 * - Checks global context first (instant load)
 * - Fetches from API if data is stale or missing
 * - Updates global context automatically
 * - All pages get updated data without refresh
 * - Works with existing caching system
 *
 * @param {string} dataKey - Key in context (e.g., 'departments', 'students')
 * @param {function} fetchFn - API fetch function
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {object} options - Additional options
 */
export const useGlobalData = (dataKey, fetchFn, ttl = 5 * 60 * 1000, options = {}) => {
  const context = useAdminData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const lastFetchRef = useRef(0);

  // Get update function for this data type
  const updateFnName = `update${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`;
  const updateFn = context[updateFnName];
  const data = context[dataKey];
  const getLastUpdate = context.getLastUpdate;

  // Check if data is fresh
  const isDataFresh = useCallback(() => {
    const lastUpdate = getLastUpdate(dataKey);
    if (!lastUpdate) return false;
    return (Date.now() - lastUpdate) < ttl;
  }, [dataKey, getLastUpdate, ttl]);

  // Fetch data from API
  const fetchData = useCallback(async (force = false) => {
    // Don't fetch if data is fresh and not forcing
    if (!force && isDataFresh() && data && data.length > 0) {
      return;
    }

    // Prevent duplicate fetches
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) {
      return;
    }
    lastFetchRef.current = now;

    try {
      setLoading(true);
      setError(null);

      const response = await fetchFn();
      const fetchedData = response?.data?.data || response?.data || [];

      if (isMountedRef.current) {
        // Update global context
        if (updateFn) {
          updateFn(Array.isArray(fetchedData) ? fetchedData : []);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${dataKey}:`, err);
      if (isMountedRef.current) {
        setError(err.response?.data?.message || err.message || `Failed to load ${dataKey}`);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [dataKey, fetchFn, isDataFresh, data, updateFn]);

  // Initial fetch on mount
  useEffect(() => {
    isMountedRef.current = true;

    // Fetch if no data or data is stale
    if (!data || data.length === 0 || !isDataFresh()) {
      if (options.autoFetch !== false) {
        fetchData();
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [dataKey]); // Only run on mount and when dataKey changes

  // Refresh function for manual refresh
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data: data || [],
    loading,
    error,
    refresh,
    isDataFresh: isDataFresh(),
  };
};

/**
 * Hook for data that should always be fresh (no caching)
 * Useful for frequently changing data like registrations
 */
export const useFreshGlobalData = (dataKey, fetchFn) => {
  return useGlobalData(dataKey, fetchFn, 0); // TTL = 0 means always fetch
};

/**
 * Hook for long-term cached data
 * Useful for rarely changing data like departments, majors
 */
export const useCachedGlobalData = (dataKey, fetchFn) => {
  return useGlobalData(dataKey, fetchFn, 15 * 60 * 1000); // TTL = 15 minutes
};
