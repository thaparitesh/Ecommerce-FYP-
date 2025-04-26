import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '@/store/shop/product-slice';
import { Star, ChevronLeft, ShoppingCart, Truck, CreditCard, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { Label } from '@/components/ui/label';
import StarRatingComponent from '@/components/common/star-rating';
import { Input } from '@/components/ui/input';
import { Separator } from '@radix-ui/react-select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { addReview, getReviews } from '@/store/shop/review-slice';

function ProductDetailsPage() {
  const { productId } = useParams();
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const{cartItems} = useSelector(state => state.shopCart )
  const{reviews} = useSelector(state => state.shopReview )
  

  const { productDetails, status, error } = useSelector(state => state.shopProducts);
  const [quantity, setQuantity] = useState(1);

  // function handleRatingChange(getRating){
  //   setRating(getRating)
  // }
  // function handleAddReview(){
  //   dispatch(addReview({
  //     productID: productDetails.productID,
  //     userID: user.id,
  //     userName: user.userName,
  //     reviewMessage: reviewMsg,
  //     reviewValue: rating,

  //   })).then(data=>{
  //     if(data.payload.success){
  //       setRating(0)
  //       setReviewMsg('')
  //       dispatch(getReviews(productDetails.productID))
  //       toast.success('review added succesfully')
  //     }
    
      
  //   })
  // }
  useEffect(()=>{

    if(productDetails !== null){
      dispatch(getReviews(productDetails.productID))
    }
  },[productDetails])
  

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
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
      dispatch(addToCart({userID : user?.id, productID : getCurrentProductId, quantity : quantity 
      })).then(data => {
        if(data?.payload?.success){
          dispatch(fetchCartItems(user?.id));
          toast.success(`Added ${quantity} item(s) to Cart`);
        }
      })
  }

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }

    return () => {
      dispatch(clearProductDetails());
    };
  }, [productId, dispatch]);

  const increaseQuantity = () => {
    if (quantity + 1 > productDetails?.totalStock) {
      toast.error(`Only ${productDetails?.totalStock} items available`, {
        style: { background: 'red', color: 'white' },
      });
      return;
    }
    setQuantity(prev => prev + 1);
  }
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  
  if (!productDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 w-full flex justify-start">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <p>Product not found</p>
      </div>
    );
  }
  const averageReview = reviews && reviews.length > 0?
  reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  reviews.length : 0




  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Products Button */}
      <div className="mb-6 w-full flex justify-start">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image - Reduced Size */}
        <div className="relative overflow-hidden rounded-lg bg-gray-50 flex justify-center">
          <img
            src={productDetails.image}
            alt={productDetails.title}
            className="w-full max-w-[400px] h-[400px] object-cover object-center rounded-lg"
          />
          {
          productDetails?.totalStock === 0?
          <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>
            Out of stock
          </Badge>
          : 
          productDetails?.totalStock<5 ?
           <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600'>
            {`Only ${productDetails?.totalStock} items left`}
            </Badge>
          :
          productDetails.salePrice > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold">{productDetails.title}</h1>
          <div className="flex items-center gap-2">
            {/* <Star className="h-4 w-4 text-yellow-500" rating={averageReview} /> */}
            <StarRatingComponent rating={averageReview} />
            <span>({averageReview.toFixed(1)}) ({reviews.length} review)</span>
          </div>

          <p className="text-muted-foreground text-lg">{productDetails.description}</p>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            {productDetails.salePrice > 0 && (
              <p className="text-3xl font-bold text-primary line-through">Rs{productDetails.price}</p>
            )}
            <p className={`text-3xl font-bold ${productDetails.salePrice > 0 ? 'text-red-600' : 'text-primary'}`}>
              Rs{productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price}
            </p>
            {productDetails.salePrice > 0 && (
              <Badge className="bg-green-100 text-green-800">Save Rs{productDetails.price - productDetails.salePrice}</Badge>
            )}
          </div>

          {/* Quantity Controls */}
         {/* Quantity Controls - Only show if product is in stock */}
          {productDetails?.totalStock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={decreaseQuantity}
                  className="px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={increaseQuantity}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Add to Cart Button  */}
          {
            productDetails?.totalStock === 0?
            <Button 
            className='w-full opacity-60 cursor-not-allowed bg-orange-600 hover:bg-orange-700'>
            Out of Stock
           </Button>
          :
          
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md"
          onClick={()=> handleAddToCart(productDetails?.productID, productDetails?.totalStock)}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
           }

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">Delivered in 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-muted-foreground">100% secure</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-xl font-bold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Brand</p>
                <p className="font-medium">{productDetails.brand || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{productDetails.category || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {productDetails.specifications && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-xl font-bold">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(productDetails.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

<Separator />
<div className="max-h-[300px] overflow-auto">
  <h2 className="text-xl font-bold mb-4">Reviews</h2>
  <div className="grid gap-6">
    {reviews && reviews.length > 0 ? (
      reviews.map((reviewItem) => (
        <div className="flex gap-4" key={reviewItem.reviewID}>
          <Avatar className="w-10 h-10 border">
            <AvatarFallback>
              {reviewItem?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{reviewItem?.userName}</h3>
            </div>
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={reviewItem?.reviewValue} />
            </div>
            <p className="text-muted-foreground">
              {reviewItem.reviewMessage}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;