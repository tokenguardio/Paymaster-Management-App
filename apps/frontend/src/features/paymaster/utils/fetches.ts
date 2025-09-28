import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://0.0.0.0:3000';

export const fetchPolicies = async () => {
  const response = await axios.get(`${serverURL}/policies`);

  return response.data;
};
