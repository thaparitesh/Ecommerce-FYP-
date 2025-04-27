import { useEffect, useState } from 'react'
import './App.css'
import {Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './components/ui/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AdminDashboard from './pages/admin-view/dashboard'
import NotFound from './pages/not-found'
import ShoppingLayout from './components/shopping-view/layout'
import ShoppingListing from './pages/shopping-view/listing'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingHome from './pages/shopping-view/home'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from "@/components/ui/skeleton"
import ProductDetailsPage from './pages/shopping-view/product-details'
import AddProductPage from './pages/admin-view/addProduct'
import OrderSuccess from './pages/shopping-view/paymentSuccess'
import EsewaReturnPage from './pages/shopping-view/esewa-return'
import SearchProducts from './pages/shopping-view/search'
import VendorDashboard from './pages/vendor-view/vendorDashboard'
import VendorLogin from './pages/vendor-view/vendorLogin'
import VendorRegister from './pages/vendor-view/vendorRegister'
import VendorLayout from './components/vendor-view/layout'
import AdminAccount from './pages/admin-view/account'
import ManageVendor from './pages/admin-view/vendorManage'
import { vendorAuthCheck } from './store/vendor-slice/vendorAuth-slice'
import VendorCheckAuth from './components/common/vendor-check-auth'
import VendorProducts from './pages/vendor-view/products'
import AddProductVendorPage from './pages/vendor-view/addProductVendor'
import VendorOrders from './pages/vendor-view/orders'
import VendorAccount from './pages/vendor-view/vendorAccount'
import EsewaFailurePage from './pages/shopping-view/esewa-failed-return'
import EsewaSuccessPage from './pages/shopping-view/esewa-sucess'
import SalesReportPage from './pages/vendor-view/salesReport'
import AdminSalesReport from './pages/admin-view/salesReport'


function App() {

  const {user, isAuthenticated, isLoading} = useSelector(state => state.auth);
  const {vendor, isAuthenticatedVendor, isVendor} = useSelector(state => state.vendorAuth);

  const dispatch = useDispatch();
  console.log('Auth State:', {
    isAuthenticated,
    isAuthenticatedVendor,
    user,
    vendor,isVendor
  });

  useEffect(() =>{
    dispatch(checkAuth());
  },[dispatch])

  useEffect(()=>{
    dispatch(vendorAuthCheck());
  },[dispatch])

  if(isLoading) return <Skeleton className="w-[600px] h-[60px] " />
  ;
 
  
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
        path='/'
        element={
          <CheckAuth isAuthenticated={isAuthenticated} isAuthenticatedVendor={isAuthenticatedVendor} vendor={vendor} user={user}>
          </CheckAuth>
          } 
         />

        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>} >
        
          <Route path="login" element={<AuthLogin/>} />
          <Route path="register" element={<AuthRegister/>} />
        
        </Route>

        <Route path="/vendorAuth" element={
          <CheckAuth isAuthenticatedVendor={isAuthenticatedVendor} vendor={vendor}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<VendorLogin />} />
          <Route path="register" element={<VendorRegister />} />
        </Route>

        <Route path="/vendor" element={
          <VendorCheckAuth
          isAuthenticatedVendor={isAuthenticatedVendor} 
          vendor={vendor}>
            <VendorLayout />
          </VendorCheckAuth>
          }>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts/>}/>
          <Route path="products/add" element={<AddProductVendorPage/>}/>
          <Route path="products/edit/:id" element={<AddProductVendorPage/>}/>
          <Route path="orders" element={<VendorOrders/>}/>
          <Route path="account" element={<VendorAccount/>}/>
          <Route path="sales-report" element={<SalesReportPage/>}/>


        </Route>

        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
           <AdminLayout/>
          </CheckAuth>}>
          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="products/add" element={<AddProductPage/>}/>
          <Route path="products/edit/:id" element={<AddProductPage/>}/>
          <Route path="account" element={<AdminAccount/>}/>
          <Route path="vendors" element={<ManageVendor/>}/>
          <Route path="sales-report" element={<AdminSalesReport/>}/>



        </Route>
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}
          isAuthenticatedVendor={isAuthenticatedVendor} 
          vendor={vendor}>
            <ShoppingLayout/>
          </CheckAuth>}>
          <Route path="home" element={<ShoppingHome/>}/>
          <Route path="listing" element={<ShoppingListing/>}/>
          <Route path="listing/:productId" element={<ProductDetailsPage />} />
          <Route path="account" element={<ShoppingAccount/>}/>
          <Route path="checkout" element={<ShoppingCheckout/>}/>
          <Route path="payment/esewa-return" element={<EsewaReturnPage/>}/>
          <Route path="payment/esewa-success" element={<EsewaSuccessPage/>}/>

          <Route path="payment/esewa-failed" element={<EsewaFailurePage/>}/>
          <Route path="order/success" element={<OrderSuccess/>}/>
          <Route path="search" element={<SearchProducts/>}/>



        </Route>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/unauth-page" element={<UnauthPage/>}/>
      </Routes>
    </div>
  )
}

export default App;