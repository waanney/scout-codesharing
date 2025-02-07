import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; // So sánh thời hạn với thời gian hiện tại
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Token không hợp lệ
  }
};

const checkTokenAndRedirect = () => {
  const currentUser = useSelector(state => state.auth.login.currentUser) || JSON.parse(localStorage.getItem('currentUser'));
  if (isTokenExpired(currentUser.access_token)) {
    alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user')
    localStorage.removeItem('sharedPosts');

    window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
  }
  if(!currentUser) window.location.href = '/login';
};

export default checkTokenAndRedirect;
