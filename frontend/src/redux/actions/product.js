import axios from "axios";
import { server } from "../../server";
import {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  getAllProductsShopRequest,
  getAllProductsShopFail,
  getAllProductsShopSuccess,
  deleteProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  getAllProductsRequest,
  getAllProductsSuccess,
  getAllProductsFailed
} from "../reducers/product";

// CREATE PRODUCT
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch(productCreateRequest());

    const config = {
  withCredentials: true,
};

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config
    );

    // FIXED (backend returns "product", not "products")
    dispatch(productCreateSuccess(data.product));

  } catch (error) {
    dispatch(
      productCreateFail(error.response?.data?.message || error.message)
    );
  }
};

// GET SHOP PRODUCTS
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );

    dispatch(getAllProductsShopSuccess(data.products));

  } catch (error) {
    dispatch(
      getAllProductsShopFail(error.response?.data?.message || error.message)
    );
  }
};

// DELETE PRODUCT
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      { withCredentials: true }
    );

    dispatch(deleteProductSuccess(data.message));

  } catch (error) {
    dispatch(
      deleteProductFail(error.response?.data?.message || error.message)
    );
  }
};

// GET ALL PRODUCTS (HOMEPAGE)
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());

    const { data } = await axios.get(`${server}/product/get-all-products`);

    dispatch(getAllProductsSuccess(data.products));

  } catch (error) {
    dispatch(
      getAllProductsFailed(error.response?.data?.message || error.message)
    );
  }
};
