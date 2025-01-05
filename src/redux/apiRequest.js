import axios from "axios";
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";

export const loginUser = async(user,dispatch,navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("./v1/AuthRoute",user);
        dispatch(loginSuccess(res.data));
        navigate("/homePage_after")
    }catch(err) {
        dispatch(loginFailed());
    }
}

export const registerUser = async (user,dispatch,navigate) => {
    dispatch(registerStart());
    try {a
        await axios.post("./v1/AuthRoute",user);
        dispatch(registerSuccess());
        navigate("/login")
    }catch(err) {
        dispatch(registerFailed());
    }
}

