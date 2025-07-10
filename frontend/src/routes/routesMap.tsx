import React from 'react';

import { PaymasterPage } from '@/pages/PaymasterPage';
import { PaymasterAddingPage } from '@/pages/PaymasterAddingPage';
  
export type AppRoute =
| ''
| 'paymaster'
| 'paymaster-add'

export type RouteConfig = {
  slug: AppRoute;
  path: string;
  label: string;
  component: JSX.Element;
};

export const routes: RouteConfig[] = [
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
  }
];