import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '~/redux/actions'; // Action để cập nhật state user

const useRestoreState = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(setCurrentUser(user)); // Cập nhật state user trong Redux
    }
  }, [dispatch]);
};

export default useRestoreState;
