import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('API call failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('API refetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useApiWithFallback = (apiFunction, fallbackData, dependencies = []) => {
  const { data, loading, error, refetch } = useApi(apiFunction, dependencies);
  
  // If there's an error and we have fallback data, use it
  const finalData = error && fallbackData ? fallbackData : data;
  
  return { data: finalData, loading, error, refetch, usingFallback: Boolean(error && fallbackData) };
};
