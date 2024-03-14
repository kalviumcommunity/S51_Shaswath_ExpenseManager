const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')


const signUpRouter = express.Router()
const LoginRouter = express.Router()
const LogoutRouter = express.Router()


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
        res.cookie('token', token, { httpOnly: true});
        console.log("token", token, user.username)
        return res.status(200).json({
            message: `Welcome back, ${user.username}`,
            user,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
})

LogoutRouter.get("/logout", (req, res)=>{
    res.clearCookie('token');
    res.send('Logout successful');
});

module.exports = {signUpRouter, LoginRouter, LogoutRouter}
