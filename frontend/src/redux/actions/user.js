import axios from "axios";
import { server } from "../../server";



export const LoadUser=()=>async(dispatch)=>{

try {
  dispatch({
    type:"LoadUserRequest",

  });
  const {data}=await axios.get(`${server}/user/getuser`,{withCredentials:true})
  dispatch({
    type:"LoadUserSuccess",
    payload:data.user

  });
  
} catch (error) {
  dispatch({
    type:"LoadUserFail",
   payload: error.response?.data?.message || error.message,

  });
  
}
}

export const LoadSeller=()=>async(dispatch)=>{

try {
  dispatch({
    type:"LoadSellerRequest",

  });
  const {data}=await axios.get(`${server}/shop/getSeller`,{withCredentials:true})
  dispatch({
    type:"LoadSellerSuccess",
    payload:data.seller

  });
  
} catch (error) {
  dispatch({
    type:"LoadSellerFail",
   payload: error.response?.data?.message || error.message,

  });
  
}
}


//user update information
export const updateUserInformation=(name,email,phoneNumber,password)=>async(dispatch,action)=>{
  
    try {
      dispatch({
      type:"updateUserInfoRequest"
    })
    const {data}=await axios.put(`${server}/user/update-user-info`,{
      name, email, phoneNumber, password
      
    },{
      withCredentials:true
    }
  )
  dispatch({
    type:"updateUserInfoSuccess",
    payload:data.user
  })

      
    } catch (error) {
      dispatch({
    type:"updateUserInfoFail",
   payload: error.response?.data?.message || error.message,

  });
      
    }
}

//update user address
export const updateUserAddress=(country,city,address1,address2,zipCode,addressType)=>async(dispatch)=>{
  try {
    dispatch({
      type:"updateUserAddressRequest"
    })
   const {data}= await axios.put(`${server}/user/update-user-addresses`,{
    country,
    city,
    address1,
    address2,
    zipCode,
    addressType,
   },{withCredentials:true})
   dispatch({
    type:"updateUserAddressSuccess",
    payload:{
      successMessage:"User address updated successfully!",
      user:data.user
    }
   })
    
  } catch (error) {
    dispatch({
    type:"updateUserAddressFail",
   payload: error.response?.data?.message || error.message,

  });
  }
}
//delete user address
export const deleteUserAddress=(id)=>async(dispatch)=>{
  try {
    dispatch({
      type:"deleteUserAddressRequest"
    })
    const {data}=await axios.delete(`${server}/user/delete-user-address/${id}`,{
      withCredentials:true
    })
    dispatch({
      type:"deleteUserAddressSuccess",
       payload:{
        successMessage:"Address deleted successfully!",
        user:data.user,
       }
    })
  } catch (error) {
    dispatch({
    type:"deleteUserAddressFail",
   payload: error.response?.data?.message || error.message,

  });
    
  }
}