/***
 *
 *   LOGO
 *   logo brand with link to homepage
 *
 **********/

import React from 'react';
import { NavLink } from 'react-router-dom';

import brandLogo from '@/assets/images/logo-patterns.svg';

import Style from './Logo.module.css';

export const Logo = () => (
  <NavLink to="/" className={Style.logo}>
    <img src={brandLogo} alt="Logo Patterns" />
  </NavLink>
);
