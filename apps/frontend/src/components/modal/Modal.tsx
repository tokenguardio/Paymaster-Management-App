import React, { ReactNode } from 'react';

import Style from './Modal.module.css';
import { Icon, IconButton, Typography } from '@/components';

interface IModalProps {
  children: ReactNode;
  title: string;
  hasCloseButton: boolean;
  isOpen: (value: boolean) => void;
}

export const Modal: React.FC<IModalProps> = ({ children, title, hasCloseButton, isOpen }) => {
  return (
    <div className={Style['modal-container']}>
      <div className={Style['modal']}>
        <div className={Style['header']}>
          {title && <Typography tag="h1" size="l" className={Style['title']} text={title} />}
          {hasCloseButton && (
            <IconButton
              onClick={() => isOpen(false)}
              icon={<Icon name="exit" height="1.6rem" width="1.6rem" />}
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
