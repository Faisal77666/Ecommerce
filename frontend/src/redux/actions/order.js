import axios from "axios";
import { server } from "../../server";
import { getAllOrderShopFail, getAllOrderShopRequest, getAllOrderShopSuccess, getAllOrderUserFail, getAllOrderUserRequest, getAllOrderUserSuccess } from "../reducers/order";

//get all orders of a user

export const getAllOrdersOfUser=(userId)=>async(dispatch)=>{
  try {
    dispatch(getAllOrderUserRequest());
    const {data}=await axios.get(`${server}/order/get-all-orders/${userId}`)
    dispatch(getAllOrderUserSuccess(data.orders));
    
  } catch (error) {
     dispatch(
          getAllOrderUserFail(error.response?.data?.message || error.message)
        );
    
  }

}

//get all orders of a seller

export const getAllOrdersOfShop=(shopId)=>async(dispatch)=>{
  try {
    dispatch(getAllOrderShopRequest());
    const {data}=await axios.get(`${server}/order/get-seller-all-orders/${shopId}`)
    dispatch(getAllOrderShopSuccess(data.orders));
    
  } catch (error) {
     dispatch(
          getAllOrderShopFail(error.response?.data?.message || error.message)
        );
    
  }

}