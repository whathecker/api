const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let itemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });

let subscriptionBoxSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    boxType: { type: String, required: true },
    boxTypeCode: { type: String, required: true },
    items: [itemSchema]
});

subscriptionBoxSchema.plugin(uniqueValidator);

const SubscriptionBox = mongoose.model('SubscriptionBox', subscriptionBoxSchema);


SubscriptionBox.prototype.findPackageType = (skinTypeInput, prefixes) => {
    if (!skinTypeInput) { throw new Error('Invalid param: skinType cannot be empty'); }

    let packageType = null;
    // assign code to skinTypeCode by looking up packageID prefixes
    for (let keyOfprefix in prefixes.boxTypePrefix) {
        if (skinTypeInput === keyOfprefix) {
            packageType = keyOfprefix;
        }
    }
    return packageType;

}

SubscriptionBox.prototype.findPackageTypeCode = (packageTypeInput, prefixes) => {
    if (!packageTypeInput) {
        throw new Error('Invalid param: packageTypeInput cannot be blank');
    }
    return prefixes.boxTypePrefix[packageTypeInput];
}


SubscriptionBox.prototype.createPackageId = (skinTypeCode) => {
    if(!skinTypeCode) { throw new Error('Invalid param: skinTypeCode cannot be empty'); }

    function create5DigitInteger () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    let packageId = '';
    return packageId.concat('PK', skinTypeCode, create5DigitInteger());

}

module.exports = SubscriptionBox;