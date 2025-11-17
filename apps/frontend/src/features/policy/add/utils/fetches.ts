import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createPolicy = async (payload: unknown) => {
  const response = await axios.post(`${API_URL}/policies`, payload, {
    withCredentials: true,
  });

  return response.data;
};
