import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://localhost:3000';

export const createPolicy = async (payload: unknown) => {
  const response = await axios.post(`${serverURL}/policies`, payload, {
    withCredentials: true,
  });

  return response.data;
};
