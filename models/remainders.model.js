const mongoose = require('mongoose')

const RemaindersSchema = new mongoose.Schema({
    date: {type: Date},
    title: {type: String},
    amount: {type: Number},
    mode: {type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model("remainders", RemaindersSchema)