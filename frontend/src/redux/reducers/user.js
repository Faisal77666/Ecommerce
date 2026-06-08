import { createReducer,createAction } from '@reduxjs/toolkit'

export const LoadUserRequest = createAction("LoadUserRequest");
export const LoadUserSuccess = createAction("LoadUserSuccess");
export const LoadUserFail = createAction("LoadUserFail");
export const updateUserInfoRequest = createAction("updateUserInfoRequest");
export const updateUserInfoSuccess = createAction("updateUserInfoSuccess");
export const updateUserInfoFail = createAction("updateUserInfoFail");
export const updateUserAddressRequest = createAction("updateUserAddressRequest");
export const updateUserAddressSuccess = createAction("updateUserAddressSuccess");
export const updateUserAddressFail = createAction("updateUserAddressFail");
export const deleteUserAddressRequest = createAction("deleteUserAddressRequest");
export const deleteUserAddressSuccess = createAction("deleteUserAddressSuccess");
export const deleteUserAddressFail = createAction("deleteUserAddressFail");

export const clearErrors = createAction("clearErrors");
export const clearMessages=createAction("clearMessages")


const initialState = {
  isAuthenticated: false,
}

export const userReducer = createReducer(initialState,(builder)=>{
  builder.addCase(
  LoadUserRequest, (state) => {
      state.loading=true;
    })
    .addCase(
    LoadUserSuccess, (state,action) => {
      state.isAuthenticated=true;
      state.loading =false;
      state.user=action.payload;
      
    })
    .addCase(
     LoadUserFail, (state,action) => {
      state.loading =false;
      state.error=action.payload;
      state.isAuthenticated=false;
      
    })
    //update user information
    .addCase(updateUserInfoRequest,(state)=>{
      state.loading=true;
    })
    .addCase(updateUserInfoSuccess,(state,action)=>{
      state.loading =false;
      state.user=action.payload;

    })
    .addCase(updateUserInfoFail,(state,action)=>{
      state.loading =false;
      state.error=action.payload;

    })

    //update user address
    .addCase(updateUserAddressRequest,(state)=>{
      state.addressloading=true;
    })
    .addCase(updateUserAddressSuccess,(state,action)=>{
      state.addressloading =false;
      state.successMessage=action.payload.successMessage
      state.user=action.payload.user;

    })
    .addCase(updateUserAddressFail,(state,action)=>{
      state.addressloading =false;
      state.error=action.payload;

    })
    //delete user address
    .addCase(deleteUserAddressRequest,(state)=>{
      state.addressloading=true;

    })
    .addCase(deleteUserAddressSuccess,(state,action)=>{
      state.addressloading=false;
      state.successMessage=action.payload.successMessage
       state.user=action.payload.user;

    })
    .addCase(deleteUserAddressFail,(state,action)=>{
      state.addressloading=false;
       state.error=action.payload;

    })
    .addCase(
    clearErrors,(state)=>{
      state.error=null;
    }).addCase(clearMessages,(state)=>{
      state.successMessage=null
    })
  })
