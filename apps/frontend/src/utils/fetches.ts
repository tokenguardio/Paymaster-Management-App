import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchPolicyData = async (id: string) => {
  const response = await axios.get(`${API_URL}/analytics/policy/${id}/daily-user-ops`, {
    withCredentials: true,
  });

  return response.data;
};

export const fetchPolicy = async (id: string) => {
  const response = await axios.get(`${API_URL}/policies/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const fetchPolicyRules = async (id: string, param?: string) => {
  const url = param ? `${API_URL}/policy-rules/${id}?${param}` : `${API_URL}/policy-rules/${id}`;

  const response = await axios.get(url, {
    withCredentials: true,
  });

  return response.data;
};
