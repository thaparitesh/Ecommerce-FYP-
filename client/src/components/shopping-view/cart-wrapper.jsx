import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemsContent from './cart-items-content';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function UserCartWrapper({ cartItems, setOpenCartSheet }) {  
  const navigate = useNavigate()

  const totalCartAmount = 
    cartItems && cartItems.length > 0 ?
      cartItems.reduce(
      (sum, currentItem) => 
          sum + 
          (currentItem?.salePrice > 0 ?
            currentItem?.salePrice : currentItem?.price) * currentItem?.quantity ,0

    ) : 0;
  // console.log(cartItems, 'cart items');
  
  const handleCheckout = () => {
   
    if (cartItems.length === 0) {
      toast.error('Your cart is empty', {
        style: { background: 'red', color: 'white' }
      });
    }else{
    
    navigate('/shop/checkout');
    setOpenCartSheet(false);
    return true; // Return true if successful
    }
  };
  
  return (
    <SheetContent className='sm:max-w-md p-6'>
        <SheetHeader className='px-2 text-center'>
            <SheetTitle className='text-xl font-semibold'>
              Cart 
            </SheetTitle>
        </SheetHeader>
        
        <div className='flex-1 overflow-y-auto px-2 py-2 space-y-4'>
        {cartItems && cartItems.length > 0 ? 
          cartItems.map((item) => (
            <UserCartItemsContent key={item.id} cartItem={item} />
          )) : (
            <p className='py-4 text-center'>Your cart is empty</p>
          )}
         </div>
        
        <div className='mt-5 px-2 space-y-4 border-t pt-4'>
            <div className='flex justify-between'>
                <span className='font-semibold'>Total</span>
                <span className='font-semibold'>Rs{totalCartAmount}</span>
            </div>
        </div>
        
        <Button onClick={()=> {
          handleCheckout()
        }}
           className='w-full mt-6'>Checkout</Button>
    </SheetContent>
  )
}

export default UserCartWrapper
