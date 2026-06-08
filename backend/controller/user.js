const express=require('express')
const path=require('path')
const router=express.Router()
const {upload}=require("../multer")
const User=require('../model/user')
const ErrorHandler=require("../utils/ErrorHandler")
const fs = require('fs')
const jwt=require("jsonwebtoken")
const sendMail=require('../utils/sendMail')
const sendToken=require('../utils/jwtToken')
const catchAsyncError = require('../middleware/catchAsyncError')
const { isAuthenticated } = require('../middleware/auth')
const { USER_ACCOUNT_VERIFY_TEMPLATE, USER_ACCOUNT_CREATED_TEMPLATE } = require('../config/emailTemplates')


router.post("/create-user",upload.single("file"),async (req,res,next)=>{
  try{
  const {name,email,password}=req.body
    const userEmail=await User.findOne({email})
    if(userEmail){
      const filename=req.file.filename
      const filepath=`uploads/${filename}`
      fs.unlink(filepath,(error)=>{
        if(error){
          console.log(error);
          res.status(500).json({message:"Error deleting file"})
        }
       
      })
      return next(new ErrorHandler('User already exists',400))
    }

    const filename=req.file.filename
    const fileUrl=path.join(filename)

    const user={
      name:name,
      email:email,
      password:password,
      avatar:fileUrl
    } 
    const activationToken=createActivationToken(user)
    const activationUrl=`http://localhost:3000/activation/user/${activationToken}`
    try {
      const htmlTemplate = USER_ACCOUNT_VERIFY_TEMPLATE
  .replace("{{name}}", user.name)
  .replace("{{email}}", user.email)
  .replace("{{activationUrl}}", activationUrl);

// Send the email
await sendMail({
  email: user.email,
  subject: "Activate your account",
  html: htmlTemplate, // ✅ use HTML template here
});
      res.status(201).json({
        success:true,
        message:`please check your email:- ${user.email} to activate your account `
      })
      
    } catch (error) {
      return next(new ErrorHandler(error.message,500))
      
    }
  } catch(error){
      return next(new ErrorHandler(error.message,400))
    }
  
  
    
})

//create activation token
const createActivationToken=(user)=>{
  return jwt.sign(user,process.env.ACTIVATION_SECRET,{
    expiresIn:"5m"
  })

}

// activate user
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;
    if (!activation_token) {
      return res.status(400).json({ success: false, msg: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!decoded) {
      return res.status(400).json({ success: false, msg: "Invalid token" });
    }

    const { name, email, password, avatar } = decoded;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "User already exists" });
    }

    // Create new user in DB
    const user = await User.create({ name, email, password, avatar });

    // Send "Account Created Successfully" email
    const successHtml = USER_ACCOUNT_CREATED_TEMPLATE
      .replace("{{name}}", user.name)
      .replace("{{loginUrl}}", "http://localhost:3000/login")
      .replace("{{year}}", new Date().getFullYear());
    
    await sendMail({
      email: user.email,
      subject: "Your account has been created successfully",
      html: successHtml,
    });

    // ✅ Send token & login user directly
    sendToken(user, 201, res);

  } catch (error) {
    console.error("Activation error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//login

router.post("/login-user", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if(!user){
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
      return next(new ErrorHandler("Invalid credentials!", 400));
    }

    sendToken(user, 201, res);

  } catch(error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//load user

router.get('/getuser',isAuthenticated,catchAsyncError(async(req,res,next)=>{
try {
  const user=await User.findById(req.user.id)
  if(!user){
    return next(new ErrorHandler("User doesn't exist!", 400));
   
  }
   res.status(200).json({
      success:true,
      user
    })

  
} catch (error) {
  return next(new ErrorHandler(error.message,500))
}
}))

//logout user

router.get('/logout',isAuthenticated,catchAsyncError(async(req,res,next)=>{
  try {
    res.cookie("token",null,{
      expiresIn:new Date(Date.now()),
      httpOnly:true
    })
    res.status(200).json({
      success:true,
      message:"Log out Successful"
    })

    
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
}))

 
// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({email}).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }


      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user avatar
router.put('/update-avatar',isAuthenticated,upload.single('image'),catchAsyncError(async(req,res,next)=>{
  try {
    const existsUser=await User.findById(req.user.id)
    const existAvatarPath=`uploads/${existsUser.avatar}`
    fs.unlinkSync(existAvatarPath)
    const fileUrl=path.join(req.file.filename)
    const user=await User.findByIdAndUpdate(req.user.id,{avatar:fileUrl})
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    
  }
}))


//update user addresses
router.put('/update-user-addresses',isAuthenticated,catchAsyncError(async(req,res,next)=>{
  try {
    const user=await User.findById(req.user.id)
    const sameTypeAddress=user.addresses.find((address)=>address.addressType===req.body.addressType)
    if(sameTypeAddress){
      return next(new ErrorHandler(`${req.body.addressType} address is already exists!`))
    }
    const existAddress=user.addresses.find((address)=>address._id===req.body._id)
    if(existAddress){
      Object.assign(existAddress,req.body)
    }else{
      //add the new address to the array
      user.addresses.push(req.body)
    }
    await user.save()
    res.status(200).json({
      success:true,
      user

    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    
  }
}))

//delete user adddress
router.delete('/delete-user-address/:id',isAuthenticated,catchAsyncError(async(req,res,next)=>{
try {
  const userId=req.user._id
  const addressId=req.params.id
  await User.updateOne({
    _id:userId
  },
  {$pull:{addresses:{_id:addressId}}}
 

)
 const user=await User.findById(userId)
 res.status(200).json({
  success:true,
  user,
 })
} catch (error) {
  return next(new ErrorHandler(error.message, 500));
  
}
}))

//update user password
router.put('/update-user-password',isAuthenticated,catchAsyncError(async(req,res,next)=>{
  try {
    const user=await User.findById(req.user.id).select("+password")
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
      return (next(new ErrorHandler("Old password is incorrect!",400)))
    }
    if(req.body.newPassword!==req.body.confirmPassword){
      return (next(new ErrorHandler("Password does not matched with each other!",400)))
    }
    user.password=req.body.newPassword
    await user.save()
    res.status(200).json({
      success:true,
      message:"Password updated successfully!"
    })

    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  
  }
}))


//find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports=router