/***
 *
 *   PAYMASTERGRID
 *   Page with grid of all user paymasters
 *
 **********/

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@/components';

import { usePaymasters } from '../hooks/usePaymasters';
import { PaymasterSlide } from './PaymasterSlide';

import Style from './PaymasterGrid.module.css';

export const PaymasterGrid = ({ setDeleteModalOpen, setSelectedPaymasterId }) => {
  const userId = '24';
  const { paymasters, isLoadingPaymasters } = usePaymasters(`/user?created_by=${userId}`);

  const handleDeleteClick = (id: string) => {
    setSelectedPaymasterId(id);
    setDeleteModalOpen(true);
  };

  const options = [
    {
      label: 'Preview',
      icon: 'preview',
    },
    {
      label: 'Modify',
      icon: 'edit',
    },
    {
      label: 'Pause',
      icon: 'pause',
    },
    {
      label: 'Delete',
      icon: 'trash',
      action: (id: string) => handleDeleteClick(id),
      type: 'danger',
    },
  ];

  return (
    <div className="relative min-height mt24">
      {isLoadingPaymasters && <Loader />}
      <div className={Style['grid']}>
        {paymasters && paymasters.length > 0
          ? paymasters.map(({ name, id, data }) => {
              return <PaymasterSlide id={id} title={name} key={id} options={options} data={data} />;
            })
          : null}
      </div>
      {paymasters && paymasters.length === 0 ? <>no data</> : null}
    </div>
  );
};
