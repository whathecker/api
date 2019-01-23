const mongoose = require('mongoose');

let apikeySchema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: true },
    key: { type: String, lowercase: false, required: true, unique: true },
    scope: { type: Object },
    isValid: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now }
});

const Apikey = mongoose.model('Apikey', apikeySchema);

module.exports = Apikey;