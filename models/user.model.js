const mongoose = require('mongoose')
const Transaction = require('./transaction.model')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    created: {type: Date, default: Date.now},
    verified: { type: Boolean, default: false },
    transactions: [Transaction.schema],
    verificationToken : {type: String}
})

const User = mongoose.model("users", UserSchema)
module.exports = User