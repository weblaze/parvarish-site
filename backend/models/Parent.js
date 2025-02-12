const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false } // Optional field
});

module.exports = mongoose.model('Parent', parentSchema);
