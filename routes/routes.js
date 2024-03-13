const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

const signUpRouter = express.Router()
const LoginRouter = express.Router()

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
LoginRouter.post('/login',async (req, res) => {
    try{
        const {username, password} = req.body
        if(!email || !password){
            return res.status(400).json({Message: "Please enter all fields"})
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({Message: "User not found"})
        }
        const passwordCheck = await bcrypt.compare(password, user.password)
        if(!passwordCheck){
            res.status(400).json({Message: "Invalid Username or password"})
        }
        return res.status(200).json({
            message: `Welcome back, ${user.username}`,
            user,
        });
    } catch(err){
        return res.status(500).json({success: false, message: err.message,});
    }
    
})

module.exports = {signUpRouter}

// export const loginControllers = async (req, res, next) => {
//     try{
//         const { email, password } = req.body;

//         // console.log(email, password);
  
//         if (!email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter All Fields",
//             }); 
//         }
    
//         const user = await User.findOne({ email });
    
//         if (!user){
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found",
//             }); 
//         }
    
//         const isMatch = await bcrypt.compare(password, user.password);
    
//         if (!isMatch){
//             return res.status(401).json({
//                 success: false,
//                 message: "Incorrect Email or Password",
//             }); 
//         }

//         delete user.password;

        // return res.status(200).json({
        //     success: true,
        //     message: `Welcome back, ${user.name}`,
        //     user,
        // });

//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// }