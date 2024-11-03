// src/utils/axiosConfig.js

// import axios from 'axios';
// import { logout } from '../app/slice/authSlice';
// import { store } from '../app/store';
// // Create axios instance with default config
// const api = axios.create({
//   baseURL: 'http://localhost:8000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const token = state.auth.accessToken;
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If the error is unauthorized and we haven't tried to refresh yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       const state = store.getState();
//       const refreshToken = state.auth.refreshToken;
      
//       if (refreshToken) {
//         try {
//           // Try to refresh the token
//           const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//             refresh: refreshToken
//           });
          
//           const newAccessToken = response.data.access;
          
//           // Update the token in the store
//           store.dispatch({
//             type: 'auth/loginUser/fulfilled',
//             payload: {
//               ...state.auth.user,
//               access: newAccessToken,
//               refresh: refreshToken
//             }
//           });
          
//           // Retry the original request with new token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
          
//         } catch (refreshError) {
//           // If refresh token fails, logout user
//           store.dispatch(logout());
//           return Promise.reject(refreshError);
//         }
//       } else {
//         // No refresh token available, logout user
//         store.dispatch(logout());
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Export custom hooks/functions for API calls
// export const useApi = () => {
//   const makeRequest = async (method, url, data = null, customConfig = {}) => {
//     try {
//       const config = {
//         method,
//         url,
//         ...customConfig
//       };
      
//       if (data) {
//         config.data = data;
//       }
      
//       const response = await api(config);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   return {
//     get: (url, config) => makeRequest('get', url, null, config),
//     post: (url, data, config) => makeRequest('post', url, data, config),
//     put: (url, data, config) => makeRequest('put', url, data, config),
//     patch: (url, data, config) => makeRequest('patch', url, data, config),
//     delete: (url, config) => makeRequest('delete', url, null, config),
//   };
// };

// export default api;
// src/services/api.js

import axios from 'axios';
import { logout } from '../app/slice/authSlice';
import { store } from '../app/store';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;
      
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          
          // Update the token in the store
          store.dispatch({
            type: 'auth/loginUser/fulfilled',
            payload: {
              ...state.auth.user,
              access: newAccessToken,
              refresh: refreshToken
            }
          });
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
          
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      } else {
        store.dispatch(logout());
      }
    }
    
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const makeRequest = async (method, url, data = null, customConfig = {}) => {
    try {
      const config = {
        method,
        url,
        ...customConfig
      };
      
      if (data) {
        config.data = data;
      }
      
      const response = await api(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  return {
    get: (url, config) => makeRequest('get', url, null, config),
    post: (url, data, config) => makeRequest('post', url, data, config),
    put: (url, data, config) => makeRequest('put', url, data, config),
    patch: (url, data, config) => makeRequest('patch', url, data, config),
    delete: (url, config) => makeRequest('delete', url, null, config),
  };
};

export default api;