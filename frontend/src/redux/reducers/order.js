import { createReducer, createAction } from '@reduxjs/toolkit'

// Actions

export const getAllOrderUserRequest = createAction("getAllOrderUserRequest");
export const getAllOrderUserSuccess = createAction("getAllOrderUserSuccess");
export const getAllOrderUserFail = createAction("getAllOrderUserfFail");

export const getAllOrderShopRequest = createAction("getAllOrderShopRequest");
export const getAllOrderShopSuccess = createAction("getAllOrderShopSuccess");
export const getAllOrderShopFail = createAction("getAllOrderShopFail");

export const clearErrors = createAction("clearErrors");


// Initial State
const initialState = {
  isLoading:true,
  
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all orders of a user
    .addCase(getAllOrderUserRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllOrderUserSuccess, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase(getAllOrderUserFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    
   // get all orders of a seller
   .addCase(getAllOrderShopRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllOrderShopSuccess, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase(getAllOrderShopFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })


  //clear errors
    .addCase(clearErrors, (state) => {
      state.error = null;
    })
});
