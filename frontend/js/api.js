/**
 * PRISM7 // Sovereign API Client
 * Optimized for "Old Best" Vanilla JS Integration
 */

const API_BASE_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:5000'
  : window.location.origin;

const ApiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        let errMsg = 'Network response was not ok';
        try {
          const errData = await response.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (e) { }
        throw new Error(errMsg);
      }
      return await response.json();
    } catch (error) {
      console.error('PRISM7_API_GET_FATAL:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('API_SERVER_OFFLINE: Please ensure Flask is running on port 5000');
      }
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      // Handle both JSON and FormData
      const isFormData = data instanceof FormData;
      const options = {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
      };

      if (!isFormData) {
        options.headers = { 'Content-Type': 'application/json' };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        let errMsg = 'Server error';
        try {
          const errData = await response.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (e) {
          errMsg = `HTTP_${response.status}: ${response.statusText}`;
        }
        throw new Error(errMsg);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }
};

// Global availability
window.ApiClient = ApiClient;
