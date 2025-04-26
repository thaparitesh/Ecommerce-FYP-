import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersFromAllUsers, getOrderDetailsAdmin, updateOrderStatus } from '@/store/admin/order-slice'

const initialFormData = {
  status: '',
}

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData)
  const dispatch = useDispatch()

  
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
  const OrderStatusBadge = ({ status }) => {
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
    const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex === -1) return []; 
    
    return statusFlow
      .slice(currentIndex + 1) 
      .map(status => ({
        id: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
      }));
  };
  const statusOptions = getAvailableStatusOptions(orderDetails.orderStatus);
  const showStatusForm = !['delivered'].includes(orderDetails.orderStatus);
  

  const getAvailablePaymentStatusOptions = (currentStatus) => {
    if (currentStatus === 'paid') {
      return []; 
    }
    return [
      { id: 'paid', label: 'Paid' }
    ];
  };

  const paymentStatusOptions = getAvailablePaymentStatusOptions(orderDetails.paymentStatus);
  const showPaymentForm = orderDetails.paymentStatus !== 'paid';

  function handleSubmit(e) {
    e.preventDefault();
    
    const updates = {
      id: orderDetails.orderID,
      ...(formData.status && { orderStatus: formData.status }),
      ...(formData.paymentStatus && { paymentStatus: formData.paymentStatus })
    };
    
    if (updates.orderStatus || updates.paymentStatus) {
      dispatch(updateOrderStatus(updates)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsAdmin(orderDetails.orderID));
          dispatch(getAllOrdersFromAllUsers());
          setFormData(initialFormData);
        }
      });
    }
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
              <StatusBadge status={orderDetails.orderStatus} />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-muted-foreground'>Order Date</Label>
              <p>{new Date(orderDetails.orderDate).toLocaleString()}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Total Amount</Label>
              <p>Rs {orderDetails.totalAmount.toFixed(2)}</p>
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
                  <th className='p-3 text-right'>Status</th>
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
                    <td className='p-3 text-right'><OrderStatusBadge status={item.orderDetailStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        
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

        
        
{(showStatusForm || showPaymentForm) && (
          <>
            <Separator />
            <CommonForm 
              formControls={[
                ...(showStatusForm ? [{
                  label: "Update Order Status",
                  name: "status",
                  componentType: "select",
                  options: statusOptions,
                  placeholder: "Select new status"
                }] : []),
                ...(showPaymentForm ? [{
                  label: "Update Payment Status",
                  name: "paymentStatus",
                  componentType: "select",
                  options: paymentStatusOptions,
                  placeholder: "Select payment status"
                }] : [])
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={'Update Order'}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </DialogContent>
  )
}

export default AdminOrderDetailsView