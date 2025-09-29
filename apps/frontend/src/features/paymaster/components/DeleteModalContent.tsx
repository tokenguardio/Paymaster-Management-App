import React from 'react';
import { toast } from 'react-toastify';
import { Button, Typography } from '@/components';
import Style from './DeleteModalContent.module.css';
import { deletePolicy } from '../utils/fetches';

interface IDeleteModalContentProps {
  closeFn: (open: boolean) => void;
  handleFn: () => void;
  policyId: string | null;
}

export const DeleteModalContent: React.FC<IDeleteModalContentProps> = ({
  closeFn,
  handleFn,
  policyId,
}) => {
  const handleDeletePolicy = async () => {
    if (!policyId) return;

    try {
      await deletePolicy(policyId);
      await handleFn();
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
        <Button size="large" onClick={handleFn} color="red500" onClick={handleDeletePolicy}>
          Delete
        </Button>
        <Button size="large" variant="outline" color="primary500" onClick={() => closeFn(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
