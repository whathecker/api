const mongoose = require('../connection');

const Schema = mongoose.Schema;

let lineItemSchema =  new Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, lowercase: true },
    originalPrice: { type: String, required: true, default: "0.00" },
    discount: { type: String, required: true, default: "0.00" },
    vat: { type: String, required: true, default: "0.00" },
    grossPrice: { type: String, required: true, default: "0.00" },
    netPrice: { type: String, required: true, default: "0.00" },
    sumOfDiscount: { type: String, required: true, default: "0.00" },
    sumOfVat : { type: String, required: true, default: "0.00" },
    sumOfGrossPrice: { type: String, required: true, default: "0.00" },
    sumOfNetPrice: { type: String, required: true, default: "0.00" },
}, { _id: false });

let orderAmountSchema = new Schema({
    currency: { type: String, required: true, lowercase: true },
    totalDiscount: { type: String, required: true, default: "0.00" },
    totalVat: { type: String, required: true, default: "0.00" },
    totalAmount: { type: String, required: true, default: "0.00" },
    totalNetPrice: { type: String, required: true, default: "0.00" }
}, { _id: false });

let addressSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: { type: String }, 
    postalCode: { type: String },
    houseNumber: { type: String },
    houseNumberAdd: { type: String },
    streetName: { type: String },
    country: { type: String }
}, { _id: false });

let shippingPriceSchema = new Schema({
    currency: { type: String, required: true, lowercase: true },
    price: { type: String, required: true, default: "0.00" },
}, { _id: false});

let shippingInfoSchema = new Schema({
    shippingMethod: { type: String, required: true },
    price: shippingPriceSchema
}, { _id: false });

let paymentInfoSchema = new Schema({
    paymentMethodType: { type: String, required: true },
    paymentId: { type: String, required: true }
}, { _id: true });

let cartSchema = new Schema({
    country: { type: String, required: true },
    cartState: { type: String },
    user_id: { type: String },
    anonymous_id: { type: String },
    isSubscription: { type: Boolean },
    lineItems: [lineItemSchema],
    totalPrice: orderAmountSchema,
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    shippingInfo: shippingInfoSchema,
    paymentInfo: paymentInfoSchema,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;