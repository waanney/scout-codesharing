/* eslint-disable no-unused-vars */
import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";

export const loginUser = async(Users,dispatch,navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/Auth/login",Users);
        dispatch(loginSuccess(res.data));
        navigate("/")
    }catch(err) {
        dispatch(loginFailed());
    }
}
export const registerUser = async (Users,dispatch,navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/Auth/",Users);
        dispatch(registerSuccess());
        navigate("/login")
    }catch(err) {
        dispatch(registerFailed());
    }
}

