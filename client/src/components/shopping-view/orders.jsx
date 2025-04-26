import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ShoppingOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import StarRatingComponent from '@/components/common/star-rating'
import { addReview, getReviews, getUnreviewedProducts } from '@/store/shop/review-slice'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewMsg, setReviewMsg] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector(state => state.shopOrder);
  const { reviews, unreviewedProducts } = useSelector(state => state.shopReview);

  
  const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered') || [];
  

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    if (!selectedProductForReview) return;
    
    dispatch(addReview({
      productID: selectedProductForReview.productID,
      userID: user.id,
      userName: user.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    })).then(data => {
      if(data.payload.success) {
        setRating(0);
        setReviewMsg('');
        setSelectedProductForReview(null);
        dispatch(getUnreviewedProducts(user?.id))
        toast.success('Review added successfully');
      }
    });
  }

  function handleFetchOrderDetails(orderID) {
    dispatch(getOrderDetails(orderID));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  // Filter orders based on active tab
  const filteredOrders = orderList?.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'delivered') return order.orderStatus === 'delivered';
    return order.orderStatus === activeTab;
  });

  useEffect(() => {
  if (user?.id) {
    dispatch(getUnreviewedProducts(user.id)); // Fetch unreviewed products
  }
}, [dispatch, user?.id]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order History</CardTitle>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-[400px]"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="reviews">To Review</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab}>
          <TabsContent value="all">
            <OrderTable 
              orders={filteredOrders} 
              isLoading={isLoading} 
              handleFetchOrderDetails={handleFetchOrderDetails} 
            />
          </TabsContent>
          <TabsContent value="delivered">
            <OrderTable 
              orders={filteredOrders} 
              isLoading={isLoading} 
              handleFetchOrderDetails={handleFetchOrderDetails} 
            />
          </TabsContent>
          <TabsContent value="processing">
            <OrderTable 
              orders={filteredOrders} 
              isLoading={isLoading} 
              handleFetchOrderDetails={handleFetchOrderDetails} 
            />
          </TabsContent>
          <TabsContent value="shipped">
            <OrderTable 
              orders={filteredOrders} 
              isLoading={isLoading} 
              handleFetchOrderDetails={handleFetchOrderDetails} 
            />
          </TabsContent>
          <TabsContent value="reviews">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Purchased Products</h3>
              {unreviewedProducts?.length === 0 ? (
                <p>No products available for review</p>
              ) : (
                <div className="space-y-4">
                  {unreviewedProducts?.map(product => (
                    <div key={`${product.orderID}-${product.productID}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Order #{product.orderID}</h4>
                        <span className="text-sm text-muted-foreground">
                          Delivered on {new Date(product.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 border rounded">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-16 h-16 rounded-md object-cover border"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                            e.target.onerror = null;
                          }}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{product.title}</h5>
                          
                          {selectedProductForReview?.productID === product.productID ? (
                            <div className="mt-3 space-y-3">
                              <div>
                                <Label>Rating</Label>
                                <div className="flex gap-1">
                                  <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Your Review</Label>
                                <Input
                                  value={reviewMsg}
                                  onChange={(e) => setReviewMsg(e.target.value)}
                                  placeholder="Share your experience with this product..."
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  onClick={handleAddReview} 
                                  disabled={!rating || !reviewMsg.trim()}
                                  className="flex-1"
                                >
                                  Submit Review
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setSelectedProductForReview(null);
                                    setRating(0);
                                    setReviewMsg('');
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2"
                              onClick={() => setSelectedProductForReview(product)}
                            >
                              Write Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </TabsContent>

     
        </Tabs>

        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }
          }}
        >
          {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Separate component for order table to reduce duplication
function OrderTable({ orders, isLoading, handleFetchOrderDetails }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Order Status</TableHead>
           <TableHead>Products</TableHead>
          <TableHead>Order Price</TableHead>
          <TableHead>Payment Status</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders && orders.length > 0 ? (
          orders.map((orderItem) => (
            <TableRow key={orderItem.orderID}>
              <TableCell>{orderItem.orderID}</TableCell>
              <TableCell>{orderItem.orderDate?.split('T')[0]}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  orderItem.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  orderItem.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                  orderItem.orderStatus === 'pending' ? 'bg-blue-100 text-blue-800' :
                  orderItem.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {orderItem.orderStatus}
                </span>
              </TableCell>
              <TableCell>
                    <div className="flex items-center gap-2">
                      {orderItem.items?.slice(0, 3).map((item, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-8 h-8 rounded-md object-cover border hover:scale-125 transition-transform cursor-pointer"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg'
                              e.target.onerror = null
                            }}
                          />
                          {index === 2 && orderItem.items.length > 3 && (
                            <span className="absolute -right-1 -bottom-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              +{orderItem.items.length - 3}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                                 
              <TableCell>Rs {orderItem.totalAmount}</TableCell>
              <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                  orderItem.orderStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  orderItem.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  orderItem.orderStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {orderItem.paymentStatus}
                </span>
                </TableCell>

              <TableCell>
                <Button
                  onClick={() => handleFetchOrderDetails(orderItem.orderID)}
                  disabled={isLoading}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ShoppingOrders;

