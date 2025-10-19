import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://0.0.0.0:3000';

export const fetchPolicies = async (param?: string) => {
  const response = await axios.get(`${serverURL}/policies${param || ''}`);

  return response.data;
};

export const deletePolicy = async (policyId: string): Promise<void> => {
  const response = await axios.delete(`${serverURL}/policies/${policyId}`);

  return response.data;
};
