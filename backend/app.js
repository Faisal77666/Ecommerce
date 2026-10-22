const express=require("express")
const ErrorHandler = require("./middleware/error")
const app=express()
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser")
const cors=require("cors")


app.use(cookieParser())
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim()),
  credentials:true
}))
app.use("/",express.static("uploads"))
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use(express.json());

//config

if(!["production", "PRODUCTION"].includes(process.env.NODE_ENV)){
require("dotenv").config({
  path:"backend/config/.env"
})
}

//import routes

const user=require('./controller/user')
const shop=require('./controller/shop')
const product=require('./controller/product')
const event=require('./controller/event')
const coupon=require('./controller/couponCode')
const payment=require('./controller/payment')
const order=require('./controller/order')
const conversation=require('./controller/conversation')
const message=require('./controller/messages')

app.use("/api/v2/user",user)
app.use("/api/v2/order",order)
app.use("/api/v2/shop",shop)
app.use("/api/v2/product",product)
app.use("/api/v2/event",event)
app.use("/api/v2/coupon",coupon)
app.use("/api/v2/payment",payment)
app.use("/api/v2/conversation",conversation)
app.use("/api/v2/message",message)

// its for ErrorHandling

app.use(ErrorHandler)




module.exports=app