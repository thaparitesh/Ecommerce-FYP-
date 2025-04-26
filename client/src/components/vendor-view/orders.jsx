import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import VendorOrderDetailsView from './order-details'
import { getAllOrdersFromAllUsersForVendor, getOrderDetailsVendor, resetOrderDetails } from '@/store/vendor-slice/order-slice'

function VendorOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const {vendor} = useSelector(state => state.vendorAuth)
  const {orderList, orderDetails, isLoading} = useSelector(state => state.vendorOrder)
  const dispatch = useDispatch()

  function handleFetchOrderDetails(orderID) {
    dispatch(getOrderDetailsVendor({id: orderID, vendorID:vendor?.id}))
  }

  const getVendorStatus = (order) => {
    if (order.items.length === 0) return 'pending';
    if (order.items.every(item => item.orderDetailStatus === 'delivered')) return 'delivered';
    if (order.items.some(item => item.orderDetailStatus === 'shipped')) return 'shipped';
    if (order.items.some(item => item.orderDetailStatus === 'processing')) return 'processing';
    return 'pending';
  };

  

  const getVendorAmount = (order) => {
    if (!order.items || !vendor?.id) return 0;
    
    return order.items
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      .toFixed(2);
  }

  useEffect(() => {
    if(vendor?.id){
      dispatch(getAllOrdersFromAllUsersForVendor(vendor?.id))
    }
  }, [dispatch, vendor?.id])

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true)
    }
  }, [orderDetails])

  // Filter orders based on active tab
  const filteredOrders = orderList?.filter(order => {
    if (activeTab === 'all') return true
    const vendorStatus = getVendorStatus(order);
    return vendorStatus === activeTab;
  })

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[status.toLowerCase()] || statusStyles.default}`}>
        {status}
      </span>
    )
  }

  // Payment badge component
  const PaymentBadge = ({ status }) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[status.toLowerCase()] || statusStyles.default}`}>
        {status}
      </span>
    )
  }

  console.log('orderlist',orderList);
  console.log('orderDetails',orderDetails);
  

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Order Management</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Payment</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.orderID}>
                  <TableCell className="font-medium">#{order.orderID}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={getVendorStatus(order)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.items
                        
                        ?.slice(0, 3)
                        .map((item, index) => (
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
                            {index === 2 && order.items.filter(i => i.product?.vendorID === vendor?.id).length > 3 && (
                              <span className="absolute -right-1 -bottom-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                +{order.items.filter(i => i.product?.vendorID === vendor?.id).length - 3}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>Rs {getVendorAmount(order)}</TableCell>
                  <TableCell>
                    <PaymentBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFetchOrderDetails(order.orderID)}
                      disabled={isLoading}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No {activeTab === 'all' ? '' : activeTab} orders found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenDetailsDialog(false)
              dispatch(resetOrderDetails())
            }
          }}
        >
          {orderDetails && <VendorOrderDetailsView orderDetails={orderDetails} />}
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default VendorOrdersView