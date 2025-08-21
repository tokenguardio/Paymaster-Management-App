import React, { useState } from 'react';

import { Breadcrumbs, Button, Icon, Typography, Modal } from '@/components';

import { DeleteModalContent } from './components/DeleteModalContent';
import { PaymasterGrid } from './components/PaymasterGrid';

import Style from './Paymaster.module.css';

export const Paymaster = () => {
  const breadcrumbsItems = [
    '/',
    {
      key: 'paymaster',
      url: '/paymaster',
      name: 'Paymaster',
    },
  ];
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPaymasterId, setSelectedPaymasterId] = useState<string | null>(null);

  return (
    <>
      <main className={Style['paymaster']}>
        <div className={Style['breadcrumb-container']}>
          <Breadcrumbs items={breadcrumbsItems} />
          <Button
            moveTo="/paymaster-add"
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
        <PaymasterGrid
          setDeleteModalOpen={setDeleteModalOpen}
          setSelectedPaymasterId={setSelectedPaymasterId}
        />
        {isDeleteModalOpen && (
          <Modal title="Confirm Deletion" hasCloseButton={true} isOpen={setDeleteModalOpen}>
            <DeleteModalContent
              closeFn={setDeleteModalOpen}
              handleFn={() => console.log('add fn to handle req')}
              paymasterId={selectedPaymasterId}
            />
          </Modal>
        )}
      </main>
    </>
  );
};
