import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Style from './LoginForm.module.css';
import { Button, Card, Icon, Logo, Typography } from '@/components';

import { signInWithEthereum } from '@/features/auth/signInWithEthereum';

export const LoginForm = () => {
  const [_address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const addr = await signInWithEthereum();
      setAddress(addr);
      setError(null);
      navigate('/paymaster');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setError(String(err));
    }
  };

  return (
    <main className={Style['login-form']}>
      <Card className={`${Style['content-container']} align-xy`}>
        <div className={Style['logo-container']}>
          <Logo />
        </div>
        <Button onClick={handleLogin}>Sign in with Ethereum</Button>
        {error && <Typography tag="p" color="red500" text={error} size="xxs" className="mt4" />}
      </Card>
    </main>
  );
};
