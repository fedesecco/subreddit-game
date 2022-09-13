import { StatusCodes } from "http-status-codes"

const erroreHandlerMiddleWare = (err,req,res,next) => {
    console.log(err)
    const defaultError = {
        statusCode:StatusCodes.INTERNAL_SERVER_ERROR,
        msg:"Something went wrong"
    }
    if (err.name === "ValidationError"){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        //defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors).map((item)=>item.message).join(", ")
    }
    //res.status(defaultError.statusCode).json({msg:err})
    res.status(defaultError.statusCode).json({msg:defaultError.msg})
}

export default erroreHandlerMiddleWare