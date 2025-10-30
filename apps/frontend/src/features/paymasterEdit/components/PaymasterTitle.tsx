import React, { useState } from 'react';
import { Icon, IconButton, TextInput } from '@/components';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import Style from './PaymasterTitle.module.css';

interface IPaymasterTitleProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const PaymasterTitle: React.FC<IPaymasterTitleProps> = ({
  value,
  onChange,
  maxLength = 32,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const ref = useOutsideClick(() => setEditing(false));

  const handleClick = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => setEditing(false);

  return (
    <div className={Style['paymaster-title-container']} ref={ref}>
      {editing ? (
        <div className={Style['input-container']}>
          <TextInput
            name="name"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={maxLength}
          />
          <span className={Style['char-count']}>
            {value.length} / {maxLength}
          </span>
        </div>
      ) : (
        <p className={Style['title']}>{value}</p>
      )}
      <IconButton
        onClick={handleClick}
        icon={<Icon name="edit" height="1.6rem" width="1.6rem" />}
      />
    </div>
  );
};
