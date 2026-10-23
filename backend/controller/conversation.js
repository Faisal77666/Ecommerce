const Shop = require("../model/shop.js");
const Conversation = require("../model/conversation.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const { isAuthenticated, isConversationParticipant } = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();


// create a new conversation
router.post(
  "/create-new-conversation",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { userId, sellerId } = req.body;

    if (!req.user || String(userId) !== String(req.user._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    if (!sellerId) {
      return next(new ErrorHandler("Seller ID is required", 400));
    }

    const seller = await Shop.findById(sellerId);

    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }

    const members = [String(req.user._id), String(seller._id)];

    // Reuse a conversation for this customer/seller pair.
    let conversation = await Conversation.findOne({
      members: { $all: members, $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        groupTitle: members.join("-"),
        members
      });
    }

    return res.status(201).json({
      success: true,
      conversation
    });
  })
);

// Get seller conversations
router.get(
  "/get-all-conversation-seller/:id",
  isConversationParticipant,
  catchAsyncErrors(async (req, res, next) => {
    const accountId = String(req.params.id);

    if (!req.authenticatedMessageIds.includes(accountId)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    const conversations = await Conversation.find({
      members: accountId
    }).sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      conversations
    });
  })
);

// Get customer conversations
router.get(
  "/get-all-conversation-user/:id",
  isConversationParticipant,
  catchAsyncErrors(async (req, res, next) => {
    const accountId = String(req.params.id);

    if (!req.authenticatedMessageIds.includes(accountId)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    const conversations = await Conversation.find({
      members: accountId
    }).sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      conversations
    });
  })
);

// Update the last conversation message
router.put(
  "/update-last-message/:id",
  isConversationParticipant,
  catchAsyncErrors(async (req, res, next) => {
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

    const { lastMessage, lastMessageId } = req.body;

    if (!matchedIds.includes(String(lastMessageId))) {
      return next(new ErrorHandler("Invalid sender", 403));
    }

    conversation.lastMessage = lastMessage;
    conversation.lastMessageId = String(lastMessageId);

    await conversation.save();

    return res.status(200).json({
      success: true,
      conversation
    });
  })
);

module.exports=router