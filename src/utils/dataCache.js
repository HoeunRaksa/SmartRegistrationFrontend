/**
 * Data Cache Manager
 * Caches frequently accessed data to reduce API calls
 * Prevents redundant requests for departments, majors, subjects, courses, etc.
 */

class DataCache {
  constructor(defaultTTL = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.pendingRequests = new Map(); // Prevent duplicate concurrent requests
  }

  /**
   * Get data from cache or fetch if not cached
   * @param {String} key - Cache key
   * @param {Function} fetchFn - Function to fetch data if not in cache
   * @param {Number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise} - The cached or fetched data
   */
  async get(key, fetchFn, ttl = this.defaultTTL) {
    // Check if data is in cache and not expired
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    // Fetch data
    const fetchPromise = (async () => {
      try {
        const data = await fetchFn();

        // Store in cache
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });

        // Remove from pending requests
        this.pendingRequests.delete(key);

        return data;
      } catch (error) {
        // Remove from pending requests on error
        this.pendingRequests.delete(key);
        throw error;
      }
    })();

    // Store pending request
    this.pendingRequests.set(key, fetchPromise);

    return fetchPromise;
  }

  /**
   * Manually set cache data
   * @param {String} key - Cache key
   * @param {Any} data - Data to cache
   * @param {Number} ttl - Time to live in milliseconds (optional)
   */
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Invalidate (clear) cache for a specific key
   * @param {String} key - Cache key to invalidate
   */
  invalidate(key) {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   * @param {String|RegExp} pattern - Pattern to match keys
   */
  invalidatePattern(pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }

    for (const key of this.pendingRequests.keys()) {
      if (regex.test(key)) {
        this.pendingRequests.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Check if key exists in cache and is not expired
   * @param {String} key - Cache key
   * @returns {Boolean}
   */
  has(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;

    const isExpired = Date.now() - cached.timestamp >= cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    let expired = 0;
    let valid = 0;

    this.cache.forEach((value, key) => {
      const isExpired = Date.now() - value.timestamp >= value.ttl;
      if (isExpired) {
        expired++;
      } else {
        valid++;
      }
    });

    return {
      totalKeys: this.cache.size,
      validKeys: valid,
      expiredKeys: expired,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp >= value.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    return keysToDelete.length;
  }
}

// Create singleton instance
const dataCache = new DataCache();

// Auto-cleanup every 10 minutes
setInterval(() => {
  dataCache.cleanup();
}, 10 * 60 * 1000);

/**
 * Cached wrapper for common API calls
 * These helpers automatically cache frequently accessed data
 */

/**
 * Get departments with caching
 * @param {Function} fetchFn - The fetchDepartments API function
 * @param {Boolean} forceRefresh - Force refresh from API
 * @returns {Promise} - Array of departments
 */
export const getCachedDepartments = (fetchFn, forceRefresh = false) => {
  if (forceRefresh) {
    dataCache.invalidate('departments');
  }
  return dataCache.get('departments', fetchFn, 5 * 60 * 1000); // 5 minutes
};

/**
 * Get majors with caching
 * @param {Function} fetchFn - The fetchMajors API function
 * @param {Boolean} forceRefresh - Force refresh from API
 * @returns {Promise} - Array of majors
 */
export const getCachedMajors = (fetchFn, forceRefresh = false) => {
  if (forceRefresh) {
    dataCache.invalidate('majors');
  }
  return dataCache.get('majors', fetchFn, 5 * 60 * 1000); // 5 minutes
};

/**
 * Get subjects with caching
 * @param {Function} fetchFn - The fetchSubjects API function
 * @param {Boolean} forceRefresh - Force refresh from API
 * @returns {Promise} - Array of subjects
 */
export const getCachedSubjects = (fetchFn, forceRefresh = false) => {
  if (forceRefresh) {
    dataCache.invalidate('subjects');
  }
  return dataCache.get('subjects', fetchFn, 5 * 60 * 1000); // 5 minutes
};

/**
 * Get courses with caching
 * @param {Function} fetchFn - The fetchCourses API function
 * @param {Boolean} forceRefresh - Force refresh from API
 * @returns {Promise} - Array of courses
 */
export const getCachedCourses = (fetchFn, forceRefresh = false) => {
  if (forceRefresh) {
    dataCache.invalidate('courses');
  }
  return dataCache.get('courses', fetchFn, 3 * 60 * 1000); // 3 minutes (courses change more often)
};

/**
 * Get students with caching
 * @param {Function} fetchFn - The fetchStudents API function
 * @param {Boolean} forceRefresh - Force refresh from API
 * @returns {Promise} - Array of students
 */
export const getCachedStudents = (fetchFn, forceRefresh = false) => {
  if (forceRefresh) {
    dataCache.invalidate('students');
  }
  return dataCache.get('students', fetchFn, 2 * 60 * 1000); // 2 minutes (students change more often)
};

/**
 * Invalidate all caches (call this after creating/updating/deleting data)
 */
export const invalidateAllCaches = () => {
  dataCache.clear();
};

/**
 * Invalidate specific cache by name
 * @param {String} cacheName - Name of cache to invalidate (departments, majors, subjects, courses, students)
 */
export const invalidateCache = (cacheName) => {
  dataCache.invalidate(cacheName);
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return dataCache.getStats();
};

export default dataCache;
