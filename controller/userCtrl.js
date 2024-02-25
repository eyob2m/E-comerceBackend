const bcryptjs = require("bcryptjs");
const { createError } = require("../middlewares/errorHandling.js");
const User = require("../models/userModel.js");
const crypto = require('crypto')
const createToken = require("../config/createToken.js");
const { default: mongoose } = require("mongoose");
const isObjectId = require("../config/isObjectId.js");
const createRefToken = require("../config/refreshToken.js");
const jwt = require('jsonwebtoken');
const { SendMail } = require("./emailCtrl.js");

const createUser = async (req, res, next) => {
  try {
    const { email, firstname, lastname, password, mobile } = req.body;
    if (!email || !firstname || !lastname || !password || !mobile) {
      return next(createError(400, "Fill all fields"));
    }

    const usedEmail = await User.findOne({ email: email });
    const usedMobile = await User.findOne({ mobile: mobile });
    if (usedEmail) {
      return next(createError(400, "Used Email"));
    }
    if (usedMobile) {
      return next(createError(400, "Used Mobile"));
    }
    const hPassowrd = await bcryptjs.hashSync(password);
    const newUser = await await User.create({
      ...req.body,
      password: hPassowrd,
    });
    res.status(200).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};


const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createError(400, "Fill all fields"));
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return next(createError(404, "No User"));
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return next(createError(400, "Incorrect Password"));
    }

    const refreshToken = await createRefToken(user._id)
    const updateUser = await User.findByIdAndUpdate(user._id, {refreshtoken: refreshToken}, {new: true})
    res.cookie('refreshToken', refreshToken , { httpOnly: true, maxAge: 72*60*60*1000})

    const { mobile, firstname, lastname, _id } = user;
    res
      .status(200)
      .json({
        success: true,
        data: {
          mobile,
          firstname,
          email,
          lastname,
          _id,
          token: createToken(user._id),
        },
      });
  } catch (error) {
    next(error);
  }
};




const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return next(createError(404, "No Users"));
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
const getaUser = async (req, res, next) => {
  try {
  
    const { id } = req.params;

    if (!isObjectId(id)) {
      return next(createError(404, "Id is Incorrect"));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, "No User Found"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isObjectId(id)) {
      return next(createError(404, "Id is Incorrect"));
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(createError(404, "No User Found"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
   
    const { _id} = req.user;
    const id = _id

    if (!isObjectId(id)) {
      return next(createError(404, "Id is Incorrect"));
    }
    if (req.body.password) {
      return next(createError(404, "You can not change the password"));
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return next(createError(404, "No User Found"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req,res,next)=>{
try {
  
  const {_id} = req.user;
  const{ password} = req.body
  if ( !password) {
    return next(createError(400, "Fill all fields"));
  }
  if (!isObjectId(_id)) {
    return next(createError(404, "Id is Incorrect"));
  }
  const user = await User.findById(_id)
if(password) {
  const hPassowrd = await bcryptjs.hashSync(password);
  
  const user = await User.findByIdAndUpdate(_id, {password: hPassowrd}, {new: true})
  
  res.status(200).json(user)
}
} catch (error) {
  next(error)
}

}


const forgetPasswordToken = async (req,res,next)=>{

  try {
   
    const { email }= req.body
    
    const resetToken = await crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({email: email})
    console.log(user);
     if(!user) {
      return next(createError(404, "No user found"));
    }
   const date = new Date()
    const setUser = await User.findByIdAndUpdate(user._id,{
   
passwordResetToken: crypto.createHash("sha256").update(resetToken).digest("hex"),
passwordChangedAt: date.getTime(),
PasswordResetExpire: date.getTime() + 5*50*1000

    }, {new: true})
   
    const html = `Reset -> <a href="http://localhost:5000/reset-password/${resetToken}"> Link</a>`
    await SendMail(email, html)
    res.status(200).json({success: true, token: resetToken})
    
  } catch (error) {
    next(error)
  }
  
}

const blockUser = async (req, res, next) => {
  try {
   
    const {id} = req.params;
 

    if (!isObjectId(id)) {
      return next(createError(404, "Id is Incorrect"));
    }

    const user = await User.findByIdAndUpdate(id, {

      isBlocked: true

    }, { new: true });
    if (!user) {
      return next(createError(404, "No User Found"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


const unblockUser = async (req, res, next) => {
  try {
   
    const {id} = req.params;
 

    if (!isObjectId(id)) {
      return next(createError(404, "Id is Incorrect"));
    }

    const user = await User.findByIdAndUpdate(id, {

      isBlocked: false

    }, { new: true });
    if (!user) {
      return next(createError(404, "No User Found"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


const handleRefToken = async (req, res, next) => {
  try {
  
    const cookie = req.cookies;

    if (!cookie.refreshToken) {
      return next(createError(404, "No refresh token in cookies"));
    }
    const refreshToken = await cookie.refreshToken;
    const user = User.findOne({refreshtoken: refreshToken})
    if (!user) {
       next(createError(404, "No refresh token in db match"));
         }
         const decode = jwt.verify(refreshToken, process.env.JWTSECRET)
      
         const accessToken =  createToken(user._id)
         res.status(200).json(accessToken)

   
  } catch (error) {
    next(error);
  }
};

const resetPassword= async (req,res,next)=>{
  try {
    
    const {token} = req.params
    const hToken = crypto.createHash("sha256").update(token).digest("hex");
  
    const user = await User.findOne({passwordResetToken: hToken, PasswordResetExpire: {$gt : Date.now()}})
   console.log(user);
    if(!user) {
      return next(createError(400, "Expired Token"));
    }
    const {password} = req.body
    if(!password) {
      next(createError(404, "New Password needed"));
    }
    const hPassowrd = await bcryptjs.hashSync(password);
    const un = undefined
    const upu = await User.findByIdAndUpdate(user._id, {
      password: hPassowrd,
      passwordChangedAt: Date.now(),
      passwordResetToken: un, 
      PasswordResetExpire: un

    }, {new: true})

    res.status(200).json(upu)
  } catch (error) {
    next(error)
  }

}


const logOut = async (req, res, next) => {
  try {
   
    const cookie = req.cookies;

    if (!cookie.refreshToken) {
      return next(createError(404, "No refresh token in cookies"));
    }
    const refreshToken = await cookie.refreshToken;
    
    const user = await User.find({refreshtoken : refreshToken})
   
    if (!user) {
      console.log(user);
      res.clearCookie("refreshToken", {
        secure: true,
        httpOnly: true
      })
      return res.sendStatus(204)

         }
         
         
       
         await User.findByIdAndUpdate(user._id, {
          
refreshtoken: "",
         })
         res.clearCookie("refreshToken", {
          secure: true,
          httpOnly: true
        })
        return res.sendStatus(204)
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  logIn,
  getUsers,
  getaUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefToken,
  logOut,
  updatePassword,
  forgetPasswordToken,
  resetPassword
};
