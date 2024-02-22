const jwt = require("jsonwebtoken");

const createToken = (myid) => {
  try {
    const token = jwt.sign({ id: myid }, process.env.JWTSECRET, {
      expiresIn: "3d",
    });
    return token;
  } catch (error) {
    next(error);
  }
};

module.exports = createToken;
