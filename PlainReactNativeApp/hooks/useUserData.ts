import {useEffect, useState} from 'react';
import axiosInstance from '@/utils/axiosConfig';

interface IUserData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Admin' | 'User';
  is_active: boolean;
  profile_image: string;
  receiving_email: string;
}

const useUserData = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/users/data/');
      setUserData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the user data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async (email: string) => {
    setIsLoading(true);

    if (email === userData?.receiving_email) {
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/users/rcvemail/', {email});
    } catch (err) {
      setError(err.message || 'An error occurred while updating the email');
    } finally {
      setIsLoading(false);
    }
  };

  return {fetchUserData, updateEmail, userData, isLoading, error};
};

export default useUserData;
