
import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess, logoutStart, logoutFailed, logoutSuccess } from "./authSlice";
import axiosJWT from "./axiosJWT";
import store from "./store";

export const loginUser = async(user,dispatch,navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8017/v1/Auth/login',user);
        dispatch(loginSuccess(res.data));
        navigate("/")
    }catch(err) {
        dispatch(loginFailed(err.response?.data?.message));
    }
}
export const registerUser = async (user,dispatch,navigate) => {
    dispatch(registerStart());
    try {
        await axios.post('http://localhost:8017/v1/Auth/',user);
        dispatch(registerSuccess());
        navigate("/login")
    }catch(err) {
        dispatch(registerFailed(err.response?.data?.message));
    }
}

export const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("http://localhost:8017/v1/Auth/logout", {}, {
            headers: {
                token: `Bearer ${store.getState().auth.login.currentUser.access_token}`,
            },
        });
        dispatch(logoutSuccess());
        navigate("/");
    } catch (err) {
        dispatch(logoutFailed());
        console.error("Logout Error:", err.message);
    }
};

export const refreshAccessToken = async () => {
    try {
        const res = await axios.post("http://localhost:8017/v1/Auth/refresh-token", {}, { withCredentials: true });
        const newToken = res.data.new_access_token;
        store.dispatch(updateToken(newToken));
        return newToken;
    } catch (err) {
        console.error("Refresh Token Error:", err.response?.data || err.message || "Unexpected error");
        throw err;
    }
};
