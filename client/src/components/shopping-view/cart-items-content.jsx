import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice'
import { toast } from 'sonner'

function UserCartItemsContent({ cartItem }) {
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const {cartItems} = useSelector(state => state.shopCart)
  const {productList} = useSelector(state => state.shopProducts)
  
  
  function handleUpdateQuantity(getCartItem, typeOfAction){
   if(typeOfAction ==='plus'){
    let getCartItems = cartItems.items || [];
      
          if(getCartItems.length){
            const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productID === getCartItem?.productID)
            
            const getCurrentProductIndex = productList.findIndex(product => product.productID === getCartItem?.productID)
            const getTotalStock = productList[getCurrentProductIndex].totalStock
            
            if(indexOfCurrentCartItem>-1){
              const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
              if(getQuantity + 1 > getTotalStock){
                toast.error(`Only ${getQuantity} quantity can be added for this product`,{
                  style: { background: 'red', color: 'white' },
                });
                return;
              }
            }
          }
   }

    dispatch(updateCartQuantity({userID: user?.id, productID: getCartItem?.productID, quantity:
      typeOfAction === 'plus' ?
      getCartItem?.quantity +1 : getCartItem?.quantity - 1
      }))
  }
  
  function handleCartItemDelete(getCartItem) {
        
        dispatch(
          deleteCartItem({ userID: user?.id, productID: getCartItem?.productID })
        )
        
      }
  

  return (
    <div className="flex items-center space-x-4">
      <img 
        src={cartItem?.image}
        alt={cartItem?.title}
        className='w-20 h-20 rounded object-cover' 
      />
      <div className='flex-1'>
        <h3 className="font-medium">{cartItem?.title}</h3>
        <div className='flex items-center gap-2 mt-1'>
          <Button variant='outline' className='h-8 w-8 rounded-full' size='icon'
           disabled={cartItem?.quantity===1}
           onClick={()=> handleUpdateQuantity(cartItem,'minus')}>
            <Minus className='w-4 h-4'/>
            <span className='sr-only'> Decrease</span>
          </Button>
          <span className="text-sm text-gray-500">{cartItem.quantity}</span>
          <Button variant='outline' className='h-8 w-8 rounded-full' size='icon'
            onClick={()=> handleUpdateQuantity(cartItem,'plus')}>
            <Plus className='w-4 h-4'/>
            <span className='sr-only'> Decrease</span>
          </Button>
        </div>  
      </div>
      <div className='flex flex-col items-end'>
        <p className="font-medium">Rs{((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price)* cartItem?.quantity)}</p>
        <Trash onClick={()=> handleCartItemDelete(cartItem)} className='cursor-pointer mt-1' size={20}/>
      </div>
    </div>
  )
}

export default UserCartItemsContent
