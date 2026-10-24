const express=require('express')
const router=express.Router()
const catchAsyncError = require("../middleware/catchAsyncError")
const {isSeller}=require('../middleware/auth')
const { upload } = require("../multer")
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");
const ErrorHandler = require("../utils/ErrorHandler")
const Shop = require('../model/shop')
const Event = require('../model/event')
const fs=require('fs')





//create event
// Create event
router.post(
  "/create-event",
  isSeller,
  upload.array("images", 10),
  catchAsyncError(async (req, res, next) => {
    const shopId = req.body.shopId;

    if (String(shopId) !== String(req.seller._id)) {
      return next(new ErrorHandler("Unauthorized shop", 403));
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    if (!req.files?.length) {
      return next(
        new ErrorHandler("At least one event image is required", 400)
      );
    }

    const uploadedImages = [];

    try {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file,
          "ecommerce/events"
        );

        uploadedImages.push(result);
      }

      const eventData = {
        ...req.body,
        images: uploadedImages.map((image) => image.url),
        shopId: shop._id.toString(),
        shop,
      };

      const event = await Event.create(eventData);

      return res.status(201).json({
        success: true,
        product: event,
      });
    } catch (error) {
      const cleanupResults = await Promise.allSettled(
        uploadedImages.map((image) =>
          deleteFromCloudinary(image.url)
        )
      );

      cleanupResults.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Cloudinary cleanup failed:", result.reason);
        }
      });

      console.error("Event creation failed:", error);

      return next(
        new ErrorHandler("Event creation failed", 500)
      );
    }
  })
);

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
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Verify the seller owns this event
    if (String(event.shopId) !== String(req.seller._id)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    await Event.findByIdAndDelete(event._id);

    const results = await Promise.allSettled(
      event.images.map(deleteFromCloudinary)
    );

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Cloudinary cleanup failed:", result.reason);
      }
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  })
);



module.exports=router
