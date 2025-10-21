import axios from 'axios';
import { useEffect, useState } from 'react';

export function useSession() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/siwe/me', { withCredentials: true })
      .then((res) => {
        setAuthenticated(true);
        setAddress(res.data.address);
      })
      .catch(() => {
        setAuthenticated(false);
        setAddress(null);
      });
  }, []);

  return {
    isLoading: authenticated === null,
    authenticated: authenticated === true,
    address,
  };
}
