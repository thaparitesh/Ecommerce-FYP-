import { AlignJustify, LogOut } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice';

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  function handleLogout(){
    dispatch(logoutUser())
  }

  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'> 
      <Button onClick={() => setOpen(true)} className='lg:hidden'> 
        <AlignJustify />
        <span className='sr-only'>Toggle Menu</span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button onClick={handleLogout} className='inline-flex gap-2 items-center rounded-md px-4 text-sm font-medium shadow'> {/* ✅ Fixed 'shadow' */}
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
