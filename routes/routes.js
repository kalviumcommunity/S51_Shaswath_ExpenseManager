const express = require('express')
const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')
const GUser = require('../models/gusers.model')
const Remainders = require('../models/remainders.model')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const nodemailer = require('nodemailer')


const signUpRouter = express.Router()
const LoginRouter = express.Router()
const LogoutRouter = express.Router()
const transactionRouter = express.Router()
const getTransaction = express.Router()
const editTransaction = express.Router()
const geteachTransaction = express.Router()
const deleteTransaction = express.Router()
const gusersRouter = express.Router()
const getRemainders = express.Router()
const postRemainders = express.Router()

function generateRandomToken() {
    const token = jwt.sign(
        { data: "verificationToken" },
        process.env.SECRET_KEY,
        {
            expiresIn: "1d",
        }
    );
    return token;
}

// SignUP route
signUpRouter.post("/signup", async (req, res) => {
    try {
        const { name, username, email, password, verified } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            verified,
            verificationToken: generateRandomToken(),
        });

        // Send verification email
        await sendVerificationEmail(newUser.email, newUser.verificationToken, newUser._id, newUser.verified);

        return res.status(200).json({
            message: `Welcome, ${newUser.email}`,
            user: newUser,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Function to send verification email
async function sendVerificationEmail(email, verificationToken, id, verified) {
    try {
        // Create transporter using nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASS,
            },
        });

        // Construct email message
        const url = `https://expensevault.pages.dev/verification?token=${verificationToken}`
        // const url = "http://localhost:5173/verification"

        const mailOptions = {
            from: "shaswathgiridhran@gmail.com",
            to: email,
            subject: "Account Verification",
            html: `
                <p>Please click the following button to verify your email address:</p>
                <a href="${url}" target="_parent" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">Verify Email</a>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
}

getTransaction.get("/verification", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { verified: false },
            { verified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found or already verified" });
        }

        const payload = { id: user._id, email: user.email };
        const jwtToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', jwtToken, { httpOnly: true });


        res.status(200).send({
            message: "Email verified successfully",
            token: jwtToken,
            user: user,
        });


        // res.status(200).send({ message: "Email verified successfully", user });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


LoginRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ Message: "User not found" });
        }

        // Check if the user is verified
        if (!user.verified) {
            return res.status(400).json({ Message: "User is not verified" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ Message: "Invalid Username or password" });
        }

        // Create JWT token and handle successful login
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({
            message: `Welcome back, ${user.username}`,
            user,
            token
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Logout Router
LogoutRouter.get("/logout", (req, res) => {
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

postRemainders.post("/addremainders", async (req, res) => {
    try {
        const { date, title, amount, mode, user } = req.body;

        if (!title || !date || !amount || !mode) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newRemainder = await Remainders.create({
            title,
            date,
            amount,
            mode,
            user
        });

        return res.status(200).json({ message: "Remainder added successfully", remainder: newRemainder });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

const upload = multer();

transactionRouter.post("/add", authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, date, amount, category, description, mode, user } = req.body;

        // Validate request body
        if (!title || !date || !amount || !category || !description || !mode) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Get the uploaded image data and create image URL
        let imageUrl = null;
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const imageType = req.file.mimetype.split('/')[1];
            const base64Image = imageBuffer.toString('base64');
            imageUrl = `data:image/${imageType};base64,${base64Image}`;
        }

        // Create new transaction with user ID and optional image URL
        const newTransaction = await Transaction.create({
            title,
            date,
            amount,
            category,
            description,
            mode,
            user,
            imageUrl, // Store the image URL in the transaction document
        });

        // Associate this transaction with the corresponding user and update the user's transactions array
        const currentUser = await User.findById(user) || await GUser.findById(user)
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        currentUser.transactions.push(newTransaction); // Push the new transaction to the user's transactions array
        await currentUser.save(); // Save the user document with the updated transactions array

        return res.status(200).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

getRemainders.get("/getremainders", async (req, res) => {
    try {
        const remainders = await Remainders.find();
        res.status(200).json(remainders);
    } catch (error) {
        console.error('Error retrieving remainders:', error);
        res.status(500).json({ message: error.message });
    }
});

// Getting transactions
getTransaction.get("/get", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ message: error.message });
    }
});


editTransaction.patch("/patchremainders/:id", async (req, res) => {
    try {
        const { id } = req.params
        const updated = req.body
        const updatedRemainder = await Remainders.findOneAndUpdate({ _id: id }, updated, { new: true });
        if (!updatedRemainder) {
            return res.status(404).json({ error: 'Remainder not found' });
        }
        res.status(200).json(updatedRemainder)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Editing transactions
editTransaction.patch("/patch/:id", async (req, res) => {
    try {
        const { id } = req.params
        const updated = req.body
        const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id }, updated, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(updatedTransaction);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Getting each transaction
geteachTransaction.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params; // Destructure id from req.params

        console.log(`Fetching transaction for user ID: ${id}`);

        // Retrieve transaction from User model
        const transaction = await User.findOne({ _id: id });
        console.log(`User model transaction: ${transaction}`);

        // Retrieve transaction from GUser model if not found in User model
        const gtransaction = transaction || await GUser.findOne({ _id: id });
        console.log(`GUser model transaction: ${gtransaction}`);

        // Check if transaction exists in either model
        if (!transaction && !gtransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Send the response
        const response = transaction || gtransaction;
        return res.status(200).json(response);

    } catch (err) {
        console.error(`Error fetching transaction for user ID ${req.params.id}:`, err); // Use req.params.id here
        res.status(500).json({ error: 'Something went wrong' });
    }
});


deleteTransaction.delete('/deleteremainders/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteRemainder = await Remainders.findOneAndDelete({ _id: id })
        if (!deleteRemainder) {
            return res.status(404).json({ error: 'Remainder not found' });
        }
        res.status(200).json(deleteRemainder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})


// Deleting a transaction
deleteTransaction.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteTransaction = await Transaction.findOneAndDelete({ _id: id })
        if (!deleteTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(deleteTransaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

gusersRouter.post('/gusers', async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    try {
        // Check if user already exists in GUser model
        let existingGUser = await GUser.findOne({ email });
        if (existingGUser) {
            const token = jwt.sign({ userId: existingGUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ user: existingGUser, token });
        }

        // Check if user already exists in User model
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists in the main user model" });
        }

        // User doesn't exist in either model, create a new GUser
        const newUser = new GUser(userData);
        let savedUser = await newUser.save();
        console.log('User data saved to MongoDB:', savedUser);
        const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ user: savedUser, token });

    } catch (err) {
        console.error('Error handling user data in MongoDB:', err);
        res.status(500).send('Error handling user data in MongoDB');
    }
});

geteachTransaction.get('/gett/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Fetching transaction for user ID: ${id}`);

        // Retrieve transaction from User model
        const transaction = await Transaction.findOne({ _id: id });
        console.log(`User model transaction: ${transaction}`);


        // Check if transaction exists in either model
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Send the response
        const response = transaction
        return res.status(200).json(response);

    } catch (err) {
        console.error(`Error fetching transaction for user ID ${id}:`, err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



module.exports = { signUpRouter, LoginRouter, LogoutRouter, transactionRouter, getTransaction, editTransaction, geteachTransaction, deleteTransaction, gusersRouter, getRemainders, postRemainders }
