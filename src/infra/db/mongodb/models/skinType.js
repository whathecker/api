const mongoose = require('../connection');

const Schema = mongoose.Schema;

let skinTypeSchema = new Schema({
    skinType : { 
        type: String, 
        required: true, 
        lowercase: true, 
        unique: true,
        enum: ['dry', 'normal', 'oily'] // remove it?
    },
    skinTypeCode: { 
        type: String, 
        required: true, 
        uppercase: true,
        unique: true 
    }
});

const SkinType = mongoose.model('SkinType', skinTypeSchema);

module.exports = SkinType;