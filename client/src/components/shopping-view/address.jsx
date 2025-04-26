import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form';
import { addressFormControls } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from '@/store/shop/address-slice';
import { toast } from 'sonner';
import AddressCard from './address-card';


const initialFormData = {
    address : '',
    city : '',
    phoneNumber : '',
    notes : '',
}
function Address({setCurrentSelectedAddress, selectedID}) {

    const [formData, setFormData] = useState(initialFormData);
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth)
    const {addressList} = useSelector(state => state.shopAddress)
    const [currentEditedId,setCurrentEditedId] = useState(null)
    function handleManageAddress(e){
        e.preventDefault()
        if (addressList.length>=5 && currentEditedId === null) {
            toast.error('You can add only 5 addresses',{
                style: { background: 'red', color: 'white' }, 
            }); 
            setFormData(initialFormData)
            return;
        }
        currentEditedId !== null?
        dispatch(editAddress({
            userID : user?.id,
            addressID : currentEditedId,
            formData
        })).then((data)=>{
            if(data.payload.success){
                dispatch(fetchAllAddress(user?.id))
                setCurrentEditedId(null)
                setFormData(initialFormData)
                toast.success('Address edited successfully')
            }})   
        :
        dispatch(addNewAddress({
            ...formData,
            userID : user?.id
        })).then((data)=> {
            console.log(data);
            if (data?.payload?.success){
                toast.success('Address added successfully')
                dispatch(fetchAllAddress(user?.id))
                setFormData(initialFormData)
            }
        
        })
    }
    
    function isFormValid(){
        return (
            formData.address.trim() !== '' &&
            formData.city.trim() !== '' &&
            formData.phoneNumber.trim() !== '' && 
            true
          );   
    }

    function handleDeleteAddress(getAddressInfo){
        dispatch(deleteAddress({
            userID : user?.id,
            addressID : getAddressInfo.addressID,

        })).then((data)=>{
            if(data.payload.success){
                dispatch(fetchAllAddress(user?.id))
                toast.success('Address deleted successfully')
            }
        })
    }
    function handleEditAddress(getAddressInfo){
        setCurrentEditedId(getAddressInfo.addressID)
        setFormData({
            ...formData,
            address : getAddressInfo.address,
            city : getAddressInfo.city,
            phoneNumber : getAddressInfo.phoneNumber,
            notes : getAddressInfo.notes,
        })
        
    }

    useEffect(()=>{
        dispatch(fetchAllAddress(user?.id))
    },[dispatch])

    
    return (
    <Card>
        <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2'>
           {
            addressList && addressList.length > 0 ?
            addressList.map(singleAddressItem => 
                <AddressCard 
                    selectedID={selectedID}
                    handleDeleteAddress={handleDeleteAddress}
                    addressInfo={singleAddressItem}
                    handleEditAddress={handleEditAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                    />

            ) : null
           }
        </div>
        <CardHeader>
            <CardTitle>
                {
                    currentEditedId !== null ?
                    'Edit Address' : 'Add New Address'
                }
            </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
            <CommonForm 
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={
                currentEditedId !== null ?
                'Edit' : 'Add'
            }
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
            />

        </CardContent>
    </Card>
  )
}

export default Address
