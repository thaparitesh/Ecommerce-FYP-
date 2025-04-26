import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { loginFormControls } from '../../config'
import { useDispatch } from 'react-redux'
import { loginUser } from '@/store/auth-slice'
import { toast } from 'sonner';

const intialState ={
    userName : '',
    email : '',
    password : '',
}


const AuthLogin = () => {
    const[formData, setFormData] = useState(intialState);
    const dispatch = useDispatch();
    

    function onSubmit(event){
        event.preventDefault();
       
        
        dispatch(loginUser(formData)).then((data) =>{
            if (data?.payload?.success) {
                toast.success(data?.payload?.message); 
            } else {
                toast.error(data?.payload?.message, {
                    style: { background: 'red', color: 'white' },
                }); 
            }  
        })

    }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
        <div className='text-center'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight text-foregroud' >Sign in to your account</h1> 
            </div>
            <CommonForm
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
            <div>
                <p className='mt-2'>Don't have an account
                    <Link 
                        className='font-medium ml-2 text-primary hover:underline' 
                        to='/auth/register'
                    >
                    Register
                 </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default AuthLogin