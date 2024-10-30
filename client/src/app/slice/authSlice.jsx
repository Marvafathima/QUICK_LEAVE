// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   accessToken: null,
//   refreshToken: null,
//   role: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { accessToken, refreshToken, role } = action.payload;
//       state.accessToken = accessToken;
//       state.refreshToken = refreshToken;
//       state.role = role;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.role = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      // First, create the user
      const response = await axios.post('http://localhost:8000/signup/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After successful signup, automatically login
      const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
      };
      
      // Dispatch login action after successful signup
      const loginResponse = await dispatch(loginUser(loginData)).unwrap();
      return { signup: response.data, login: loginResponse };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const loadAuthState = () => {
  try {
    const authState = localStorage.getItem('authState');
    return authState ? JSON.parse(authState) : null;
  } catch (err) {
    return null;
  }
};

const initialState = loadAuthState() || {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authState');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('authState', JSON.stringify(state));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = {
          email: action.payload.email,
          username: action.payload.username,
          role: action.payload.role
        };
        localStorage.setItem('authState', JSON.stringify(state));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Login failed';
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
       
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      });
  }
});

export const { logout, updateUser, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
