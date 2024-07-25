import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosConfig';

const useDocuments = (id: number) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (id: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/driver-card/${id}`);
      setDocuments(response.data.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocuments(id);
    }
  }, [id]);

  return { documents, loading, error };
};

export default useDocuments;
