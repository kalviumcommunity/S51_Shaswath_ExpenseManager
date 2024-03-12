const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String},
    name: {type: String},
    password: {type: String},
    email: {type: String},
    created: {type: Date, default: Date.now},
    transactions: {type: []}
})

const User = mongoose.model("users", UserSchema)
module.exports = User