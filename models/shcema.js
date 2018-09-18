const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createDate: {type: Date, default: Date.now }
});