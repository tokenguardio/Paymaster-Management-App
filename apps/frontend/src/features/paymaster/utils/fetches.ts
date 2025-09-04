import axios from 'axios';

const serverURL = '';

export const fetchPaymasters = async (param: string) => {
  const response = await axios.get(`${serverURL}/api/paymasters${param}`);

  return response.data;
};
