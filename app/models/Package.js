const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let packageSchema = new Schema({
    packageId: { type: String, required: true, unique: true, index: true },
    packageType: { type: String, required: true },
    items: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
    ]
});

packageSchema.plugin(uniqueValidator);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;