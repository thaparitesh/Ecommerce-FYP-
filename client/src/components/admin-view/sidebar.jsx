import { BadgePlus, ChartNoAxesCombined, CircleUserRound, HandCoins } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileBox, LayoutDashboard, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { PlusCircle } from 'lucide-react'; 

export const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icons: <LayoutDashboard />
  },
  {
    id: 'sales',
    label: 'Sales',
    path: '/admin/sales-report',
    icons: <HandCoins />
  },
  {
    id: 'add-product',
    label: 'Add Product',
    path: '/admin/products/add',
    icons: <PlusCircle />,
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icons: <ShoppingBag />,
  },
  
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
    icons: <FileBox />,
  },
  {
    id: 'vendors',
    label: 'Vendors',
    path: '/admin/vendors',
    icons: <BadgePlus />,
  },
  {
    id: 'account',
    label: 'Account',
    path: '/admin/account',
    icons: <CircleUserRound />
  }
]
function MenuItems({ setOpen }) { 
  const navigate = useNavigate();
  
  return (
    <nav className='mt-8 flex-col flex gap-2'>
      {adminSidebarMenuItems.map(menuItem => 
        <div 
          key={menuItem.id} 
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false): null;
          }} 
          className='flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground'>
            {menuItem.icons}
            <span>{menuItem.label}</span>
        </div>
      )}
    </nav>
  )
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='left' className='w-64'>
          <div className='flex flex-col h-full'>
            <SheetHeader className='border-b'>
              <SheetTitle className='flex gap-2 mt-5 mb-5'>
                <ChartNoAxesCombined size={30} />
                <h1 className='text-2xl font-extrabold'>AdminPanel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} /> 
          </div>
        </SheetContent>
      </Sheet>

      
      <aside className='hidden lg:flex w-64 flex-col border-r bg-background p-6'> 
        <div onClick={() => navigate('/admin/dashboard')} className='flex cursor-pointer items-center gap-2'>
          <ChartNoAxesCombined size={30} />
          <h1 className='text-2xl font-extrabold'>AdminPanel</h1>
        </div>
        <MenuItems setOpen={setOpen} /> 
      </aside>
    </Fragment>
  )
}

export default AdminSidebar
