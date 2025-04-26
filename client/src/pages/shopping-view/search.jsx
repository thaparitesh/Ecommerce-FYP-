import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Input } from '@/components/ui/input'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { resetSearchResults, searchProducts } from '@/store/shop/search-slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

function SearchProducts() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const {user} = useSelector(state => state.auth)
  const {searchResults} = useSelector(state => state.shopSearch)
  const {cartItems} = useSelector(state => state.shopCart)
  const dispatch = useDispatch()
  
  useEffect(()=>{
    if(keyword && keyword.trim() !== '' && keyword.trim().length > 3){
        setTimeout(()=>{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(searchProducts(keyword))
        },1000)
    }else{
        dispatch(resetSearchResults(keyword))
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
    }
  },[keyword])

  const handleProductClick = (productId) => {
    navigate(`/shop/listing/${productId}`);
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    console.log(cartItems,"cart");
    let getCartItems = cartItems.items || [];

    if(getCartItems.length){
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productID === getCurrentProductId)
      if(indexOfCurrentItem>-1){
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if(getQuantity + 1 > getTotalStock){
          toast.error(`Only ${getQuantity} quantity can be added for this product`,{
            style: { background: 'red', color: 'white' },
          });
          return;
        }
      } 
    }
    if (!user?.id) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch(addToCart({
      userID: user.id, 
      productID: getCurrentProductId, 
      quantity: 1
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success('Product added to cart');
      } else {
        toast.error('Failed to add product to cart');
      }
    });
  };
   
  return (
    <div className='container mx-auto md:px-6 px-6 py-8'>
        <div className='w-full flex items-center'>
            <Input value={keyword} name='keyword' onChange={(event)=>setKeyword(event.target.value)} className='py-6' placeholder='Search Products...'/>
        </div>
        {
            !searchResults.length ?
            <h1 className='text-2xl font-bold'>No Result</h1>
            : null
        }
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {searchResults.map(item => (
                <ShoppingProductTile
                    key={item.productID}  
                    product={item}
                    onClick={() => handleProductClick(item.productID)}
                    handleAddToCart={handleAddToCart}
                /> 
            ))}
        </div>
    </div>
  )
}

export default SearchProducts