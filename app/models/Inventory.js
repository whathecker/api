const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let inventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 0 }
    // add carted schema later
    // ref: https://docs.mongodb.com/ecosystem/use-cases/inventory-management/
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;