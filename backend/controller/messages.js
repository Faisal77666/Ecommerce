const Messages = require("../model/messages.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const express = require("express");
const { upload } = require("../multer.js");
const router = express.Router();

// create new message
router.post("/create-new-message",upload.array("image"),catchAsyncErrors(async(req,res,next)=>{
  try {
    const messageData=req.body
    if(req.files){
      const files=req.files
      const imageUrls=files.map((file)=>`${file.filename}`)
      
      messageData.images=imageUrls
    }
       messageData.conversationId=req.body.conversationId
       messageData.sender=req.body.sender
       messageData.text=req.body.text
       const message=new Messages({
        conversationId:messageData.conversationId,
        text:messageData.text,
        sender:messageData.sender,
        images:messageData.images ? messageData.images : undefined
       })
       
    await message.save()
    res.status(201).json({
      success:true,
      message
    })
    
  }catch (error) {
    return next(new ErrorHandler(error,500))
  }
}))


// get all messages with conversation id

router.get('/get-all-messages/:id',catchAsyncErrors(async(req,res,next)=>{
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