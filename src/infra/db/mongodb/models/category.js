const mongoose = require('../connection');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categorySchema = new Schema({
    categoryName: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    categoryCode: { 
        type: String, 
        required: true, 
        //unique: true, 
        uppercase: true 
    }
});

categorySchema.plugin(uniqueValidator);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;