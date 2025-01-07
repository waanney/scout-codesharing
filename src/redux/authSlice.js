import { createSlice } from "@reduxjs/toolkit";

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
    },
    logout: {
        isFetching: false,
        error: false,
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = action.payload || true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state, action) => {
            state.register.isFetching = false;
            state.register.error = action.payload || true;
            state.register.success = false;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null; 
            state.logout.error = false;
        },
        
        logoutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
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
} = authSlice.actions;

export default authSlice.reducer;
