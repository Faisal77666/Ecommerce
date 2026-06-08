import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux";



const SellerProtectedRoute=({isSeller,children})=>{
  if(!isSeller){
    return <Navigate to={`/shop-login`} replace />

  }

  return children
}

export default SellerProtectedRoute