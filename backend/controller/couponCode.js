const express=require('express')
const router=express.Router()
const catchAsyncError = require("../middleware/catchAsyncError")
const {isSeller}=require('../middleware/auth')
const ErrorHandler = require("../utils/ErrorHandler")
const Shop = require('../model/shop')
const CouponCode = require('../model/couponCode')

router.post('/create-coupon-code',isSeller,catchAsyncError(async (req,res,next) => {
  try {
    const isCouponCodeExist=await CouponCode.find({name:req.body.name})
    if(isCouponCodeExist.length !==0){
      return next(new ErrorHandler("Coupon code already exists!",400))
    }
  
    
    const couponCode=await CouponCode.create(req.body)
    res.status(201).json({
      success:true,
      couponCode
    })
  } catch (error) {
    return next(new ErrorHandler(error,400))
    
  }
  
}))

//get all coupons of a shop
router.get('/get-coupon/:id',catchAsyncError(async(req,res,next)=>{
  try {
    const couponCodes = await CouponCode.find({ shop: req.params.id });

    res.status(201).json({
      success:true,
      couponCodes
    })
    
  } catch (error) {
    return next(new ErrorHandler(error,400))
  }

}))


//delete coupon Code from shop
router.delete('/delete-coupon/:id',isSeller,catchAsyncError(async (req,res,next) => {
  try {
    const couponId=req.params.id
    const coupon=await CouponCode.findByIdAndDelete(couponId)
    if(!coupon){
      return next(new ErrorHandler("Coupon not found with this id!",500))
    }
    
    res.status(201).json({
      success:true,
      message:"Coupon Deleted Successfully!"
    })
  } catch (error) {
     return next(new ErrorHandler(error,400))
    
  }
  
}))

//get coupon code value by its name 

router.get("/get-coupon-value/:name",catchAsyncError(async(req,res,next)=>{
  try {
    const couponCode=await CouponCode.findOne({name:req.params.name})
    res.status(200).json({
      success:true,
      couponCode
    })
    
  } catch (error) {
    return next(new ErrorHandler(error,400))
    
  }
}))





module.exports=router