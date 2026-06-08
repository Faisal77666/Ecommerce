const ErrorHandler=require("../utils/ErrorHandler.js")
const catchAsyncError=require("./catchAsyncError.js")
const jwt =require("jsonwebtoken")
const User=require('../model/user')
const Shop = require("../model/shop.js")

exports.isAuthenticated=catchAsyncError(async(req,res,next)=>{
  const {token}=req.cookies
  if(!token){
    return next(new ErrorHandler("Please login to continue to this page",401))
  }
  const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
  req.user=await User.findById(decode.id)
  next()
})

exports.isSeller=catchAsyncError(async(req,res,next)=>{
  const {seller_token}=req.cookies
  if(!seller_token){
    return next(new ErrorHandler("Please login to continue to this page",401))
  }
  const decode=jwt.verify(seller_token,process.env.JWT_SECRET_KEY)
  req.seller=await Shop.findById(decode.id)
  next()
})