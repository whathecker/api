const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let addressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: { type: String }, 
    postalCode: { type: String },
    houseNumber: { type: String },
    houseNumberAdd: { type: String },
    streetName: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String }
});
addressSchema.plugin(uniqueValidator);
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;