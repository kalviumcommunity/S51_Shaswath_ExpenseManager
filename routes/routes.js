const express = require('express')
const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')


const signUpRouter = express.Router()
const LoginRouter = express.Router()
const LogoutRouter = express.Router()
const transactionRouter = express.Router()
const getTransaction = express.Router()


// SignUP route
signUpRouter.post("/signup",async (req, res) =>{
    try{
        const {name, username, email, password} = req.body
        if(!name || !username || !email || !password){
            return res.status(400).json({Message: "Please enter all fields"})
        }
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({Message: "User already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        let newUser = await User.create({name, username, email, password: hashedPassword})
        return res.status(200).json({User: newUser})
    } catch(err){
        return res.status(500).json({success: false, message: err.message,});
    }
})

// Login Route
LoginRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ Message: "Please enter all fields" });
        }
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ Message: "User not found" });
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ Message: "Invalid Username or password" });
        }
        // Create JWT token
        const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY);
        
        // Store token in cookie
        console.log(user)
        res.cookie('token', token, { httpOnly: true});
        console.log("token", token, user.username)
        return res.status(200).json({
            message: `Welcome back, ${user.username}`,
            user,
            token
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
})

LogoutRouter.get("/logout", (req, res)=>{
    res.clearCookie('token');
    res.send('Logout successful');
});




function authenticateToken(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    token = token.slice(7); 
    console.log(token)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
}


// Add Transaction route
transactionRouter.post("/add", authenticateToken ,  async (req, res) => {
    try {
        const { title, date, amount, category, description, mode, user } = req.body;

        // Validate request body
        if (!title || !date || !amount || !category || !description || !mode) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        // Create new transaction with user ID
        const newTransaction = await Transaction.create({
            title,
            date,
            amount,
            category,
            description,
            mode,
            user
        });

        return res.status(200).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});




// Getting transactions
getTransaction.get("/get", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = {signUpRouter, LoginRouter, LogoutRouter, transactionRouter, getTransaction}
