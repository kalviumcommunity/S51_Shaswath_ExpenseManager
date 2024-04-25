const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    created: {type: Date, default: Date.now},
})

const User = mongoose.model("users", UserSchema)
module.exports = User