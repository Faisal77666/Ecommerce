const express=require('express')
const router=express.Router()
const catchAsyncError = require("../middleware/catchAsyncError")
const {isSeller}=require('../middleware/auth')
const { upload } = require("../multer")
const ErrorHandler = require("../utils/ErrorHandler")
const Shop = require('../model/shop')
const Event = require('../model/event')
const fs=require('fs')





//create event
router.post('/create-event',upload.array("images"),catchAsyncError(async(req,res,next)=>{
  try {
    const shopId=req.body.shopId
    const shop=await Shop.findById(shopId)
    if(!shop){
      files.forEach(file => fs.unlink(`uploads/${file.filename}`, () => {}));
      return next(new ErrorHandler("Shop Id is invalid!",400))
    }
    else{
      const files=req.files
      const imageUrls=files.map((file)=>`${file.filename}`)
      const eventData=req.body
      eventData.images=imageUrls
      eventData.shop=shop
      const product=await Event.create(eventData)
      res.status(201).json({
        success:true,
        product,
      })
    }
  } catch (error) {
    return next(new ErrorHandler(error,400))
  }
}))

//get all events
router.get('/get-all-events',async(req,res,next)=>{
  try {
    const events=await Event.find()
    res.status(201).json({
      success:true,
      events
    })
  } catch (error) {
    return next(new ErrorHandler(error,400))
  }

})

//get all events of a shop
router.get('/get-all-events/:id',catchAsyncError(async (req,res,next) => {
  try {
    const events=await Event.find({shopId:req.params.id})

    res.status(201).json({
      success:true,
      events
    })
  } catch (error) {
    return next(new ErrorHandler(error,400))
  }
}))


//delete product from shop
router.delete('/delete-shop-event/:id',isSeller,catchAsyncError(async (req,res,next) => {
  try {
    const eventId=req.params.id
   const eventData=await Event.findById(eventId)
       eventData.images.forEach((imageUrl)=>{
         const filename=imageUrl
         const filePath=`uploads/${filename}`
         fs.unlink(filePath,(error)=>{
           if(error){
             console.log(error);
             
           }
         })
       })

    const event=await Event.findByIdAndDelete(eventId)
    if(!event){
      return next(new ErrorHandler("Event not found with this id!",500))
    }
     
         
    res.status(201).json({
      success:true,
      message:"Event Deleted Successfully!"
    })
  } catch (error) {
     return next(new ErrorHandler(error,400))
    
  }
  
}))




module.exports=router