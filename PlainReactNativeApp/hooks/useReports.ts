import {useState, useEffect} from 'react';
import axiosInstance from '@/utils/axiosConfig';

const useReports = () => {
  const [reports, setReports] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/report/all/');

      const data = response.data.results;

      setReports(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {reports, loading, error};
};

export default useReports;
