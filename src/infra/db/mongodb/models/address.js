const mongoose = require('../connection');

const Schema = mongoose.Schema;

let addressSchema = new Schema({
    user_id: { type: String, required: true }, 
    firstName: { type: String, require: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String }, 
    postalCode: { type: String, required: true },
    houseNumber: { type: String, required: true },
    houseNumberAdd: { type: String, required: true },
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String },
    country: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;