import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { personalDetailsFormControls, passwordChangeFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Pencil, X } from 'lucide-react'
import { changePassword, updateUserDetails } from '@/store/auth-slice'

const initialUserFormData = {
  userName: '',
  email: '',
  phoneNumber: ''
}

const initialPasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

function PersonalDetails() {
  const [userFormData, setUserFormData] = useState(initialUserFormData)
  const [passwordFormData, setPasswordFormData] = useState(initialPasswordFormData)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  
  useEffect(() => {
    if (user) {
      setUserFormData({
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phoneNumber,

      })
    }
  }, [user])

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault()
    
    if (!userFormData.userName || !userFormData.phoneNumber) {
      toast.error('Please fill all required fields')
      return
    }

    dispatch(updateUserDetails({
      userID: user.id,
      updatedData: userFormData
    })).then((data) => {
      if (data.payload?.success) {
        toast.success('Profile updated successfully')
        setIsEditingProfile(false)
      } else {
        toast.error(data.payload?.message || 'Failed to update profile')
      }
    })
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
  
    dispatch(changePassword({
      userID: user.id,
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

  const getProfileFormControls = () => {
    return personalDetailsFormControls.map(control => ({
      ...control,
      disabled: !isEditingProfile, 
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Personal Information</h3>
              {!isEditingProfile ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingProfile(true)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingProfile(false)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
            
            <CommonForm
              formControls={getProfileFormControls()}
              formData={userFormData}
              setFormData={setUserFormData}
              buttonText="Update Profile"
              onSubmit={handleUserDetailsSubmit}
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

export default PersonalDetails