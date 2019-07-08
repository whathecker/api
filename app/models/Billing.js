const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let billingSchema =  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    recurringDetail: { type: String, default: '' },
    billingId: { type: String, unique: true }
});

billingSchema.plugin(uniqueValidator);
const Billing = mongoose.model('Billing', billingSchema);

function create5DigitInteger () {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return num.toString();
}

Billing.prototype.setBillingId = () => {
    let prefix = "BL";
    const random5digitsInt = create5DigitInteger();
    const currentDate = new Date(Date.now());
    const year = currentDate.getFullYear().toString().slice(2);
    let month;
    let seconds;

    if (currentDate.getMonth() < 10) {
        month = "0" + currentDate.getMonth().toString();
    } else {
        month = currentDate.getMonth().toString();
    }

    if (currentDate.getSeconds() < 10) {
        seconds = "0" + currentDate.getSeconds().toString();
    } else {
        seconds = currentDate.getSeconds().toString();
    }
    return prefix.concat(month, year, seconds,random5digitsInt);
}
module.exports = Billing;