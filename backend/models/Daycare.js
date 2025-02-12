const mongoose = require('mongoose');

const daycareSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    details: { type: String, required: false }
});

module.exports = mongoose.model('Daycare', daycareSchema);
