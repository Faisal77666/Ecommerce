import { addToCartAction, removeFromCartAction } from "../reducers/cart";




//add to cart
export const addToCart=(data)=>async(dispatch,getState)=>{
    dispatch(addToCartAction(data))
    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cart))
    return data

} ;


//remove from cart
export const removeFromCart=(data)=>async(dispatch,getState)=>{
  dispatch(removeFromCartAction(data._id))
  localStorage.setItem("cartItems",JSON.stringify(getState().cart.cart))
    return data

}