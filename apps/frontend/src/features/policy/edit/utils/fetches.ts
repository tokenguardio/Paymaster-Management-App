import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const editPolicy = async (id: string, payload: unknown) => {
  const response = await axios.patch(`${API_URL}/policies/${id}`, payload, {
    withCredentials: true,
  });

  return response.data;
};
