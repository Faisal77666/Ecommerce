import { createReducer,createAction } from '@reduxjs/toolkit'

export const LoadSellerRequest = createAction("LoadSellerRequest");
export const LoadSellerSuccess = createAction("LoadSellerSuccess");
export const LoadSellerFail = createAction("LoadSellerFail");
export const clearErrors = createAction("clearErrors");


const initialState = {
  isLoading: true,
}

export const sellerReducer = createReducer(initialState,(builder)=>{
  builder.addCase(
  LoadSellerRequest, (state) => {
      state.isLoading=true;
    })
    .addCase(
    LoadSellerSuccess, (state,action) => {
      state.isSeller=true;
      state.isLoading =false;
      state.seller=action.payload;
      
    })
    .addCase(
     LoadSellerFail, (state,action) => {
      state.isLoading =false;
      state.error=action.payload;
      state.isSeller=false;
      
    })
    .addCase(
    clearErrors,(state)=>{
      state.error=null;
    })
  })
