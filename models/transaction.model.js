// Import necessary modules
const mongoose = require('mongoose');
const path = require('path');

// Define the Transaction schema
const TransactionSchema = new mongoose.Schema({
    title: { type: String },
    date: { type: Date },
    amount: { type: Number },
    category: { type: String },
    description: { type: String },
    mode: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String, default: null } // Add imageUrl field to store image URL
});

// Export the Transaction model
module.exports = mongoose.model("Transaction", TransactionSchema);
