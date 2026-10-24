const express = require("express");
const router = express.Router();
const Product = require("../model/product.js");
const { uploadToCloudinary , deleteFromCloudinary } = require("../utils/cloudinaryUpload");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const { isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Shop = require("../model/shop.js");
const Order = require("../model/order.js");
const { upload } = require("../multer.js");
const fs = require("fs");

// Create product
// Create product
router.post(
  "/create-product",
  isSeller,
  upload.array("images", 6),
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
        new ErrorHandler("At least one product image is required", 400)
      );
    }

    const uploadedImages = [];

    try {
      // Upload one image at a time so we can track successful uploads
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file,
          "ecommerce/products"
        );

        uploadedImages.push(result);
      }

      const productData = {
        ...req.body,
        images: uploadedImages.map((image) => image.url),
        shopId: shop._id,
        shop,
      };

      const product = await Product.create(productData);

      return res.status(201).json({
        success: true,
        product,
      });

    } catch (error) {
      // Remove uploaded images if upload or database saving fails
      const cleanupResults = await Promise.allSettled(
        uploadedImages.map((image) =>
          deleteFromCloudinary(image.url)
        )
      );

      cleanupResults.forEach((result) => {
        if (result.status === "rejected") {
          console.error(
            "Cloudinary cleanup failed:",
            result.reason
          );
        }
      });

      return next(
        new ErrorHandler(
          "Product creation failed",
          500
        )
      );
    }
  })
);
//get all products
router.get(
  "/get-all-products-shop/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//delete product from shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productData = await Product.findById(productId);
      if (!productData) {
  return next(new ErrorHandler("Product not found", 404));
}

if (String(productData.shopId) !== String(req.seller._id)) {
  return next(new ErrorHandler("Unauthorized", 403));
}
      const results = await Promise.allSettled(
  product.images.map(deleteFromCloudinary)
);

results.forEach((result) => {
  if (result.status === "rejected") {
    console.error("Cloudinary cleanup failed:", result.reason);
  }
});

      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }
      console.log(productData.images);

      res.status(201).json({
        success: true,
        message: "Product Deleted Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//review for a product
router.put(
  "/create-new-review",
  catchAsyncError(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;
      const product = await Product.findById(productId);
      const review = {
        user,
        rating,
        comment,
        productId,
      };
      const isReviewed = product.reviews.find(
        (rev) => rev?.user?._id === req.user?._id
      );
      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev?.user?._id === req?.user?._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;
      await product.save({ validateBeforeSave: false });
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
