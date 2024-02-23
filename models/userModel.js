const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
firstname : {
    type: String,
    required: true 
},
lastname : {
    type: String,
    required: true 
},
email : {
    type: String,
    required: true ,
    unique: true
},
mobile : {
    type: String,
    required: true ,
    unique: true
},
password : {
    type: String,
    required: true 
},
role : {
    type: String,
    default: "user"
},
isBlocked: {
    type: Boolean,
    default: false
},
cart: {
    type: Array,
    default: []
},
address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
refreshtoken: {
    type: String
}
}, {timestamps: true})

const userModel = mongoose.model("User", userSchema)
module.exports =  userModel