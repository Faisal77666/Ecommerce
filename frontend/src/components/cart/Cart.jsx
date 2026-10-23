import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { IoBagHandleOutline } from 'react-icons/io5'
import { HiPlus, HiOutlineMinus } from 'react-icons/hi'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { backend_url } from '../../server'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../../redux/actions/cart'
import { getImageUrl } from "../../utils/getImageUrl";
import { toast } from 'react-toastify'

function Cart({ setOpenCart }) {
  const { cart } = useSelector((state) => state.cart);
  const dispatch= useDispatch()
   const removeFromCartHandler=(data)=>{
    dispatch(removeFromCart(data))
   }
   const quantityChangeHandler=(data)=>{
    dispatch(addToCart(data))
   }
   const totalPrice=cart.reduce((acc,item)=>acc + item.qty * item.discountPrice,0)
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
      {
        cart && cart.length===0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className='cursor-pointer ' onClick={()=>setOpenCart(false)}/>
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ):(
          <>
          {/* ------- TOP SECTION ------- */}
        <div>
          {/* Close Button */}
          <div className="flex w-full justify-end pr-5 pt-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenCart(false)}
            />
          </div>

          {/* Item Count */}
          <div className={`${styles.normalFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {cart.length} Items
            </h5>
          </div>

          {/* Cart Items */}
          <div className="w-full border-t overflow-y-auto" style={{ maxHeight: "70vh" }}>
            {cart && cart.map((item, index) => (
              <CartSingle data={item} key={index} quantityChangeHandler={quantityChangeHandler} removeFromCartHandler={removeFromCartHandler} />
            ))}
          </div>
        </div>

        {/* ------- BOTTOM SECTION ------- */}
        <div className="px-5 py-3 border-t">
          <Link to="/checkout">
            <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px] cursor-pointer hover:bg-[#d03131] transition">
              <h1 className="text-white text-[18px] font-[600]">Checkout Now (US${totalPrice})</h1>
            </div>
          </Link>
        </div>
          </>
        )
      }
      </div>
    </div>
  )
}

const CartSingle = ({ data,quantityChangeHandler,removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty)
  const totalPrice = data.discountPrice * value


  const increment=(data)=>{
    if(value >= data.stock){
      toast.error("Product stock limited!")
      return
    }

    const newQty = value + 1
    setValue(newQty)
    const updateCartData={...data,qty:newQty}
    quantityChangeHandler(updateCartData)
   
  }
  const decrement=(data)=>{
    setValue(value===1 ? 1 :value - 1)
    const updateCartData={...data,qty:value===1 ? 1 :value - 1}
    quantityChangeHandler(updateCartData)
  }

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center gap-3">
        {/* Quantity controls */}
        <div className="flex flex-col items-center">
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.normalFlex} cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="py-[2px]">{data.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>

        {/* Product Image */}
        <img
          src={getImageUrl(data?.images?.[0])}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          alt=""
        />

        {/* Product Info */}
        <div className="flex-1 pl-[5px]">
          <h1 className="text-[15px] font-[500] leading-tight">{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-gray-500">
            ${data.discountPrice} × {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>

        {/* Remove Item */}
        <RxCross1 className="cursor-pointer" onClick={()=>removeFromCartHandler(data)} />
      </div>
    </div>
  )
}

export default Cart
