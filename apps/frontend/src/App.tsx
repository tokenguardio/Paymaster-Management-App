import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '@/components/layout/Layout';
import { useMobile } from '@/hooks/useMobile';
import { NotFoundPage } from '@/pages/404';
import { LoginPage } from '@/pages/LoginPage';
import { RestrictedRoute } from '@/routes/RestrictedRoute';
import { routes } from '@/routes/routesMap';
import Style from './App.module.css';

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const isMobile = useMobile();
  const location = useLocation();

  if (isMobile) {
    return <p className={Style.notAvailable}>App is only available on desktop</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          {routes.map(({ path, component, slug }) => (
            <Route
              key={slug}
              path={path}
              element={
                <PageTransition>
                  <RestrictedRoute>{component}</RestrictedRoute>
                </PageTransition>
              }
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
    </AnimatePresence>
  );
}
