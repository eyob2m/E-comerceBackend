const bcryptjs = require("bcryptjs");
const { createError } = require("../middlewares/errorHandling.js");
const User = require("../models/userModel.js");
const createToken = require("../config/createToken.js");

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
    const { mobile, firstname,lastname,_id} = user
    res.status(200).json({ success: true, data: {mobile, firstname,email,lastname,_id, token: createToken(user._id)} });
  } catch (error) {
    next(error);
  }
};
module.exports = { createUser, logIn };
