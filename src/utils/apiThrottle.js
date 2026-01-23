/**
 * API Request Throttler & Queue Manager
 * Prevents 429 (Too Many Requests) errors by:
 * - Limiting concurrent requests
 * - Queuing excess requests
 * - Adding delays between requests
 * - Implementing retry logic with exponential backoff
 */

class APIThrottler {
  constructor(config = {}) {
    this.maxConcurrent = config.maxConcurrent || 3; // Max concurrent requests
    this.minDelay = config.minDelay || 100; // Min delay between requests (ms)
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000; // Initial retry delay (ms)

    this.queue = [];
    this.inFlight = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Throttle an API request
   * @param {Function} requestFn - The API request function to execute
   * @param {Object} options - Additional options { priority, retries }
   * @returns {Promise} - The API response
   */
  async throttle(requestFn, options = {}) {
    return new Promise((resolve, reject) => {
      const task = {
        requestFn,
        resolve,
        reject,
        retries: options.retries ?? this.retryAttempts,
        priority: options.priority || 0,
        addedAt: Date.now()
      };

      // Add to queue
      this.queue.push(task);

      // Sort by priority (higher first)
      this.queue.sort((a, b) => b.priority - a.priority);

      // Process queue
      this.processQueue();
    });
  }

  /**
   * Process the request queue
   */
  async processQueue() {
    // Don't process if at max concurrent requests
    if (this.inFlight >= this.maxConcurrent) {
      return;
    }

    // Don't process if queue is empty
    if (this.queue.length === 0) {
      return;
    }

    // Enforce minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastRequest;
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    // Get next task from queue
    const task = this.queue.shift();
    this.inFlight++;
    this.lastRequestTime = Date.now();

    try {
      const result = await this.executeWithRetry(task);
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.inFlight--;
      // Process next item in queue
      this.processQueue();
    }
  }

  /**
   * Execute request with retry logic
   */
  async executeWithRetry(task) {
    let lastError;

    for (let attempt = 0; attempt <= task.retries; attempt++) {
      try {
        const result = await task.requestFn();
        return result;
      } catch (error) {
        lastError = error;

        // Check if it's a 429 error or network error
        const is429 = error.response?.status === 429;
        const isNetworkError = !error.response;

        // Don't retry if it's not a retryable error and not the first attempt
        if (!is429 && !isNetworkError && attempt > 0) {
          throw error;
        }

        // If we have retries left, wait and try again
        if (attempt < task.retries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          await this.sleep(delay);
        }
      }
    }

    // All retries failed
    throw lastError;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get queue status (for debugging)
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      inFlight: this.inFlight,
      maxConcurrent: this.maxConcurrent
    };
  }

  /**
   * Clear the queue (use with caution)
   */
  clearQueue() {
    this.queue.forEach(task => {
      task.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}

// Create singleton instance with sensible defaults
const apiThrottler = new APIThrottler({
  maxConcurrent: 3,    // Max 3 concurrent requests
  minDelay: 150,       // 150ms between requests
  retryAttempts: 3,    // Retry up to 3 times
  retryDelay: 1000     // Start with 1s delay, then 2s, 4s (exponential)
});

/**
 * Wrapper function for easy use
 * @param {Function} requestFn - The API request to throttle
 * @param {Object} options - { priority: 0, retries: 3 }
 * @returns {Promise} - The API response
 */
export const throttledRequest = (requestFn, options) => {
  return apiThrottler.throttle(requestFn, options);
};

/**
 * Stagger multiple requests with delays
 * @param {Array<Function>} requests - Array of request functions
 * @param {Number} delayMs - Delay between each request (default: 150ms)
 * @returns {Promise<Array>} - Array of results
 */
export const staggeredRequests = async (requests, delayMs = 150) => {
  const results = [];

  for (let i = 0; i < requests.length; i++) {
    if (i > 0) {
      await apiThrottler.sleep(delayMs);
    }
    results.push(await throttledRequest(requests[i]));
  }

  return results;
};

/**
 * Sequential requests (one after another, no concurrency)
 * @param {Array<Function>} requests - Array of request functions
 * @returns {Promise<Array>} - Array of results
 */
export const sequentialRequests = async (requests) => {
  const results = [];

  for (const requestFn of requests) {
    results.push(await requestFn());
  }

  return results;
};

/**
 * Get throttler status (for debugging)
 */
export const getThrottlerStatus = () => {
  return apiThrottler.getStatus();
};

export default apiThrottler;
