const Billing = require('../../../models/Billing');

const billingInterface = {};

/**
 * public method: createBillingInstance
 * @param {Object} paymentDetail 
 * Object contain following fields: 
 * card object contains brand name of credit card,
 * payment_method field which is unique_id of payment_method field from Stripe
 * 
 * @param {String} user_id 
 * object_id of User instance associated with the Billing instance to be created
 * 
 * Return: new instance of Billing
 */

billingInterface.createBillingInstance = (paymentDetail, user_id) => {
    
    if (!paymentDetail) {
        throw new Error('Missing argument: cannot create Billing instance without paymentDetail argument');
    }

    if (!user_id) {
        throw new Error('Missing argument: cannot create Billing instance without user_id');
    }

    const billing = new Billing();
    billing.user = user_id;
    billing.type = paymentDetail.card.brand;
    billing.billingId = paymentDetail.payment_method;

    return billing;
    
}

module.exports = billingInterface;