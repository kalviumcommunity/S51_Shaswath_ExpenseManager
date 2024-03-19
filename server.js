const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const { Connect, isConnected } = require("./db");
const cors = require('cors');
const bodyParser = require('body-parser');
const {signUpRouter, LoginRouter, LogoutRouter, transactionRouter} = require('./routes/routes')
const cookieParser = require('cookie-parser')


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



mongoose.connection.once('open', () => {
    console.log("Connected to mongoDB");
});

module.exports = app;
