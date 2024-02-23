const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel');
const { createError } = require('./errorHandling');
const isObjectId = require('../config/isObjectId');
const authMiddleware = async (req,res,next) =>{

    try {
       
        if(req?.headers?.authorization?.startsWith('Bearer')) {
     const token = req?.headers?.authorization.split(" ")[1]
      if(!token) {
        return next(createError(400, "Token Expired"))
      }

      const decode = jwt.verify(token, process.env.JWTSECRET)
      const userId  = decode?.id
      
      
      if (!isObjectId(userId)) {
        return next(createError(404, "Id is Incorrect"));
      }
      const user = await userModel.findById(userId)
      if (!user) {
        return next(createError(404, "No User Found"));
      }
      req.user = user
     
      next()

        }
        else {
            return next(createError(400, "No token attached"))
        }
    } catch (error) {
        next(error)
    }

}

const isAdmin = async (req,res,next) =>{

    try {
       
        const { _id} = req.user;
        const id = _id
    
        if (!isObjectId(id)) {
          return next(createError(404, "Id is Incorrect"));
        }
    
    
      const user = await userModel.findById(id)
      if (!user) {
        return next(createError(404, "No User Found"));
      }
      if(user.role!="admin") {
        return next(createError(404, "You are not admin"));
      }
      req.user = user
     
      next()

        }
       
    catch (error) {
        next(error)
    }

}



module.exports =  {authMiddleware , isAdmin}