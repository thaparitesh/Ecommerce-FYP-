import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

function VendorProductTile({ product, handleDelete }) {
  const navigate = useNavigate();
  
  return (
   <Card className='w-full max-w-sm-auto hover:shadow-md transition-shadow cursor-pointer'>
    <div className='relative' onClick={() => navigate(`/vendor/products/edit/${product.productID}`, { 
      state: { productData: product } 
    })}>
        <img
          src={product?.image}
          alt={product?.title}
          className='w-[200px] h-[200px] object-cover mx-auto'
        />
    </div>
    <CardContent onClick={() => navigate(`/vendor/products/edit/${product.productID}`, { 
      state: { productData: product } 
    })}>
        <h2 className='text-xl font-bold mb-2 mt-2'>
            {product?.title}
        </h2>
        <div className='flex justify-between items-center mb-2'>
           <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-primary`}>Rs{product?.price}</span>
           {product?.salePrice > 0 && (
            <span className='text-lg font-bold'>Rs{product?.salePrice}</span>
           )}
        </div>
    </CardContent>
    <CardFooter className='flex justify-between items-center'>
        <Button 
          className='w-19 bg-blue-600 hover:bg-blue-800'
          onClick={() => navigate(`/vendor/products/edit/${product.productID}`, { 
            state: { productData: { ...product } } 
          })}
        >
          Edit
        </Button>
        <Button 
          className='w-19 bg-red-600 hover:bg-red-800'
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(product.productID);
          }}
        >
          Delete
        </Button>
    </CardFooter>
   </Card>
  )
}

export default VendorProductTile