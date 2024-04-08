const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String,  unique: true},
    name: {type: String },
    password: {type: String},
    email: {type: String, unique: true},
    created: {type: Date, default: Date.now},
    transactions: {type: []}
})

const gUser = mongoose.model("gusers", UserSchema)
module.exports = gUser