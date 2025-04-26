import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import CommonForm from '@/components/common/form'
import { useDispatch } from 'react-redux'
import { updateVendorStatus } from '@/store/admin/approveVendor-slice'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

const initialFormData = {
  status: '',
}

function VendorDetailsView({ vendor }) {
  const [formData, setFormData] = useState(initialFormData)
  const dispatch = useDispatch()
  
  // Check if vendor is rejected
  const isRejected = vendor.status.toLowerCase() === 'rejected'

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-red-400 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[status.toLowerCase()] || statusStyles.default}`}>
        {status}
      </span>
    )
  }

  function handleUpdateStatus(e) {
    e.preventDefault()
    // Prevent update if rejected
    if (isRejected) return
    
    const { status } = formData
    
    dispatch(updateVendorStatus({
      vendorID: vendor.vendorID, 
      status
    })).then(() => {
      setFormData(initialFormData)
    })
  }

  return (
    <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
      <div className='grid gap-6'>
        {/* Vendor Summary */}
        <div className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold'>{vendor.businessName}</h3>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Status:</span>
              <StatusBadge status={vendor.status} />
            </div>
          </div>
          
          {vendor.businessLogo && (
            <div className="flex justify-center">
              <img 
                src={vendor.businessLogo} 
                alt={vendor.businessName}
                className="w-32 h-32 rounded-md object-cover border"
                onError={(e) => {
                  e.target.src = '/placeholder-vendor.jpg'
                  e.target.onerror = null
                }}
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Business Information */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Business Information</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-muted-foreground'>Owner Name</Label>
              <p>{vendor.ownerName}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Email</Label>
              <p>{vendor.email}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Phone</Label>
              <p>{vendor.phone || 'N/A'}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Registered Date</Label>
              <p>{new Date(vendor.createdAt).toLocaleDateString()}</p>
            </div>
            <div className='col-span-2'>
              <Label className='text-muted-foreground'>Business Address</Label>
              <p>{vendor.address || 'N/A'}</p>
            </div>
            {vendor.businessDescription && (
              <div className='col-span-2'>
                <Label className='text-muted-foreground'>Description</Label>
                <p className='text-sm text-muted-foreground'>{vendor.businessDescription}</p>
              </div>
            )}
            {vendor?.panIDImage && (
              <div className="col-span-2">
                <Label className='text-muted-foreground'>PAN Card</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img 
                        src={vendor.panIDImage} 
                        alt="PAN Card"
                        className="w-10 h-10 rounded-md object-cover border hover:scale-150 transition-transform cursor-pointer"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg'
                          e.target.onerror = null
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[80vh]">
                      <div className="flex justify-center items-center h-full">
                        <img 
                          src={vendor.panIDImage} 
                          alt="PAN Card"
                          className="max-h-[500px] max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg'
                            e.target.onerror = null
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
            )}

            {vendor?.NIDImage && (
              <div className="col-span-2">
                <Label className='text-muted-foreground'>NID Card</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img 
                        src={vendor.NIDImage} 
                        alt="NID Card"
                        className="w-10 h-10 rounded-md object-cover border hover:scale-150 transition-transform cursor-pointer"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg'
                          e.target.onerror = null
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[60vh]">
                      <div className="flex justify-center items-center h-full">
                        <img 
                          src={vendor.NIDImage} 
                          alt="NID Card"
                          className="max-h-[600px] max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg'
                            e.target.onerror = null
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

       
       {!isRejected ? (
          <CommonForm 
            formControls={[
              {
                label: "Update Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "active", label: "Active" },
                  { id: "suspended", label: "Suspended" },
                  { id: "rejected", label: "Reject" }, 
                ],
                defaultValue: vendor.status
              }, 
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={'Update Status'}
            onSubmit={handleUpdateStatus}
          />
        ) : null}
      </div>
    </DialogContent>
  )
}

export default VendorDetailsView