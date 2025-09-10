import React, { useState } from 'react';
import { Icon, IconButton, TextInput } from '@/components';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import Style from './PaymasterTitle.module.css';

export const PaymasterTitle = ({ maxLength = 32 }) => {
  const [paymasterTitle, setPaymasterTitle] = useState('Spending Policy');
  const [editing, setEditing] = useState<boolean>(false);

  const ref = useOutsideClick(() => {
    setEditing(false);
  });

  const handleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymasterTitle(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  return (
    <div className={Style['paymaster-title-container']} ref={ref}>
      {editing ? (
        <div className={Style['input-container']}>
          <TextInput
            name="dashboard-title"
            value={paymasterTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={maxLength}
          />
          <span className={Style['char-count']}>
            {paymasterTitle.length} / {maxLength}
          </span>
        </div>
      ) : (
        <p className={Style['title']}>{paymasterTitle}</p>
      )}
      <IconButton
        onClick={handleClick}
        icon={<Icon name="edit" height="1.6rem" width="1.6rem" />}
      />
    </div>
  );
};
