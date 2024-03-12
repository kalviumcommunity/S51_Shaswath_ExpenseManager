const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose')
const {Connect, isConnected} = require("./db")
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express();
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

//Connecting to MongoDB
Connect()


app.get("/", (req, res) => {
    const htmlResponse = `<h1><i>Expense Manager</i></h1><p>Database Connection Status: ${isConnected ? 'Connected':'Disconnected'}</p>`;
    res.send(htmlResponse);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

mongoose.connection.once('open', () => {
    console.log("Connected to mongoDB");
    if (require.main === module) {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    } else {
        console.log("error");
    }
});

module.exports = app;
