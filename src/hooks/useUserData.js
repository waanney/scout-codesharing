import { useState, useEffect } from 'react';
import axios from 'axios';
import useUserId from '../utils/useUserId';
import { API_ROOT } from '../utils/constant';

const useUserData = () => {
  const userId = useUserId();
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_ROOT}/v1/Auth/${userId}`);
        setCurrentUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [userId, API_ROOT]);

  return { currentUserData, userId };
};

export default useUserData;
