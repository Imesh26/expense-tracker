const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes 
const transactions = require('./transactions-routes'); 
app.use('/api/v1/transactions', transactions);

app.get('/', (req, res) => {
    res.send("Successful expense tracker API!!");
});

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/expenseDB';

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ MongoDB Connection Error: ", err.message));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});