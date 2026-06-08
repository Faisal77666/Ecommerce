import { addToWishlistAction,removeFromWishlistAction } from "../reducers/wishlist";




//add to wishlist
export const addToWishlist=(data)=>async(dispatch,getState)=>{
    dispatch(addToWishlistAction(data))
    localStorage.setItem("wishlistItems",JSON.stringify(getState().wishlist.wishlist))
    return data

} ;


//remove from wishlist
export const removeFromWishlist=(data)=>async(dispatch,getState)=>{
  dispatch(removeFromWishlistAction(data._id))
  localStorage.setItem("wishlistItems",JSON.stringify(getState().wishlist.wishlist))
    return data

}