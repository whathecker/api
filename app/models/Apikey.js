const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let apikeySchema = new Schema({
    name: { type: String, lowercase: true, required: [ true, 'apikey name cannot be blank' ], unique: true },
    key: { type: String, lowercase: false, required: [ true, 'apikey value cannot be blank' ], unique: true },
    scope: { type: Object },
    isValid: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now }
});

apikeySchema.plugin(uniqueValidator);

const Apikey = mongoose.model('Apikey', apikeySchema);

module.exports = Apikey;