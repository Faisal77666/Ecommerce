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

exports.isSeller = catchAsyncError(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(
      new ErrorHandler("Please login to continue", 401)
    );
  }

  const decoded = jwt.verify(
    seller_token,
    process.env.JWT_SECRET_KEY
  );

  const seller = await Shop.findById(decoded.id);

  if (!seller) {
    return next(
      new ErrorHandler("Seller account not found", 401)
    );
  }

  req.seller = seller;
  next();
});
exports.isConversationParticipant = catchAsyncError(
  async (req, res, next) => {
    const { token, seller_token } = req.cookies || {};
    const authenticatedIds = [];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (user) authenticatedIds.push(String(user._id));
      } catch (error) {
        // Invalid customer token; seller token may still be valid.
      }
    }

    if (seller_token) {
      try {
        const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
        const seller = await Shop.findById(decoded.id);
        if (seller) authenticatedIds.push(String(seller._id));
      } catch (error) {
        // Invalid seller token; customer token may still be valid.
      }
    }

    if (authenticatedIds.length === 0) {
      return next(new ErrorHandler("Please login to continue", 401));
    }

    req.authenticatedMessageIds = authenticatedIds;
    next();
  }
);
