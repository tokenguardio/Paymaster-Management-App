/***
 *
 *   ACCORDION
 *
 **********/

import React, { ReactNode, useState } from 'react';
import { Icon, Typography } from '@/components';
import Style from './Accordion.module.css';

interface IAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<IAccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={Style.accordion}>
      <button className={Style.header} onClick={toggle}>
        <Typography tag="p" text={title} size="m" weight="medium" />
        {/* <h2 className={Style.title}>{title}</h2> */}
        <span className={Style.icon}>
          {isOpen ? (
            <Icon width="12" height="12" name="chevronUp" color="primary500" />
          ) : (
            <Icon width="12" height="12" name="chevronDown" color="primary500" />
          )}
        </span>
      </button>
      {isOpen && <div className={Style.content}>{children}</div>}
    </div>
  );
};
