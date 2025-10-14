import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://0.0.0.0:3000';

export const fetchPolicyData = async (id: string) => {
  const response = await axios.get(`${serverURL}/policy-chart/${id}`);

  return response.data;
};

export const fetchPolicy = async (id: string) => {
  const response = await axios.get(`${serverURL}/policies/${id}`);

  return response.data;
};
