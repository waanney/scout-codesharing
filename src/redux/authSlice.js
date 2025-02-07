import { createSlice } from '@reduxjs/toolkit';

// Define the initial state separately for reuse
export const initialState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  register: {
    isFetching: false,
    error: false,
    success: false,
    currentUser: null,
  },
  logout: {
    isFetching: false,
    error: false,
  },
  changePassword: {
    isFetching: false,
    error: false,
    success: false,
  },
  resetPassword: {
    isFetching: false,
    error: false,
    success: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.error = action.payload || true;
    },
    registerStart: state => {
      state.register.isFetching = true;
    },
    registerSuccess: (state, action) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
      state.register.currentUser = action.payload;
    },
    registerFailed: (state, action) => {
      state.register.isFetching = false;
      state.register.error = action.payload || true;
      state.register.success = false;
    },
    logoutStart: state => {
      state.logout.isFetching = true;
    },
    logoutSuccess: state => {
      state.logout.isFetching = false;
      state.login.currentUser = null;
      state.logout.error = false;
      localStorage.removeItem('user');
    },
    logoutFailed: state => {
      state.logout.isFetching = false;
      state.logout.error = true;
    },
    changePasswordStart: state => {
      state.changePassword.isFetching = true;
      state.changePassword.error = false;
      state.changePassword.success = false;
    },
    changePasswordSuccess: (state, action) => {
      state.changePassword.isFetching = false;
      state.changePassword.error = false;
      state.changePassword.success = action.payload;
    },
    changePasswordFailed: (state, action) => {
      state.changePassword.isFetching = false;
      state.changePassword.error = action.payload;
      state.changePassword.success = false;
    },
    resetPasswordStart: state => {
      state.resetPassword.isFetching = true;
      state.resetPassword.error = false;
      state.resetPassword.success = false;
    },
    resetPasswordSuccess: (state, action) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.error = false;
      state.resetPassword.success = action.payload;
    },
    resetPasswordFailed: (state, action) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.error = action.payload;
      state.resetPassword.success = false;
    },

    // New clearError reducer
    clearError: state => {
      state.login.error = false; // Reset the error state
      state.register.error = false; // Reset register error state (optional)
      state.logout.error = false; // Reset logout error state (optional)
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutFailed,
  logoutSuccess,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
  clearError, // Export the clearError action
} = authSlice.actions;

export default authSlice.reducer;
