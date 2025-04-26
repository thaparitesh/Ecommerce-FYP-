import Address from '@/components/shopping-view/address'
import UserCartItemsContent from '@/components/shopping-view/cart-items-content'
import { Button } from '@/components/ui/button'
import { createNewOrder, verifyEsewaPayment } from '@/store/shop/order-slice'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function ShoppingCheckout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth) 
  const { cartItems } = useSelector(state => state.shopCart)
  const { isLoading, error } = useSelector(state => state.shopOrder)

  const[currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
    

  const totalCartAmount = cartItems?.items?.reduce(
    (sum, item) => sum + (item?.salePrice || item?.price) * item?.quantity,
    0
  ) || 0

  
  
  const handleCheckout = async () => {
    if(cartItems.items.length === 0){
      toast.error('Your cart is empty',{
        style: { background: 'red', color: 'white' }})
    }
    else if(!currentSelectedAddress){
      toast.error('Please select a delivery address',{
        style: { background: 'red', color: 'white' }})
      
    }

    const orderData = {
      userID: user.id,
      cartID: cartItems.cartID,
      addressID: currentSelectedAddress.addressID,
      paymentMethod: 'esewa', 
      totalAmount: totalCartAmount
    }

    const result = await dispatch(createNewOrder(orderData))
    
    if (createNewOrder.fulfilled.match(result)) {
      if (result.payload.formAction && result.payload.formData) {
        // Create a hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.payload.formAction;
        form.style.display = 'none';
        
        // Add all form fields
        Object.entries(result.payload.formData).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    }
  }
 

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
        <Address selectedID={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress}/>
        
        <div className='flex flex-col gap-4'>
          {cartItems?.items?.map(item => (
            <UserCartItemsContent key={item.cartItemID} cartItem={item} />
          ))}
          
          <div className='mt-5 px-2 space-y-4 border-t pt-4'>
            <div className='flex justify-between'>
              <span className='font-semibold'>Total</span>
              <span className='font-semibold'>Rs {totalCartAmount}</span>
            </div>
          </div>
          
          <div className='mt-4 w-full'>
            <Button 
              className='w-full'
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'Processing Checkout...' : 'Checkout with eSewa'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout