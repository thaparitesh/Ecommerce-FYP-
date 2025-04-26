import React from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { brandOptionsMap, categoryOptionsMap } from '@/config'

function ShoppingProductTile({ product, onClick, handleAddToCart }) {
  const isHomePage = location.pathname === "/shop/home";
  
  return (
    <Card className='w-full max-w-sm mx-auto hover:shadow-md transition-shadow'>
      <div onClick={() => onClick(product?.productID)} className='cursor-pointer'>
        <div className='relative'>
          <img 
            src={product?.image}
            alt={product?.title}
            className='w-[180px] h-[180px] object-cover mx-auto'
          />
          {
          product?.totalStock === 0?
          <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>
            Out of stock
          </Badge>
          : 
          product?.totalStock<5 ?
           <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>
            {`Only ${product?.totalStock} items left`}
            </Badge>
          :
          product?.salePrice > 0 && (
            <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>Sale</Badge>
          )}
        </div>
        
        <CardContent className='p-4'>
          <h2 className='text-xl font-bold mb-2'>{product?.title}</h2>
          
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-muted-foreground'>
              {categoryOptionsMap[product?.category]}
            </span>
            <span className='text-sm text-muted-foreground'>
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          
          <div className='flex justify-between items-center mb-2'>
            <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-primary`}>
              Rs{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className='text-lg font-semibold text-primary'>
                Rs{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
        
      </div>
      {!isHomePage && (
        <CardFooter>
          {
            product?.totalStock === 0?
            <Button
            className='w-full opacity-60 cursor-not-allowed bg-orange-600 hover:bg-orange-700'>
            Out of Stock
           </Button>
          :
          <Button onClick={() => handleAddToCart(product?.productID, product?.totalStock)} 
            className='w-full bg-orange-600 hover:bg-orange-700'>
            Add to cart
           </Button>
          }
        </CardFooter>
      )}

    </Card>
  )
}

export default ShoppingProductTile