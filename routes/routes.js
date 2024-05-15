const express = require('express')
const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')
const GUser = require('../models/gusers.model')
const Remainders = require('../models/remainders.model')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { storeUserInCache, getCachedUser, getCachedRemainders, storeRemaindersInCache, storeTransactioInCache, getCachedTransactions } = require('../redisClient')
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
        await sendVerificationEmail(newUser.email, newUser.verificationToken, newUser._id);

        return res.status(200).json({
            message: `Welcome, ${newUser.email}`,
            user: newUser,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Function to send verification email
async function sendVerificationEmail(email, verificationToken, id) {
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
        // Construct email message with HTML content
        const url = `https://expense-vault.netlify.app/`
        // const url = `http://localhost:5173/`

        const mailOptions = {
            from: "shaswathgiridhran@gmail.com",
            to: email,
            subject: "Account Verification",
            html: `
        <p>Please click the following button to verify your email address:</p>
        <a href="${url}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">Verify Email</a>
    `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
        // Handle error appropriately
    }
}


getTransaction.get("/verification", async (req, res) => {
    try {
        // Assuming you're passing user ID as a query parameter named 'id'
        const userId = req.query.id;
        if (!userId) return res.status(400).send({ message: "User ID is required" });

        const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true });
        if (!user) return res.status(400).send({ message: "Invalid user ID" });

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



LoginRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check cache for user data
        const cachedUser = await getCachedUser(username);
        if (cachedUser) {
            const token = jwt.sign({ userId: cachedUser._id }, process.env.SECRET_KEY);
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({
                message: `Welcome back, ${cachedUser.username}`,
                user: cachedUser,
                token
            });
        }

        // If not cached, perform user lookup and password check
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

        // Optionally store user data in cache for future requests
        await storeUserInCache(user, username);

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
        return res.status(200).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

getRemainders.get("/getremainders", async (req, res) => {
    try {
        const cachedRemainders = await getCachedRemainders();
        if (cachedRemainders) {
            console.log('Serving remainders from cache');
            return res.status(200).json(cachedRemainders);
        }

        // If not cached, fetch from database
        const remainders = await Remainders.find();
        res.status(200).json(remainders);

        // Optionally store remainders in cache for future requests
        await storeRemaindersInCache(remainders);
    } catch (error) {
        console.error('Error retrieving remainders:', error);
        res.status(500).json({ message: error.message });
    }
});

// Getting transactions
getTransaction.get("/get", async (req, res) => {
    try {
        const cachedTransactions = await getCachedTransactions();
        if (cachedTransactions) {
            console.log('Serving transactions from cache');
            return res.status(200).json(cachedTransactions); // Error occurs here
        }

        // If not cached, fetch from database
        const transactions = await Transaction.find();
        res.status(200).json(transactions);

        // Optionally store transactions in cache for future requests
        await storeTransactioInCache(transactions)
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
        const { id } = req.params;
        const transaction = await Transaction.findOne({ _id: id });
        if (!transaction) {
            return res.status(404).json({ error: 'transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (err) {
        console.error(err);
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

gusersRouter.post('/gusers', (req, res) => {
    const userData = req.body;
    const { email } = userData;

    // Check if user already exists
    GUser.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                // User already exists, return existing user data
                const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ user: existingUser, token });
            } else {
                // User doesn't exist, create a new user
                const newUser = new GUser(userData);
                newUser.save()
                    .then(savedUser => {
                        console.log('User data saved to MongoDB:', savedUser);
                        const token = jwt.sign({ userId: savedUser._id }, 'your_secret_key', { expiresIn: '1h' });
                        res.status(200).json({ user: savedUser, token });
                    })
                    .catch(err => {
                        console.error('Error saving user data to MongoDB:', err);
                        res.status(500).send('Error saving user data to MongoDB');
                    });
            }
        })
        .catch(err => {
            console.error('Error finding user in MongoDB:', err);
            res.status(500).send('Error finding user in MongoDB');
        });
});

module.exports = { signUpRouter, LoginRouter, LogoutRouter, transactionRouter, getTransaction, editTransaction, geteachTransaction, deleteTransaction, gusersRouter, getRemainders, postRemainders }
