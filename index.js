const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const morgan = require('morgan')
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4000;
const productRouter = require("./routes/productRoutes.js");
const authRouter = require("./routes/authRoute.js");
const { notFound, errorHandler } = require("./middlewares/errorHandling.js");
dbConnect();
app.use(morgan('dev'))
app.use(bodyparser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
