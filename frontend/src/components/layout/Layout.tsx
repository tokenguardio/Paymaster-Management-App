import React from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components'

import Style from './Layout.module.css'

export const Layout = () => {
  return (
    <div className={Style['layout-container']}>
      <Sidebar />
      <Outlet />
    </div>
  )
}