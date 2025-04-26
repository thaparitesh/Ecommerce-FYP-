import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function AddressCard({addressInfo,handleDeleteAddress,handleEditAddress,setCurrentSelectedAddress,selectedID}) {

 
  return (
    <Card 
      onClick={setCurrentSelectedAddress? ()=> 
        setCurrentSelectedAddress(addressInfo)
        :null
        }
        className={`cursor-pointer
          ${
            selectedID?.addressID === addressInfo.addressID ?
            'border-black border-[2px]' : null
          }`
          }
        >
        <CardContent className={`${selectedID === addressInfo?.addressID ? 'border-black' : ""}grid p-4 gap-4`}>
            <Label>Address: {addressInfo?.address} </Label>
            <Label>City: {addressInfo?.city} </Label>
            <Label>Phone Number: {addressInfo?.phoneNumber} </Label>
            <Label>Notes: {addressInfo?.notes} </Label>
        </CardContent>
        <CardFooter className='p-3 flex justify-between'>
          <Button
          onClick={()=> handleEditAddress(addressInfo)}
          >Edit</Button>
          <Button
          onClick={()=> handleDeleteAddress(addressInfo)}
          >Delete</Button>
        </CardFooter>
      
    </Card>
  )
}
 
export default AddressCard
