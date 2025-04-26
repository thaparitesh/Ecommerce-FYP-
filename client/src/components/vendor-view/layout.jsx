import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import VendorSidebar from './sidebar'
import VendorHeader from './header'

function VendorLayout() {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className='flex min-h-screen w-full'>
      {/* Sidebar */}
      <VendorSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className='flex flex-1 flex-col'>
        {/* Vendor Header */}
        <VendorHeader setOpen={setOpenSidebar} />
        <main className='flex-1 flex-col flex bg-muted/40 p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default VendorLayout
