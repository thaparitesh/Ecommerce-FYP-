import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersFromAllUsersForVendor, getOrderDetailsVendor, updateOrderStatus } from '@/store/vendor-slice/order-slice'

const initialFormData = {
  status: '',
}


function VendorOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData)
  const dispatch = useDispatch()
  const {vendor} = useSelector(state => state.vendorAuth)
  
  const getVendorAmount = (orderDetails) => {
    if (!orderDetails.items || !vendor?.id) return 0;
    
    return orderDetails.items
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      .toFixed(2);
  }

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
  const getAvailableStatusOptions = (currentStatus) => {
    const statusFlow = ['pending','processing', 'shipped','delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex === -1) return []; 
    
    return statusFlow
      .slice(currentIndex + 1) 
      .map(status => ({
        id: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
      }));
  };
  
  
  const getVendorStatus = (orderDetails) => {
    if (orderDetails.items.length === 0) return 'pending';
    if (orderDetails.items.every(item => item.orderDetailStatus === 'delivered')) return 'delivered';
    if (orderDetails.items.some(item => item.orderDetailStatus === 'shipped')) return 'shipped';
    if (orderDetails.items.some(item => item.orderDetailStatus === 'processing')) return 'processing';
    return 'pending';
  };

  const currentStatus = getVendorStatus(orderDetails);
  const statusOptions = getAvailableStatusOptions(currentStatus);
  const showStatusForm = !['shipped', 'delivered'].includes(currentStatus);
  
  function handleUpdateStatus(e) {
    e.preventDefault()
    const { status } = formData
    
    dispatch(updateOrderStatus({
      id: orderDetails.orderID, 
      vendorID: vendor.id,
      orderDetailStatus: status
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsVendor(orderDetails.orderID, vendor?.id))
        if(vendor?.id){
              dispatch(getAllOrdersFromAllUsersForVendor(vendor?.id))
        }
        setFormData(initialFormData)
      }
    })
  }
  
  

  return (
    <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
      <div className='grid gap-6'>
        {/* Order Summary */}
        <div className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold'>Order #{orderDetails.orderID}</h3>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Status:</span>
              <StatusBadge status={getVendorStatus(orderDetails)} />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-muted-foreground'>Order Date</Label>
              <p>{new Date(orderDetails.orderDate).toLocaleString()}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Total Amount</Label>
              <p>Rs {getVendorAmount(orderDetails)}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Payment Method</Label>
              <p>{orderDetails.paymentMethod}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Payment Status</Label>
              <PaymentBadge status={orderDetails.paymentStatus} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Items ({orderDetails.items?.length || 0})</h4>
          <div className='border rounded-lg overflow-hidden'>
            <table className='w-full'>
              <thead className='border-b bg-gray-50'>
                <tr className='text-left'>
                  <th className='p-3'>Product</th>
                  <th className='p-3 text-right'>Price</th>
                  <th className='p-3 text-right'>Qty</th>
                  <th className='p-3 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.items?.map(item => (
                  <tr key={item.orderItemID} className='border-b last:border-0 hover:bg-gray-50'>
                    <td className='p-3'>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-10 h-10 rounded-md object-cover border hover:scale-150 transition-transform cursor-pointer"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg'
                            e.target.onerror = null
                          }}
                        />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">ID: {item.productID}</p>
                        </div>
                      </div>
                    </td>
                    <td className='p-3 text-right'>Rs {item.price.toFixed(2)}</td>
                    <td className='p-3 text-right'>{item.quantity}</td>
                    <td className='p-3 text-right font-medium'>Rs {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        {/* Shipping Information */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Shipping Information</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-muted-foreground'>Customer</Label>
              <p>{orderDetails.user?.userName || 'Guest'}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Phone</Label>
              <p>{orderDetails.address?.phoneNumber || 'N/A'}</p>
            </div>
            <div className='col-span-2'>
              <Label className='text-muted-foreground'>Address</Label>
              <p>
                {orderDetails.address?.address}, {orderDetails.address?.city}
              </p>
              {orderDetails.address?.notes && (
                <p className='text-sm text-muted-foreground mt-1'>
                  Notes: {orderDetails.address.notes}
                </p>
              )}
            </div>
          </div>
        </div>

      {showStatusForm && statusOptions.length > 0 ? (
        <>
          <Separator />
          <CommonForm 
            formControls={[
              {
                label: "Update Status",
                name: "status",
                componentType: "select",
                options: statusOptions,
              }, 
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={'Update Status'}
            onSubmit={handleUpdateStatus}
          />
        </>
      ) : null }
      </div>
    </DialogContent>
  )
}

export default VendorOrderDetailsView