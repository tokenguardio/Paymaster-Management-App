import React from 'react';
import { Outlet } from 'react-router-dom';

import Style from './Layout.module.css';
import { Sidebar } from '@/components';

export const Layout = () => {
  return (
    <div className={Style['layout-container']}>
      <Sidebar />
      <Outlet />
    </div>
  );
};
