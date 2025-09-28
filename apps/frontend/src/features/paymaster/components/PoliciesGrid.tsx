/***
 *
 *   POLICIES GRID
 *   Page with grid of all user policies
 *
 **********/

import React, { Dispatch } from 'react';
import { Loader } from '@/components';
import { PaymasterSlide } from './PaymasterSlide';
import Style from './PoliciesGrid.module.css';
import { usePolicies } from '../hooks/usePolicies';

type TPoliciesGridProps = {
  setDeleteModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setSelectedPolicyId: Dispatch<React.SetStateAction<string | null>>;
};

export const PoliciesGrid: React.FC<TPoliciesGridProps> = ({
  setDeleteModalOpen,
  setSelectedPolicyId,
}) => {
  const { policies, isLoadingPolicies } = usePolicies();

  const handleDeleteClick = (id: string) => {
    setSelectedPolicyId(id);
    setDeleteModalOpen(true);
  };

  const options = [
    {
      label: 'Preview',
      value: 'preview',
      icon: 'preview',
    },
    {
      label: 'Modify',
      value: 'modify',
      icon: 'edit',
    },
    {
      label: 'Pause',
      value: 'pause',
      icon: 'pause',
    },
    {
      label: 'Delete',
      value: 'delete',
      icon: 'trash',
      action: (id: string) => handleDeleteClick(id),
      type: 'danger',
    },
  ];

  return (
    <div className="relative min-height mt24">
      {isLoadingPolicies && <Loader />}
      <div className={Style['grid']}>
        {policies && policies.length > 0
          ? policies.map(({ name, id, data }) => {
              return <PaymasterSlide id={id} title={name} key={id} options={options} data={data} />;
            })
          : null}
      </div>
      {policies && policies.length === 0 ? <>no data</> : null}
    </div>
  );
};
