import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
//chỉ sài với cái nào có thể sài currentUser
const useUserId = () => {
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser'));
  let userId = null;

  if (currentUser && currentUser.access_token) {
    try {
      const decodedToken = jwtDecode(currentUser.access_token);
      userId = decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return userId;
};

export default useUserId;
