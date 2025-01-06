/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from './authSlice';

export const loginUser = async (Users, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`http://localhost:8017/v1/Auth/login`, Users);
    dispatch(loginSuccess(res.data));
    navigate('/');
  } catch (err) {
    dispatch(loginFailed());
  }
};

// sign up
export const registerUser = async (Users, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`http://localhost:8017/v1/Auth/`, Users);
    dispatch(registerSuccess());
    navigate('/login');
  } catch (err) {
    dispatch(registerFailed());
  }
};
