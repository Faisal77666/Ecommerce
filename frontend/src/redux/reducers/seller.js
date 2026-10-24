import { createReducer,createAction } from '@reduxjs/toolkit'

export const LoadSellerRequest = createAction("LoadSellerRequest");
export const LoadSellerSuccess = createAction("LoadSellerSuccess");
export const LoadSellerFail = createAction("LoadSellerFail");
export const clearErrors = createAction("clearErrors");
export const LogoutSeller = createAction("LogoutSeller");


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
      state.seller=null;
      
    })
    .addCase(LogoutSeller, (state) => {
      state.isLoading = false;
      state.isSeller = false;
      state.seller = null;
      state.error = null;
    })
    .addCase(
    clearErrors,(state)=>{
      state.error=null;
    })
  })
