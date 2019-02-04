const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let inventorySchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 0 }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;