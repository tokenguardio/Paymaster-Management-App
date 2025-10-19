import React from 'react';
import { toast } from 'react-toastify';
import { Button, Typography } from '@/components';
import Style from './DeleteModalContent.module.css';
import { deletePolicy } from '../utils/fetches';

interface IDeleteModalContentProps {
  closeFn: (open: boolean) => void;
  policyId: string | null;
  refreshData: () => void;
}

export const DeleteModalContent: React.FC<IDeleteModalContentProps> = ({
  closeFn,
  policyId,
  refreshData,
}) => {
  const handleDeletePolicy = async () => {
    if (!policyId) return;

    try {
      await deletePolicy(policyId);
      await refreshData();
      toast.success('Policy removed successfully');
      closeFn(false);
    } catch (err: unknown) {
      toast.error(err?.toString());
    }
  };

  return (
    <div>
      <Typography
        tag="p"
        size="s"
        weight="regular"
        text={`Are you sure you want to delete policy with ID ${policyId}?`}
      />
      <div className={Style['action-bar']}>
        <Button size="large" onClick={handleDeletePolicy} color="red500">
          Delete
        </Button>
        <Button size="large" variant="outline" color="primary500" onClick={() => closeFn(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
