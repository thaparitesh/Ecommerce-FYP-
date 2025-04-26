import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { passwordChangeFormControls, vendorDetailsFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Pencil, X } from 'lucide-react'
import { changeVendorPassword } from '@/store/vendor-slice/vendorAuth-slice'

// Define form controls for vendor details


const initialPasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

function VendorPersonalDetails() {
  const [vendorFormData, setVendorFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [passwordFormData, setPasswordFormData] = useState(initialPasswordFormData)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const dispatch = useDispatch()
  const { vendor } = useSelector(state => state.vendorAuth)

  useEffect(() => {
    if (vendor) {
      setVendorFormData({
        businessName: vendor.businessName || '',
        ownerName: vendor.ownerName || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || ''
      })
    }
  }, [vendor])

  const handleVendorDetailsSubmit = (e) => {
    e.preventDefault()
    // Add your update vendor details logic here
    toast.success('Profile updated successfully')
    setIsEditingProfile(false)
  }

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault()
  
    if (!passwordFormData.currentPassword || 
        !passwordFormData.newPassword || 
        !passwordFormData.confirmPassword) {
      toast.error('Please fill all password fields', {
        style: { background: 'red', color: 'white' }, 
      })
      return
    }
  
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error('New passwords do not match', {
        style: { background: 'red', color: 'white' }, 
      })
      return
    }
    
    if (!/^[A-Za-z0-9]{6,}$/.test(passwordFormData.newPassword)) {
      toast.error('Password must at least 6 characters', {
        style: { background: 'red', color: 'white' }, 
      });
      return;
    }
    if (vendor?.id){
      dispatch(changeVendorPassword({
        vendorID: vendor?.id,
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword
      })).then((data) => {
        if (data.payload?.success) {
          toast.success('Password changed successfully')
          setPasswordFormData(initialPasswordFormData)
          setShowPasswordForm(false)
        } else {
           toast.error(data.payload?.message || 'Failed to change password',{
            style: { background: 'red', color: 'white' }, 
            })
        }
      })

    }
    
  }

  const getVendorFormControls = () => {
    return vendorDetailsFormControls.map(control => ({
      ...control,
      disabled: !isEditingProfile || control.disabled, 
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Business Information Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Business Information</h3>
            </div>
            
            <CommonForm
              formControls={getVendorFormControls()}
              formData={vendorFormData}
              setFormData={setVendorFormData}
              buttonText="Update Profile"
              onSubmit={handleVendorDetailsSubmit}
              hideButton={!isEditingProfile} 
            />
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="text-sm font-medium underline hover:text-primary transition-colors"
              >
                Change Password
              </button>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordFormData(initialPasswordFormData)
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
                <CommonForm
                  formControls={passwordChangeFormControls}
                  formData={passwordFormData}
                  setFormData={setPasswordFormData}
                  buttonText="Change Password"
                  onSubmit={handlePasswordChangeSubmit}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VendorPersonalDetails