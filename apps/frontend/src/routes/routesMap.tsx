import React from 'react';
import { PaymasterAddingPage } from '@/pages/PaymasterAddingPage';
import { PaymasterEditPage } from '@/pages/PaymasterEditPage';
import { PaymasterPage } from '@/pages/PaymasterPage';
import { PaymasterPreviewPage } from '@/pages/PaymasterPreviewPage';

export type TAppRoute = '' | 'paymaster' | 'paymaster/new' | 'paymaster/:id' | 'paymaster/:id/edit';

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
    slug: 'paymaster/new',
    path: '/paymaster/new',
    label: 'Add Paymaster',
    component: <PaymasterAddingPage />,
  },
  {
    slug: 'paymaster/:id',
    path: '/paymaster/:id',
    label: 'Preview Paymaster',
    component: <PaymasterPreviewPage />,
  },
  {
    slug: 'paymaster/:id/edit',
    path: '/paymaster/:id/edit',
    label: 'Edit Paymaster',
    component: <PaymasterEditPage />,
  },
];
