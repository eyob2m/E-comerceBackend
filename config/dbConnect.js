const mongoose = require('mongoose')
const dbConnect = ()=>{
   try {
    mongoose.connect(process.env.MONGODB)
    console.log(`Connected to DB`);
   } catch (error) {
    console.log("Error while connecting to db ...");
   }
}

module.exports = dbConnect