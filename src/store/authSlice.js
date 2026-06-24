import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('ooty_user') ? JSON.parse(localStorage.getItem('ooty_user')) : null,
  token: localStorage.getItem('ooty_token') || null,
  isAuthenticated: !!localStorage.getItem('ooty_token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('ooty_user', JSON.stringify(action.payload.user));
      localStorage.setItem('ooty_token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('ooty_user');
      localStorage.removeItem('ooty_token');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
