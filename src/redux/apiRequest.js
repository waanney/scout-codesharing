import axios from 'axios';
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
  logoutStart,
  logoutFailed,
  logoutSuccess,
} from './authSlice';
import axiosJWT from './axiosJWT';
import { createStart, createFailed, createSuccess } from './uppostSlice';
import { commentStart, commentSuccess, commentFailed } from './commentSlice';

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post('http://localhost:8017/v1/Auth/login', user);
    // Lưu thông tin user vào localStorage
    localStorage.setItem('currentUser', JSON.stringify(res.data));
    dispatch(loginSuccess(res.data));
    navigate('/');
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message));
  }
};
export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post('http://localhost:8017/v1/Auth/', user);
    dispatch(registerSuccess());
    navigate('/login');
  } catch (err) {
    dispatch(registerFailed(err.response?.data?.message));
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post('http://localhost:8017/v1/Auth/logout', {});
    dispatch(logoutSuccess());
    navigate('/');
  } catch (err) {
    dispatch(logoutFailed());
    console.error('Logout Error:', err.message);
  }
};

export const createPost = async (boards, dispatch, navigate) => {
  dispatch(createStart());
  try {
    await axios.post('http://localhost:8017/v1/boards', boards);
    dispatch(createSuccess());
    navigate('/discussion');
  } catch (err) {
    dispatch(createFailed(err.response?.data?.message));
  }
};

export const commentPost = async (comment, dispatch, navigate) => {
  dispatch(commentStart());
  try {
    await axios.post('http://localhost:8017/v1/Comment/', comment);
    dispatch(commentSuccess());
    navigate('/post/:boardId');
  } catch (err) {
    dispatch(commentFailed(err.response?.data?.message));
  }
};
