import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth');
    },
    loadAuthFromStorage: (state) => {
      const savedAuth = JSON.parse(localStorage.getItem('auth'));
      if (savedAuth) {
        state.isAuthenticated = savedAuth.isAuthenticated;
        state.user = savedAuth.user;
      }
    },
  },
});

export const { login, logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
