/***
 *
 *   SIDEBAR
 *
 **********/

import { clsx } from 'clsx';
import React, { useState } from 'react';
import { Line, Logo, Menu, Typography } from '@/components';
import { useMobile } from '@/hooks/useMobile';
import Style from './Sidebar.module.css';

export function Sidebar() {
  const _isMobile = useMobile();
  const [open, _setOpen] = useState(false); // mobile is open
  const [_fade, _setFade] = useState('');

  return (
    <aside
      className={clsx(Style.sidebar, Style['sidebar-mobile'], open ? Style.open : Style.close)}
    >
      <div className={Style['bar-wrapper']}>
        <Logo />
      </div>

      <section className={Style.menu}>
        <div>
          <Line />
          <Typography tag="p" size="m" weight="medium" text="Creator Tools" />
          <Menu />
        </div>
      </section>
      {/* <UserBox /> */}
    </aside>
  );
}

// const UserBox = () => {
//   // const { address } = useContext(authContext)

//   const handleLogout = () => {

//   }

//   const address = '0x55345435345345'

//   return (
//     <div>
//       <Typography
//         tag="p"
//         size="xs"
//         weight='regular'
//         text={`Logged in as: ${address}`}
//       />
//       <Button onClick={handleLogout}>
//         Log out
//       </Button>
//     </div>
//   )
// }
