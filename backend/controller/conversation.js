const Conversation = require("../model/conversation.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const { isAuthenticated } = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();


//create a new conversation
router.post("/create-new-conversation",catchAsyncErrors(async(req,res,next)=>{
  try {
    const {groupTitle,userId,sellerId}=req.body
    const isConversationExist=await Conversation.findOne({groupTitle})
    if(isConversationExist){
      const conversation=isConversationExist
      res.status(201).json({
        success:true,
        conversation
      })
    } else{
      const conversation=await Conversation.create({
        groupTitle,
        members:[userId,sellerId]
      })
      res.status(201).json({
        success:true,
        conversation
      })
    }
    
    
  } catch (error) {
    return next(new ErrorHandler(error,500))
    
  }

}))


//get seller conversations
router.get("/get-all-conversation-seller/:id",catchAsyncErrors(async(req,res,next)=>{
  try {
    const conversations=await Conversation.find({
      members:{$in:[req.params.id]}
    }).sort({updatedAt:-1,createdAt:-1})
    res.status(201).json({
      success:true,
      conversations
    })
  } catch (error) {
    return next(new ErrorHandler(error,500))
  }
}))

//get user conversations
router.get("/get-all-conversation-user/:id",isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
  try {
    const conversations=await Conversation.find({
      members:{$in:[req.params.id]}
    }).sort({updatedAt:-1,createdAt:-1})
    res.status(201).json({
      success:true,
      conversations
    })
  } catch (error) {
    return next(new ErrorHandler(error,500))
  }
}))



//update the last conversation

router.put('/update-last-message/:id',catchAsyncErrors(async(req,res,next)=>{
try {
  const {lastMessage,lastMessageId}=req.body
  const conversation=await Conversation.findByIdAndUpdate(req.params.id,{
    lastMessage,
    lastMessageId
  },{new:true})

  res.status(201).json({
    success:true,
    conversation
  })
} catch (error) {
  return next(new ErrorHandler(error,500))
}
}
))

module.exports=router