const mongoose = require('mongoose')
const dbConnect = ()=>{
   try {
    mongoose.connect(process.env.MONGODB)
    console.log(`Connected to DB`);
   } catch (error) {
   next(error)   }
}

module.exports = dbConnect