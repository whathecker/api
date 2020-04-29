const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let skinTypeSchema = new Schema({
    skinType : { 
        type: String, 
        required: true, 
        lowercase: true, 
        //unique: true,
        enum: ['dry', 'normal', 'oily'] 
    },
    skinTypeCode: { 
        type: String, 
        required: true , 
        uppercase: true ,
        //unique: true 
    }
});

const SkinType = mongoose.model('SkinType', skinTypeSchema);

SkinType.prototype.setSkinTypeCode = (skinType) => {
    let skinTypeCode = null;
    switch (skinType) {
        case 'dry':
            skinTypeCode = 'DR';
            break;
        case 'oily':
            skinTypeCode = 'OL';
            break;
        case 'normal':
            skinTypeCode = 'NM';
            break;
        default:
            new Error('unknonw or invalid skinType input');
            break;
    }
    return skinTypeCode;
}
module.exports = SkinType;