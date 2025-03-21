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
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
} from './authSlice';
import axiosJWT from './axiosJWT';
import { createStart, createFailed, createSuccess } from './uppostSlice';
import { commentStart, commentSuccess, commentFailed } from './commentSlice';
// import { jwtDecode } from 'jwt-decode';
import { env } from '~/configs/environment.js';

const API_ROOT = env.API_ROOT;

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_ROOT}/v1/Auth/login`, user);
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
    axios
      .post(`${API_ROOT}/v1/Auth/`, user)
      .then(res => {
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        dispatch(registerSuccess(res.data));
        // const decodedToken = jwtDecode(res.data.access_token);
        // const userId = decodedToken.id;
        // navigate(`/profile/${userId}`);
        dispatch(logoutUser(dispatch, navigate));
      })
      .catch(err => {
        dispatch(registerFailed(err.response?.data?.message));
      });
  } catch (err) {
    dispatch(registerFailed(err.response?.data?.message));
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(`${API_ROOT}/v1/Auth/logout`, {});
    dispatch(logoutSuccess());

    // Xóa currentUser khỏi localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    //Xóa sharedPost khỏi localStorage
    localStorage.removeItem('sharedPosts');

    // Xóa state changePassword khỏi redux
    dispatch(changePasswordSuccess(false));

    navigate('/login');
  } catch (err) {
    dispatch(logoutFailed());
    console.error('Logout Error:', err.message);
  }
};

export const changePassword = async (data, dispatch, userId) => {
  dispatch(changePasswordStart());
  try {
    const response = await axios.put(
      `${API_ROOT}/v1/Auth/change-password/${userId}`,
      data,
    );
    dispatch(changePasswordSuccess(response?.data?.message));
  } catch (err) {
    dispatch(changePasswordFailed(err.response?.data?.message));
  }
};

export const resetPassword = async (data, token, dispatch) => {
  dispatch(resetPasswordStart());
  try {
    const response = await axios.put(
      `${API_ROOT}/v1/Auth/reset-password/${token.token}`,
      data,
    );
    dispatch(resetPasswordSuccess(response?.data?.message));
  } catch (error) {
    dispatch(resetPasswordFailed(error.response?.data?.message));
  }
};

export const createPost = async (boards, dispatch, navigate) => {
  dispatch(createStart());
  try {
    await axios.post(`${API_ROOT}/v1/boards`, boards);
    dispatch(createSuccess());
    navigate('/discussion');
  } catch (err) {
    dispatch(createFailed(err.response?.data?.message));
  }
};

export const commentPost_API = async (commentData, dispatch) => {
  dispatch(commentStart());
  try {
    const response = await axios.post(`${API_ROOT}/v1/Comment`, commentData);
    dispatch(commentSuccess());
    return response; // Phải trả về response để lấy _id của comment
  } catch (err) {
    dispatch(commentFailed(err.response?.data?.message));
  }
};

// comment inline

// export const commentInlinePost_API = async (commentData, dispatch) => {
//   dispatch(commentStart());
//   try {
//     const response = await axios.post(`${API_ROOT}/v1/commentinline/`, commentData);
//     dispatch(commentSuccess());
//     return response;
//   } catch (err) {
//     dispatch(commentFailed(err.response?.data?.message));
//   }
// };

/*export const myProfile = async (myProfileData, dispatch) => {
  dispatch(myProfileStart());

  try {
    await axios.post(`${API_ROOT}/v1/myProfile/`, myProfileData);
    dispatch(myProfileSuccess(myProfileData));
  } catch (err) {
    dispatch(myProfileFailed(err.response?.data?.message));
  }
};*/
