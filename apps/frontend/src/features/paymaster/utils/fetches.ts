import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPolicies = async (param?: string) => {
  const response = await axios.get(`${API_URL}/policies${param || ''}`, {
    withCredentials: true,
  });

  return response.data;
};

export const deletePolicy = async (policyId: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/policies/${policyId}`, {
    withCredentials: true,
  });

  return response.data;
};
