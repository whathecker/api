const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let addressSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    firstName: { type: String, require: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String }, 
    postalCode: { type: String, required: true },
    houseNumber: { type: String, required: true },
    houseNumberAdd: { type: String },
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String },
    country: { type: String, required: true }
});
addressSchema.plugin(uniqueValidator);
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;