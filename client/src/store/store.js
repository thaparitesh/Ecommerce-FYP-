import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import  adminProductSlice from './admin/product-slice'
import  shopProductSlice from './shop/product-slice'
import  shopCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from "./shop/order-slice";
import adminOrderSlice from "./admin/order-slice"
import shopSearchSlice from "./shop/search-slice"
import shopReviewSlice from "./shop/review-slice"
import commonFeatureSlice from "./common-slice"
import vendorAuthReducer from './vendor-slice/vendorAuth-slice';
import vendorApprovalSlice from './admin/approveVendor-slice';
import vendorProductSlice from './vendor-slice/product-slice';
import vendorOrderSlice from "./vendor-slice/order-slice"



const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts : adminProductSlice,
    shopProducts : shopProductSlice,
    shopCart : shopCartSlice,
    shopAddress : shopAddressSlice,
    shopOrder : shopOrderSlice,
    adminOrder : adminOrderSlice,
    shopSearch : shopSearchSlice,
    shopReview : shopReviewSlice,
    commonFeature : commonFeatureSlice,
    vendorAuth : vendorAuthReducer,
    adminApproval : vendorApprovalSlice,
    vendorProducts : vendorProductSlice,
    vendorOrder : vendorOrderSlice,



  },
});

export default store;



