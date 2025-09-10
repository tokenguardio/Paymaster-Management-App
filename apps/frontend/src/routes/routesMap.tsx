import React from 'react';
import { PaymasterAddingPage } from '@/pages/PaymasterAddingPage';
import { PaymasterPage } from '@/pages/PaymasterPage';

export type TAppRoute = '' | 'paymaster' | 'paymaster-add';

export type TRouteConfig = {
  slug: TAppRoute;
  path: string;
  label: string;
  component: JSX.Element;
};

export const routes: TRouteConfig[] = [
  {
    slug: 'paymaster',
    path: '/paymaster',
    label: 'Paymaster',
    component: <PaymasterPage />,
  },
  {
    slug: 'paymaster-add',
    path: '/paymaster-add',
    label: 'Addd Paymaster',
    component: <PaymasterAddingPage />,
  },
];
