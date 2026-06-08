import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { BsCartPlus } from 'react-icons/bs'
import styles from '../../styles/styles'
import { AiOutlineHeart } from 'react-icons/ai'
import {useSelector,useDispatch} from 'react-redux'
import {removeFromWishlist} from '../../redux/actions/wishlist.js'
import {backend_url} from '../../server.js'
import {addToCart} from '../../redux/actions/cart.js'

function WhishList({ setOpenWhishList }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch= useDispatch()
  const removeFromWishlistHandler=(data)=>{
    dispatch(removeFromWishlist(data))
   }

   const quantityChangeHandler=(data)=>{
    const newData={...data,qty:1}
    dispatch(addToCart(newData))
    setOpenWhishList(false)
   }

  

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        
       {
        wishlist && wishlist.length===0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className='cursor-pointer ' onClick={()=>setOpenWhishList(false)}/>
            </div>
            <h5>Wishlist Items is empty!</h5>
          </div>

        ):
        (
          <>
           {/* ------- TOP SECTION ------- */}
        <div>
          <div className="flex w-full justify-end pr-5 pt-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWhishList(false)}
            />
          </div>

          {/* Item count */}
          <div className={`${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">{wishlist && wishlist.length} items</h5>
          </div>

          {/* Items list */}
          <div className="w-full border-t overflow-y-auto " style={{maxHeight:"70vh"}}>
            {wishlist && wishlist.map((i, index) => (
              <CartSingle data={i} key={index} removeFromWishlistHandler={removeFromWishlistHandler} quantityChangeHandler={quantityChangeHandler} />
            ))}
          </div>
        </div>

          </>
        )
       }
       
      </div>
    </div>
  )
}

const CartSingle = ({ data,removeFromWishlistHandler,quantityChangeHandler }) => {
  const [value, setValue] = useState(1)
  const totalPrice = data.discountPrice * value

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center p-2">
        <RxCross1 className="cursor-pointer" onClick={()=>removeFromWishlistHandler(data)} />
        <img
          src={`${backend_url}${data?.images[0]}`}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          alt=""
        />

        <div className="pl-[5px] flex-1">
          <h1 className="text-[15px] font-[500] leading-tight">{data.name}</h1>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222]">
            US${totalPrice}
          </h4>
        </div>

        <BsCartPlus
          size={20}
          className="cursor-pointer ml-2"
          title="Add to cart"
          onClick={()=>quantityChangeHandler(data)}
        />
      </div>
    </div>
  )
}

export default WhishList
