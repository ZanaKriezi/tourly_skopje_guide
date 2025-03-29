import { useState, useEffect } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/test');
        setMessage(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to backend');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h2 className="text-xl font-bold mb-2">Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  );
};

export default TestConnection;