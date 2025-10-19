/***
 *
 *   POLICIES GRID
 *   Page with grid of all user policies
 *
 **********/

import React, { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/components';
import { TPolicies } from '@/types/policy';
import { PaymasterSlide } from './PaymasterSlide';
import Style from './PoliciesGrid.module.css';

type TPoliciesGridProps = {
  policies?: TPolicies;
  isLoadingPolicies: boolean;
  setDeleteModalOpen: Dispatch<React.SetStateAction<boolean>>;
  setSelectedPolicyId: Dispatch<React.SetStateAction<string | null>>;
};

export const PoliciesGrid: React.FC<TPoliciesGridProps> = ({
  policies,
  isLoadingPolicies,
  setDeleteModalOpen,
  setSelectedPolicyId,
}) => {
  const navigate = useNavigate();

  const handleDeleteClick = (id: string) => {
    setSelectedPolicyId(id);
    setDeleteModalOpen(true);
  };

  const options = [
    {
      label: 'Preview',
      value: 'preview',
      icon: 'preview',
      action: (id: string) => navigate(`/paymaster/${id}`),
    },
    {
      label: 'Modify',
      value: 'modify',
      icon: 'edit',
      action: (id: string) => navigate(`/paymaster/${id}/edit`),
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
          ? policies.map(({ name, id }) => {
              return <PaymasterSlide id={id} title={name} key={id} options={options} />;
            })
          : null}
      </div>
      {policies && policies.length === 0 ? <>No data</> : null}
    </div>
  );
};
