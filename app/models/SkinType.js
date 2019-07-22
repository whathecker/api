const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let skinTypeSchema = new Schema({
    skinType : { 
        type: String, 
        required: true, 
        lowercase: true, 
        unique: true,
        enum: ['dry', 'normal', 'oily'] 
    }
});

const SkinType = mongoose.model('SkinType', skinTypeSchema);

module.exports = SkinType;