import Address from '@/components/shopping-view/address'
import ShoppingOrders from '@/components/shopping-view/orders'
import PersonalDetails from '@/components/shopping-view/personaldetails'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

function ShoppingAccount() {
  return (
    <div className='flex flex-col'>
     
     <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
      <div className='flex flex-col rounded-lg border bg-background p-6 shadow-sm'>
        <Tabs defaultValue='orders'>
          <TabsList>
            <TabsTrigger value='orders'>Orders</TabsTrigger>
            <TabsTrigger value='userInfo'>Account Information</TabsTrigger>
            <TabsTrigger value='address'>Address</TabsTrigger>
          </TabsList>
          <TabsContent value='orders'>
            <ShoppingOrders/>
          </TabsContent>
          <TabsContent value='userInfo'>
            <PersonalDetails/>
          </TabsContent>
          <TabsContent value='address'>
            <Address/>
          </TabsContent>

        </Tabs>
      </div>

     </div>
    </div>
  )
}

export default ShoppingAccount
