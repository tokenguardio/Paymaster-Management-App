import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '@/components/layout/Layout';
import { useMobile } from '@/hooks/useMobile';
import { NotFoundPage } from '@/pages/404';
import { LoginPage } from '@/pages/LoginPage';
import { RestrictedRoute } from '@/routes/RestrictedRoute';
import { routes } from '@/routes/routesMap';
import Style from './App.module.css';
import { PaymasterPage } from './pages/PaymasterPage';

export default function App() {
  const isMobile = useMobile();

  if (isMobile) {
    return <p className={Style.notAvailable}>App is only available on desktop</p>;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        
        <Route path="/" element={<LoginPage />} />
        <Route path="/paymaster" element={<PaymasterPage />} />
        <Route element={<Layout />}>
          {routes.map(({ path, component, slug }) => (
            <Route
              key={slug}
              path={path}
              element={<RestrictedRoute>{component}</RestrictedRoute>}
            />
          ))}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        limit={4}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        theme="light"
        transition={Flip}
      />
    </>
  );
}
