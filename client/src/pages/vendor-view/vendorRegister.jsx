import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { registerVendor } from '@/store/vendor-slice/vendorAuth-slice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/vendor-view/image-upload';

const initialState = {
  ownerName: '',
  businessName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  panIDImage: '',
  NIDImage: '',
};

const VendorRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [panUploadedImageUrl, setPanUploadedImageUrl] = useState('');
  const [panImageLoadingState, setPanImageLoadingState] = useState(false);
  const [nidUploadedImageUrl, setNidUploadedImageUrl] = useState('');
  const [nidImageLoadingState, setNidImageLoadingState] = useState(false);
  const [formErrors, setFormErrors] = useState({ 
    panIDImage: false,
    NIDImage: false 
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const validateForm = () => {
    const errors = {
      panIDImage: !panUploadedImageUrl,
      NIDImage: !nidUploadedImageUrl
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Both PAN ID and NID images are required for verification');
      return;
    }

    const finalFormData = {
      ...formData,
      panIDImage: panUploadedImageUrl,
      NIDImage: nidUploadedImageUrl
    };

    dispatch(registerVendor(finalFormData)).then((data) => {
      if (data?.payload?.success) {
        toast.success('Vendor registration submitted for approval');
        setFormData(initialState);
        setPanUploadedImageUrl('');
        setNidUploadedImageUrl('');
        navigate('/vendorAuth/login');
      } else {
        toast.error(data?.payload?.message || 'Registration failed');
      }
    });
  };


  const formControls = [
    {
      name: 'ownerName',
      label: 'Owner Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      componentType: 'input'
    },
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'text',
      placeholder: 'Enter business name',
      required: true,
      componentType: 'input'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter business email',
      required: true,
      componentType: 'input'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter contact number',
      required: true,
      componentType: 'input'
    },
    {
      name: 'address',
      label: 'Business Address',
      type: 'text',
      placeholder: 'Enter full address',
      required: true,
      componentType: 'input'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create password',
      required: true,
      componentType: 'input'
    }
  ]

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Register Your Business
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete registration to start selling on our platform
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          {formControls.map((control) => (
            <div key={control.name} className="grid w-full gap-1.5">
              <Label className="mb-1">{control.label}</Label>
              <Input
                id={control.name}
                name={control.name}
                type={control.type}
                required={control.required}
                placeholder={control.placeholder}
                value={formData[control.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [control.name]: e.target.value })
                }
              />
            </div>
          ))}

          {/* PAN ID Image Upload */}
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">PAN ID Card</Label>
            <ImageUpload
              onUploadComplete={setPanUploadedImageUrl}
              onLoadingChange={setPanImageLoadingState}
              id="pan-upload"
              initialImage={panUploadedImageUrl}
            />
            {formErrors.panIDImage && (
              <p className="text-sm text-red-500 mt-1">PAN ID image is required</p>
            )}
          </div>

          {/* NID Image Upload */}
          <div className="grid w-full gap-1.5">
            <Label className="mb-1">NID Card</Label>
            <ImageUpload
              onUploadComplete={setNidUploadedImageUrl}
              onLoadingChange={setNidImageLoadingState}
              id="nid-upload"
              initialImage={nidUploadedImageUrl}
            />
            {formErrors.NIDImage && (
              <p className="text-sm text-red-500 mt-1">NID image is required</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={panImageLoadingState || nidImageLoadingState}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {panImageLoadingState || nidImageLoadingState ? 'Uploading...' : 'Register Business'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have a vendor account?{' '}
        <Link
          to="/vendorAuth/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default VendorRegister