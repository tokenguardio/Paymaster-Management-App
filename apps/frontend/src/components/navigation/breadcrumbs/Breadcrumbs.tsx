/***
 *
 *   BREADCRUMBS
 *   Navigation trail for nested pages.
 *
 *   PROPS
 *   items: array of objects containing keys: name and url
 *
 **********/

import React from 'react';
import { NavLink } from 'react-router-dom';
import Style from './Breadcrumbs.module.css';

type TSingleBreadcrumb = {
  url: string;
  name: string;
};

type TBreadcrumbsProps = {
  items: Array<TSingleBreadcrumb>;
};

export const Breadcrumbs = ({ items }: TBreadcrumbsProps) => (
  <ul className={Style.breadcrumbs}>
    {items?.map((item: TSingleBreadcrumb, index: number) => {
      return (
        <li key={`${item.name}${index}`}>
          <NavLink
            to={item.url}
            className={({ isActive }) =>
              isActive ? `${Style['active-link']} ${Style.link}` : Style.link
            }
            end
          >
            {item.name}
          </NavLink>
        </li>
      );
    })}
  </ul>
);
