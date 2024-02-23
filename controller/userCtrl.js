const bcryptjs = require("bcryptjs");
const { createError } = require("../middlewares/errorHandling.js");
const User = require("../models/userModel.js");
const createToken = require("../config/createToken.js");
const { default: mongoose } = require("mongoose");
const isObjectId = require("../config/isObjectId.js");
const createRefToken = require("../config/refreshToken.js");

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

module.exports = {
  createUser,
  logIn,
  getUsers,
  getaUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser
};
