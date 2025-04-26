import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonForm from '@/components/common/form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { loginVendor } from '@/store/vendor-slice/vendorAuth-slice';


const vendorLoginFormControls = [
  {
    name: 'email',
    label: 'Business Email',
    type: 'email',
    placeholder: 'Enter your registered business email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
];

const initialState = {
  email: '',
  password: ''
};

const VendorLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(loginVendor(formData));
      
      if (result?.payload?.success) {
        toast.success('Vendor login successful');
        navigate('/vendor/dashboard'); 
      } else {
        const errorMessage = result?.payload?.message ;
        toast.error(errorMessage, {
          style: { background: 'red', color: 'white' },
        });
      }
    } catch (error) {
      toast.error('An error occurred during login', {
        style: { background: 'red', color: 'white' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground mb-2'>
          Vendor Portal Sign In
        </h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Access your business account to manage products and orders
        </p>
        
        <CommonForm
          formControls={vendorLoginFormControls}
          buttonText={isLoading ? 'Signing In...' : 'Sign In'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isSubmitting={isLoading}
        />
        
        <div className='mt-4 space-y-2'>
          <p className='text-sm'>
            Don't have a vendor account?{' '}
            <Link 
              to='/vendorAuth/register'
              className='font-medium text-primary hover:underline'
            >
              Register your business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;