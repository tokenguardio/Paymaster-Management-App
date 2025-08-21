import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Icon, Typography, Card, Logo } from '@/components';

import { signInWithEthereum } from '@/features/auth/signInWithEthereum';
import Style from './LoginForm.module.css';

export const LoginForm = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const addr = await signInWithEthereum();
      setAddress(addr);
      setError(null);
      navigate('/paymaster');
    } catch (err: any) {
      setError(err.message);
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
