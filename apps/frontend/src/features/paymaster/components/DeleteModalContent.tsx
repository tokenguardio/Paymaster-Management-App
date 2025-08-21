import React from 'react';
import { Button, Typography } from '@/components';
import Style from './DeleteModalContent.module.css';

interface DeleteModalContentProps {
  closeFn: (open: boolean) => void;
  handleFn: () => void;
  paymasterId: string | null;
}

export const DeleteModalContent: React.FC<DeleteModalContentProps> = ({
  closeFn,
  handleFn,
  paymasterId,
}) => {
  return (
    <div>
      <Typography
        tag="p"
        size="s"
        weight="regular"
        text={`Are you sure you want to delete paymaster with ID ${paymasterId}?`}
      />
      <div className={Style['action-bar']}>
        <Button size="large" onClick={handleFn} color="red500">
          Delete
        </Button>
        <Button size="large" variant="outline" color="primary500" onClick={() => closeFn(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
