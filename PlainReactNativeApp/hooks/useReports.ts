import {useState, useEffect} from 'react';
import axiosInstance from '@/utils/axiosConfig';

const useReports = () => {
  const [reports, setReports] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let data = [];

      const response = await axiosInstance.get('/report/all/');
      data = [...response.data.results];
      setNextPage(response.data.next);

      if (response.data.next) {
        const nextResponse = await axiosInstance.get(response.data.next);
        data = [...data, ...nextResponse.data.results];
        setNextPage(nextResponse.data.next);
      }

      setReports(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportsRefresh = async () => {
    try {
      let data = [];
      const response = await axiosInstance.get('/report/all/');

      data = [...response.data.results];
      setNextPage(response.data.next);

      if (response.data.next) {
        const nextResponse = await axiosInstance.get(response.data.next);
        data = [...data, ...nextResponse.data.results];
        setNextPage(nextResponse.data.next);
      }

      setReports(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the reports');
    }
  };

  const fetchNextPage = async () => {
    try {
      if (!nextPage) {
        return;
      }

      const response = await axiosInstance.get(nextPage);
      const data = response.data.results;

      setNextPage(response.data.next);
      setReports([...reports, ...data]);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the next page');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {reports, loading, error, fetchReportsRefresh, fetchNextPage};
};

export default useReports;
