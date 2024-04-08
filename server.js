const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const { Connect, isConnected } = require("./db");
const cors = require('cors');
const bodyParser = require('body-parser');
const {signUpRouter, LoginRouter, LogoutRouter, transactionRouter, getTransaction, editTransaction, geteachTransaction, deleteTransaction} = require('./routes/routes')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const User = require('./models/gusers.model')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


// Connect to MongoDB
Connect()
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server after successful connection
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    }) .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); 
    });

// Routes
app.use("/", signUpRouter)
app.use("/", LoginRouter)
app.use("/", LogoutRouter)
app.use("/", transactionRouter)
app.use("/", getTransaction)
app.use("/", editTransaction)
app.use("/", geteachTransaction)
app.use("/", deleteTransaction)



// Home Route
app.get("/", (req, res) => {
    const htmlResponse = `<h1><i>Expense Manager</i></h1><p>Database Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}</p>`;
    res.send(htmlResponse);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.post('/gusers', (req, res) => {
    const userData = req.body;
    const { email } = userData;

    // Check if user already exists
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                // User already exists, return existing user data
                const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ user: existingUser, token });
            } else {
                // User doesn't exist, create a new user
                const newUser = new User(userData);
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


mongoose.connection.once('open', () => {
    console.log("Connected to mongoDB");
});

module.exports = app;
