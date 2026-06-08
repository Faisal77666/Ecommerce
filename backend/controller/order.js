const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");

//create new order
router.post(
  "/create-order",
  catchAsyncError(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //group cart items by shopId
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }
      //create an order for each shop

      const orders = [];
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      res.status(201).json({
        succes: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }),
);

//get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);
// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id!", 400));
      }

      // Update inventory only once: on the first transition out of Processing.
      const shouldUpdateInventory =
        order.status === "Processing" && req.body.status !== "Processing";

      if (shouldUpdateInventory) {
        for (const item of order.cart) {
          await updateOrder(item._id, item.qty);
        }
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
      }
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        if (!product) {
          throw new Error(`Product not found with id: ${id}`);
        }

        const quantity = Number(qty) || 0;
        if (quantity <= 0) {
          throw new Error(`Invalid quantity for product id: ${id}`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        product.stock -= quantity;
        product.sold_out += quantity;
        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// give a refund 
router.put(
  "/order-refund/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id!", 400));
      }

      
        order.status = req.body.status


      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
      }
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message:"Order Refund Request successfully!"
      });

      
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// accept the refund ----seller 
router.put("/order-refund-accept/:id",isSeller,catchAsyncError(async(req,res,next)=>{
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id!", 400));
    }
    order.status = req.body.status
    await order.save();

    res.status(200).json({
      success: true,
      message:"Order Refund successful!"
    });

if (req.body.status === "Refund Success") {
        for (const item of order.cart) {
          await updateOrder(item._id, item.qty);
        }
      }

    async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        product.stock += qty;
        product.sold_out -= qty;
        await product.save({ validateBeforeSave: false });
    }
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})
)
module.exports = router;
