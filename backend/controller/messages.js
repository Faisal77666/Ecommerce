const Messages = require("../model/messages.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const express = require("express");
const { isConversationParticipant } = require("../middleware/auth");
const Conversation = require("../model/conversation.js");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");
const { upload } = require("../multer.js");
const router = express.Router();

// Create new message
router.post(
  "/create-new-message",
  isConversationParticipant,
  upload.array("image", 10),
  catchAsyncErrors(async (req, res, next) => {
    const { conversationId, text } = req.body;
   if (!conversationId) {
  return next(new ErrorHandler("Conversation ID is required", 400));
}

const conversation = await Conversation.findById(conversationId);

if (!conversation) {
  return next(new ErrorHandler("Conversation not found", 404));
}

const matchedIds = req.authenticatedMessageIds.filter(
      (id) => conversation.members.some(
        (member) => String(member) === id
      )
    );

    if (matchedIds.length === 0) {
      return next(new ErrorHandler("Access denied", 403));
    }

    // Do not allow a client to impersonate another user
    const requestedSender = String(req.body.sender || "");
    const sender = matchedIds.includes(requestedSender)
      ? requestedSender
      : matchedIds.length === 1
        ? matchedIds[0]
        : null;

    if (!sender) {
      return next(new ErrorHandler("Valid sender is required", 400));
    }

    const uploadedImages = [];

    try {
      for (const file of req.files || []) {
        const result = await uploadToCloudinary(
          file,
          "ecommerce/messages"
        );

        uploadedImages.push(result);
      }

      const message = await Messages.create({
        conversationId,
        sender,
        text,
        images: uploadedImages.map((image) => image.url),
      });

      return res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      const results = await Promise.allSettled(
        uploadedImages.map((image) =>
          deleteFromCloudinary(image.url)
        )
      );

      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Message image cleanup failed:", result.reason);
        }
      });

      console.error("Message creation failed:", error);
      return next(new ErrorHandler("Message creation failed", 500));
    }
  })
);

// get all messages with conversation id

router.get(
  '/get-all-messages/:id',
  isConversationParticipant,
  catchAsyncErrors(async(req,res,next)=>{
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return next(new ErrorHandler("Conversation not found", 404));
    }

    const matchedIds = req.authenticatedMessageIds.filter(
      (id) => conversation.members.some(
        (member) => String(member) === id
      )
    );

    if (matchedIds.length === 0) {
      return next(new ErrorHandler("Access denied", 403));
    }

  try {
    const messages=await Messages.find({
      conversationId:req.params.id
    })
    res.status(201).json({
      success:true,
      messages
    }
    )
  } catch (error) {
    return next(new ErrorHandler(error,500))
  }

}))

module.exports=router
