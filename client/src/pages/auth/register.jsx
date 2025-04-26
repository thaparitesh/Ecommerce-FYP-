import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { registerFormControls } from '../../config'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'
import { toast } from 'sonner';


const intialState ={
    userName : '',
    email : '',
    password : '',
    
}

const AuthRegister = () => {

    const[formData, setFormData] = useState(intialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    function onSubmit(event){
        event.preventDefault()
        dispatch(registerUser(formData)).then((data)=> {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message); 
                navigate('/auth/login');
            } else {
                toast.error(data?.payload?.message, {
                    style: { background: 'red', color: 'white' }, 
                }); 
            }
            
        });

    }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
        <div className='text-center'>
            <h1 className='text-3xl font-bold tracking-tight text-foregroud' >Create new account</h1>
            
        </div>
        <CommonForm
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        />
        <div>
            <p className='mt-2'>Already have an account
                <Link 
                    className='font-medium ml-2 text-primary hover:underline' 
                    to='/auth/login'
                >
                    Login
                </Link>
                </p>
        </div>
    </div>
  )
}

export default AuthRegister