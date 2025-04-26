import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState ={
    isLoading : false,
    addressList : []
}

export const addNewAddress = createAsyncThunk(
    '/address/addNewAddress', 
    async(formData) => {
        const response = await axios.post(`http://localhost:5000/api/shop/address/add`,
            formData
        );
        return response.data;
    })

export const fetchAllAddress = createAsyncThunk(
    '/address/fetchAllAddress', 
    async(userID) => {
        const response = await axios.get(`http://localhost:5000/api/shop/address/get/${userID}`,

        );
        return response.data;
    })

export const editAddress = createAsyncThunk(
    '/address/editAddress', 
    async({userID, addressID, formData}) => {
        const response = await axios.put(`http://localhost:5000/api/shop/address/update/${userID}/${addressID}`,
            formData
        );
        return response.data;
    })   

export const deleteAddress = createAsyncThunk(
    '/address/deleteAddress', 
    async({userID,addressID}) => {
        const response = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userID}/${addressID}`,
            
        );
        return response.data;
    })

const addressSlice = createSlice ({
    name : 'address',
    initialState,
    reducers :{},
    extraReducers : (builder) =>{
        builder.addCase(addNewAddress.pending,(state) =>{
            state.isLoading = true;
        }).addCase(addNewAddress.fulfilled,(state,action) =>{
            state.isLoading = false;
        }).addCase(addNewAddress.rejected,(state) =>{
            state.isLoading = false;
        }).addCase(fetchAllAddress.pending,(state) =>{
            state.isLoading = true;
        }).addCase(fetchAllAddress.fulfilled,(state,action) =>{
            state.isLoading = false;
            state.addressList = action.payload.data
        }).addCase(fetchAllAddress.rejected,(state) =>{
            state.isLoading = false;
            state.addressList =[]

        })

    }
})
export default addressSlice.reducer