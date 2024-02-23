const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/authRoute.js");
const { notFound, errorHandler } = require("./middlewares/errorHandling.js");
dbConnect();
app.use(cookieParser)
app.use(bodyparser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
