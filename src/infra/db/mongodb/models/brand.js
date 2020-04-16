const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let brandSchema = new Schema({
    brandName: { 
        type: String, 
        required: true, 
        unique: true 
    },
    brandCode: { 
        type: String, 
        require: true, 
        unique: true, 
        uppercase: true 
    }
});

brandSchema.plugin(uniqueValidator);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;