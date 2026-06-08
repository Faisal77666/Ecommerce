import { createReducer, createAction } from '@reduxjs/toolkit'

// Actions
export const productCreateRequest = createAction("ProductCreateRequest");
export const productCreateSuccess = createAction("ProductCreateSuccess");
export const productCreateFail = createAction("ProductCreateFail");

export const getAllProductsShopRequest = createAction("getAllProductsShopRequest");
export const getAllProductsShopSuccess = createAction("getAllProductsShopSuccess");
export const getAllProductsShopFail = createAction("getAllProductsShopFail");

export const deleteProductRequest = createAction("deleteProductRequest");
export const deleteProductSuccess = createAction("deleteProductSuccess");
export const deleteProductFail = createAction("deleteProductFail");

export const getAllProductsRequest = createAction("getAllProductsRequest");
export const getAllProductsSuccess = createAction("getAllProductsSuccess");
export const getAllProductsFailed = createAction("getAllProductsFailed");

export const clearErrors = createAction("clearErrors");
export const clearProductSuccess = createAction("clearProductSuccess");

// Initial State
const initialState = {
  isLoading: false,
  success: false,
  products: [],     // shop products
  allProducts: [],  // all products from marketplace
  error: null,
  message: null,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(productCreateRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(productCreateSuccess, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.products = [...state.products, action.payload]; // FIXED
    })
    .addCase(productCreateFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // GET SHOP PRODUCTS
    .addCase(getAllProductsShopRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllProductsShopSuccess, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase(getAllProductsShopFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // DELETE PRODUCT
    .addCase(deleteProductRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteProductSuccess, (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    })
    .addCase(deleteProductFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // GET ALL PRODUCTS (HOMEPAGE)
    .addCase(getAllProductsRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllProductsSuccess, (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload; // FIXED
    })
    .addCase(getAllProductsFailed, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;  // FIXED
    })

    .addCase(clearErrors, (state) => {
      state.error = null;
    })
    .addCase(clearProductSuccess, (state) => {
      state.success = false;
    });
});
