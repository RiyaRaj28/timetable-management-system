import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

// Response interceptor for global error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error (no response from server)
      error.message = 'Network error. Please check your internet connection and try again.';
    } else {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message;
      
      if (status === 500) {
        error.message = message || 'Server error. Please try again later.';
      } else if (status === 404) {
        error.message = message || 'Resource not found.';
      } else if (status === 403) {
        error.message = message || 'You do not have permission to perform this action.';
      } else if (status === 401) {
        error.message = message || 'Unauthorized. Please log in again.';
      } else if (status === 400) {
        error.message = message || 'Invalid request. Please check your input.';
      } else {
        error.message = message || 'An error occurred. Please try again.';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
