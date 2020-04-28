const mongoose = require('../connection');

const Schema = mongoose.Schema;

let categorySchema = new Schema({
    categoryName: { 
        type: String, 
        required: true, 
    },
    categoryCode: { 
        type: String, 
        required: true, 
        uppercase: true 
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;