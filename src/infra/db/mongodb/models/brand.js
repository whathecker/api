const mongoose = require('../connection');

const Schema = mongoose.Schema;

let brandSchema = new Schema({
    brandName: { 
        type: String, 
        required: true, 
    },
    brandCode: { 
        type: String, 
        require: true, 
        uppercase: true 
    }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;