const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let inventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 0 },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
    // add carted schema later
    // ref: https://docs.mongodb.com/ecosystem/use-cases/inventory-management/
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;