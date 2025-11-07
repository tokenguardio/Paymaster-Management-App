import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://localhost:3000';

export const fetchPolicyData = async (id: string) => {
  const response = await axios.get(`${serverURL}/policy-chart/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const fetchPolicy = async (id: string) => {
  const response = await axios.get(`${serverURL}/policies/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const fetchPolicyRules = async (id: string, param?: string) => {
  const url = param
    ? `${serverURL}/policy-rules/${id}?${param}`
    : `${serverURL}/policy-rules/${id}`;

  const response = await axios.get(url, {
    withCredentials: true,
  });

  return response.data;
};
