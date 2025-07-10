import { useEffect, useState } from 'react';

export function useSession() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/me', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAuthenticated(true);
        setAddress(data.address);
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
