import React, { JSX } from 'react';
import { PaymasterPage } from '@/pages/PaymasterPage';
import { PolicyAddingPage } from '@/pages/PolicyAddingPage';
import { PolicyEditPage } from '@/pages/PolicyEditPage';
import { PolicyPreviewPage } from '@/pages/PolicyPreviewPage';

export type TAppRoute = '' | 'paymaster' | 'policy/new' | 'policy/:id' | 'policy/:id/edit';

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
    slug: 'policy/new',
    path: '/policy/new',
    label: 'Add Policy',
    component: <PolicyAddingPage />,
  },
  {
    slug: 'policy/:id',
    path: '/policy/:id',
    label: 'Preview Policy',
    component: <PolicyPreviewPage />,
  },
  {
    slug: 'policy/:id/edit',
    path: '/policy/:id/edit',
    label: 'Edit Policy',
    component: <PolicyEditPage />,
  },
];
