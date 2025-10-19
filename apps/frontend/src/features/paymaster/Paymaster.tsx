import React, { useState } from 'react';
import { Breadcrumbs, Button, Icon, Modal, Typography } from '@/components';
import { DeleteModalContent } from './components/DeleteModalContent';
import { PoliciesGrid } from './components/PoliciesGrid';
import { usePolicies } from './hooks/usePolicies';
import Style from './Paymaster.module.css';

export const Paymaster = () => {
  const breadcrumbsItems = [
    {
      key: '/',
      url: '/',
      name: '',
    },
    {
      key: 'paymaster',
      url: '/paymaster',
      name: 'Paymaster',
    },
  ];
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const { policies, isLoadingPolicies, refreshData } = usePolicies();

  return (
    <>
      <main className={Style['paymaster']}>
        <div className={Style['breadcrumb-container']}>
          <Breadcrumbs items={breadcrumbsItems} />
          <Button
            moveTo="/paymaster/new"
            size="large"
            startIcon={<Icon name="plus" width="16" height="16" color="white" />}
          >
            New Policy
          </Button>
        </div>
        <div className={`${Style['headline-container']} mt24 mb24`}>
          <Typography
            tag="h1"
            text="Paymaster Policies"
            color="primary500"
            size="l"
            weight="medium"
          />
          <Typography
            tag="h2"
            text="A list of policies you have created"
            color="primary500"
            size="s"
            weight="regular"
          />
        </div>
        <PoliciesGrid
          policies={policies}
          isLoadingPolicies={isLoadingPolicies}
          setDeleteModalOpen={setDeleteModalOpen}
          setSelectedPolicyId={setSelectedPolicyId}
        />
        {isDeleteModalOpen && (
          <Modal title="Confirm Deletion" hasCloseButton={true} isOpen={setDeleteModalOpen}>
            <DeleteModalContent
              closeFn={setDeleteModalOpen}
              refreshData={refreshData}
              policyId={selectedPolicyId}
            />
          </Modal>
        )}
      </main>
    </>
  );
};
