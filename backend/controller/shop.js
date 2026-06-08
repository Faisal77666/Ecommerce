const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const { ACCOUNT_CREATED_TEMPLATE, ACCOUNT_VERIFY_TEMPLATE } = require("../config/emailTemplates");
const sendShopToken = require("../utils/shopToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/product");

//create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      const filename = req.file.filename;
      const filepath = `uploads/${filename}`;
      fs.unlink(filepath, (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
    try {
      const htmlTemplate = ACCOUNT_VERIFY_TEMPLATE
  .replace("{{name}}", seller.name)
  .replace("{{email}}", seller.email)
  .replace("{{activationUrl}}", activationUrl);

// Send the email
await sendMail({
  email: seller.email,
  subject: "Activate your shop",
  html: htmlTemplate, // ✅ use HTML template here
});

res.status(201).json({
  success: true,
  message: `Please check your email (${seller.email}) to activate your shop.`,
});
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  
  
  
  
  catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate shop
router.post("/activation", async (req, res) => {
  try {
    const { activation_token } = req.body;
    if (!activation_token) {
      return res.status(400).json({ success: false, msg: "No token provided" });
    }

    // Verify token
    const newSeller = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );
    if (!newSeller) {
      return res.status(400).json({ success: false, msg: "Invalid token" });
    }

    const { name, email, password, avatar, zipCode, address, phoneNumber } =
      newSeller;

    // Check if user already exists
    let seller = await Shop.findOne({ email });
    if (seller) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    seller = await Shop.create({
      name,
      email,
      password,
      avatar,
      zipCode,
      address,
      phoneNumber,
    });

    // Send "Account Created Successfully" email
const successHtml = ACCOUNT_CREATED_TEMPLATE
  .replace("{{name}}", seller.name)
  .replace("{{loginUrl}}", "http://localhost:3000/login")
  .replace("{{year}}", new Date().getFullYear());

await sendMail({
  email: seller.email,
  subject: "Your shop has been created successfully",
  html: successHtml,
});
    // ✅ Send token & login user directly
    sendShopToken(seller, 201, res);
  } catch (error) {
    console.error("Activation error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
});


//login shop

router.post("/login-shop", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if(!shop){
      return next(new ErrorHandler("Shop doesn't exist!", 400));
    }

    const isPasswordValid = await shop.comparePassword(password);
    if(!isPasswordValid){
      return next(new ErrorHandler("Invalid credentials!", 400));
    }

    sendShopToken(shop, 201, res);

  } catch(error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


//load shop

router.get('/getSeller',isSeller,catchAsyncError(async(req,res,next)=>{
try {
  const seller=await Shop.findById(req.seller.id)
  if(!seller){
    return next(new ErrorHandler("Seller doesn't exist!", 400));
   
  }
   res.status(200).json({
      success:true,
      seller
    })

  
} catch (error) {
  return next(new ErrorHandler(error.message,500))
}
}))

//logout from shop

router.get('/logout',catchAsyncError(async(req,res,next)=>{
  try {
    res.cookie("seller_token",null,{
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
router.get("/get-shop-info/:id", catchAsyncError(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  res.status(201).json({
    success: true,
    shop,
  });
}));


//update shop profile picture

router.put('/update-shop-avatar',isSeller,upload.single('image'),catchAsyncError(async(req,res,next)=>{
  try {
    const existsUser=await Shop.findById(req.seller._id)
    const existAvatarPath=`uploads/${existsUser.avatar}`
    fs.unlinkSync(existAvatarPath)
    const fileUrl=path.join(req.file.filename)
    const seller=await Shop.findByIdAndUpdate(req.seller._id,{avatar:fileUrl})
    res.status(200).json({
      success:true,
      seller
    })
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    
  }
}))

//update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }



      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;
      

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
