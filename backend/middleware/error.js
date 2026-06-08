const ErrorHandler=require('../utils/ErrorHandler.js')



module.exports=(err,req,res,next)=>{
err.statuscode=err.statuscode || 500
err.message=err.message || "Inter server error"


// wrong mongodb id error

if(err.name === "CastError"){
  const message =`Resources not found with this id ${err.path}`
  err=new ErrorHandler(message,400)
}

//duplicate key error
if(err.code === 11000){
  const message=`Duplicate key ${Object.keys(err.keyValue)} Entered`
  err=new ErrorHandler(message,400)
}


// wrong jwt error
if(err.name === "JsonWebToken"){
  const message=`Your url is invalid please try again later`
  err=new ErrorHandler(message,400)

}

// jwt expired 
if(err.name === "TokenExpiredError"){
  const message=`Your url is expired please try again later`
  err=new ErrorHandler(message,400)
}

res.status(err.statuscode).json({
  success:false,
  message:err.message
})
}