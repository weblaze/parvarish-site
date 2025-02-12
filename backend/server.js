const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow all origins for testing purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
})); // Use CORS middleware

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parvarish', { useNewUrlParser: true, useUnifiedTopology: true });

const Parent = require('./models/Parent'); // Use the new Parent model
const Daycare = require('./models/Daycare');
const Booking = require('./models/Booking');

// User registration route
app.post('/parent/register', async (req, res) => {
    const { username, password, email, phone } = req.body;
    const newUser = new Parent({ username, password, email, phone });
    await newUser.save();
    res.status(201).send('Parent registered successfully!');
});

// User login route
app.post('/parent/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Parent.findOne({ username, password });
    if (user) {
        res.status(200).send('Login successful!');
    } else {
        res.status(401).send('Login failed.');
    }
});

// Daycare registration route
app.post('/daycare/register', async (req, res) => {
    const { name, password, address, contactNumber, capacity } = req.body;
    const newDaycare = new Daycare({ name, password, address, contactNumber, capacity });
    await newDaycare.save();
    res.status(201).send('Daycare registered successfully!');
});

// Daycare listing route
app.get('/daycares', async (req, res) => {
    const daycares = await Daycare.find();
    res.json(daycares);
});

// Booking route
app.post('/book', async (req, res) => {
    const { userId, daycareId, date } = req.body;
    const newBooking = new Booking({ userId, daycareId, date });
    await newBooking.save();
    res.status(201).send('Booking created successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
