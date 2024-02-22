
const notFound = (req,res,next)=>{
    const error = new Error(`Not Found: ${req.originalUrl}`)
    res.status(404)
    next(error)
}



const errorHandler = (err, req,res,next)=>{

    const statusCode =err.statusCode || 500
    const message =err.message || "Internal Error"
    res.status(statusCode).json({
     success: false,
     statusCode,
     message
    })
    
   }

const createError=(statusCode,  message)=>{
    const error = new Error()
    error.message = message
    error.statusCode = statusCode
    return error
}

module.exports = {createError, errorHandler, notFound}