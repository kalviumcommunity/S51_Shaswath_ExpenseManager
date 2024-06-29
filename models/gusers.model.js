const mongoose = require('mongoose')
const Transaction = require('./transaction.model')


const UserSchema = new mongoose.Schema({
    username: {type: String,  unique: true},
    name: {type: String },
    password: {type: String},
    email: {type: String, unique: true},
    created: {type: Date, default: Date.now},
    transactions: [Transaction.schema]
})

const gUser = mongoose.model("gusers", UserSchema)
module.exports = gUser