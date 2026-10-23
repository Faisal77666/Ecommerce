import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadSeller } from "../../redux/actions/user";
import { getImageUrl } from "../../utils/getImageUrl";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar,setAvatar] = useState();
  const [name,setName] = useState(seller && seller?.name);
  const [description,setDescription] = useState(seller && seller?.description ? seller?.description : "");
  const [address,setAddress] = useState(seller && seller?.address);
  const [phoneNumber,setPhoneNumber] = useState(seller && seller?.phoneNumber);
  const [zipCode,setZipCode] = useState(seller && seller?.zipCode);
  const dispatch = useDispatch();
  console.log(seller);

  const handleImage = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file=e.target.files[0]
    setAvatar(file)
    const formData=new FormData()
    formData.append("image",e.target.files[0])
    await axios.put(`${server}/shop/update-shop-avatar`,formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      },
      withCredentials:true
    }).then((res)=>{
      dispatch(LoadSeller())
      toast.success("Avatar updated successfully!")
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  }
    
  const updateHandler = async (e) => {
    e.preventDefault();
    await axios.put(`${server}/shop/update-seller-info`,{
      name,
      description,
      address,
      phoneNumber,
      zipCode
    },{
      withCredentials:true
    
  }).then((res)=>{
      
      dispatch(LoadSeller())
      toast.success("Shop info updated successfully!")
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? URL.createObjectURL(avatar) : getImageUrl(seller?.avatar)}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#e3e9ee] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px] ">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/*shop info */}
        <form
          aria-aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <div className="w-full">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.name}`}
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <div className="w-full">
              <label className="block pb-2">Shop Description</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.description ? seller?.description : "Enter your shop description"}`}
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <div className="w-full">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.address ? seller?.address : "Enter your shop addres"}`}
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
              className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <div className="w-full">
              <label className="block pb-2">Shop Phone Number</label>
            </div>
            <input
              type="number"
              placeholder={`${seller?.phoneNumber}`}
              value={phoneNumber}
              onChange={(e)=>setPhoneNumber(e.target.value)}
              className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <div className="w-full">
              <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="number"
              placeholder={`${seller?.zipCode}`}
              value={zipCode}
              onChange={(e)=>setZipCode(e.target.value)}
              className={`${styles.input} w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-5 flex flex-col items-center ">
            <button
  type="button"
  onClick={updateHandler}
  className={`${styles.input} w-[95%] mb-4`}
>
  Update Shop
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
