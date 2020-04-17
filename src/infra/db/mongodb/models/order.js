const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let orderSchema = new Schema({
    country: { type: String, required: true },
    orderNumber: { 
        type: String, 
        required: [ true, "order number can't be blank" ], 
        unique: true, 
        index: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        required: [ true, "user id can't be blank" ], 
        ref: 'User' 
    },
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    isSubscription: { type: Boolean, default: false },
    orderStatus: orderStatusSchema,
    orderStatusHistory: [orderStatusSchema],
    paymentMethod: paymentMethodSchema,
    paymentStatus: paymentStatusSchema,
    paymentHistory: [paymentStatusSchema],
    creationDate: { type: Date, default: Date.now },
    deliverySchedule: { type: Date },
    isShipped: { type: Boolean, default: false },
    shippedDate: { type: Date },
    courier: { type: String, enum: ['DHL'] },
    trackingNumber: [{ type: String }],
    isConfEmailDelivered: { type: Boolean, default: false },
    deliveredDate: { type: Date },
    lastModified: { type: Date, default: Date.now },
    orderAmountPerItem: [itemAmountSchema],
    orderAmount: orderAmountSchema,
    shippedAmountPerItem: [itemAmountSchema],
    shippedAmount: orderAmountSchema,
    invoiceNumber: { 
        type: String, 
        unique: true
    }
});

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

let paymentMethodSchema = new Schema({
    type: { type: String, required: true },
    recurringDetail: { type: String }
}, { _id: false });

let paymentStatusSchema = new Schema({
    status: { 
        type: String,
        required: true,
        uppercase: true,
        enum: [
            'OPEN', 
            'AUTHORIZED', 
            'PENDING', 
            'REFUSED', 
            'CANCELLED', 
            'REFUNDED'
        ],
        default: 'OPEN'
    },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

let orderStatusSchema = new Schema({
    status: { 
        type: String,
        required: true,
        uppercase: true,
        enum: [
            'RECEIVED',
            'PENDING', 
            'PAID', 
            'SHIPPED', 
            'CANCELLED', 
            'OVERDUE'
        ],
        default: 'RECEIVED'
    },
    timestamp: { type: Date, default: Date.now }
},{ _id: false });

let itemAmountSchema = new Schema ({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { 
        type: Number, 
        required: true, 
        default: 1
    },
    currency: { 
        type: String, 
        required: true,
        lowercase: true 
    },
    originalPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    discount: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    vat: { 
        type: String, 
        required: true, 
        default: "0.00"
    },
    grossPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    netPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    sumOfDiscount: { 
        type: String, 
        required: true, 
        default: "0.00"
    },
    sumOfVat : { 
        type: String, 
        required: true, 
        default: "0.00"
    },
    sumOfGrossPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    sumOfNetPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
}, { _id: false });

let orderAmountSchema = new Schema({
    currency: { 
        type: String, 
        required: true, 
        lowercase: true 
    },
    totalDiscount: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    totalVat: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    totalAmount: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    totalNetPrice: { 
        type: String, 
        required: true, 
        default: "0.00" 
    }
}, { _id: false });


orderSchema.plugin(uniqueValidator);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;