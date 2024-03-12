const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    date: {type: Date},
    amount: {type: Number},
    category: {type: String},
    description: {type: String},
    mode: {type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model("transactions", TransactionSchema)