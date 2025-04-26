import {  LogOut, Menu, ShoppingCart, User, Store } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser } from '@/store/auth-slice'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import logo from '../../assets/logo.png'
import { Label } from '../ui/label'
import { navigateWithFilters } from '@/config/navigation'

function MenuItems(){
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  async function handleNavigate(getCurrentMenuItem) {
    const filters = 
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    await navigateWithFilters(dispatch, navigate, getCurrentMenuItem.path, filters);
  }
  return <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'> 
  {
    shoppingViewHeaderMenuItems.map(menuItem=> 
      (<Label
        onClick={() => handleNavigate(menuItem)}
        className="text-sm font-medium cursor-pointer"
        key={menuItem.id}
      >
        {menuItem.label}
      </Label>)
    )}
  </nav>
}

function HeaderRightContent(){
  const {user} = useSelector(state=>state.auth)
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cartItems} = useSelector((state) => state.shopCart)
  
  function handleLogout(){
    dispatch(logoutUser())
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch, user?.id])
  
  return (
    <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
      {/* Add Become a Seller button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/vendorAuth/login')}
        className="hidden lg:flex items-center gap-2"
      >
        <Store className="w-4 h-4" />
        Become a Seller
      </Button>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant='outline' 
          size='icon'
          className='relative'>
          <ShoppingCart className='w-6 h-6'/>
          {cartItems?.items?.length > 0 && (
            <span className='absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center'>
              {cartItems.items.length}
            </span>
          )}
          <span className='sr-only'>User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []} />
      </Sheet> 
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='bg-black'>
            <AvatarFallback className='bg-black text-white font-extrabold'>
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' className='w-56'> 
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <User className='mr-2 h-4 w-4'/>
            Account
          </DropdownMenuItem>
          {/* Add Become a Seller option in dropdown */}
          <DropdownMenuItem onClick={() => navigate('/vendorAuth/login')}>
            <Store className='mr-2 h-4 w-4'/>
            Become a Seller
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4'/>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function ShoppingHeader() {
  const {isAuthenticated, user} = useSelector(state=>state.auth)

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <Link to='/shop/home' className='flex items-center gap-2'>
          <img src={logo} alt="HamroSupplement" className="h-9 w-full" />
        </Link>
        
        <div className="flex items-center gap-4">
         
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='lg:hidden'>
                <Menu className='h-6 w-6'/>
                <span className='sr-only'>Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-full max-w-xs'>
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className='hidden lg:block'>
          <MenuItems />
        </div>
        <div className='hidden lg:block'>
          <HeaderRightContent/>
        </div> 
      </div>
    </header>
  )
}

export default ShoppingHeader
