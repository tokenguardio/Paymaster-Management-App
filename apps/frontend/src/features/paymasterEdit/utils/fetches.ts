import axios from 'axios';

// temporary serverURL - TODO set to env
const serverURL = 'http://localhost:3000';

export const editPolicy = async (id: string, payload: unknown) => {
  const response = await axios.patch(`${serverURL}/policies/${id}`, payload, {
    withCredentials: true,
  });

  return response.data;
};
