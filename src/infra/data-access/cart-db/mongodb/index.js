const Cart = require('../../../db/mongodb/models/cart');
const createCartObj = require('../../../../domain/cart');
const serializer = require('./serializer');

const listCarts = async () => {
    const carts = await Cart.find();
    return Promise.resolve(serializer(carts));
};

const findCartById = async (id) => {
    try {
        const cart = await Cart.findOne({ _id: id });

        if (!cart) {
            return Promise.resolve({
                status: "fail",
                reason: "cart not found"
            });
        }

        return Promise.resolve(serializer(cart));
    } catch (err) {
        return Promise.resolve({
            status: "fail",
            reason: err
        });
    }
};

const addCart = async (payload) => {

    const cartObj = createCartObj(payload);

    if (cartObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: cartObj
        });
    }

    try {
        if (cartObj.anonymous_id) {
            await _isAnonymousIdUnique(cartObj.anonymous_id);
        }
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newCart = await Cart.create(cartObj);

    return Promise.resolve(serializer(newCart));
};

async function _isAnonymousIdUnique (anonymous_id) {
    const cart = await Cart.findOne({ anonymous_id: anonymous_id });

    if (!cart) return;

    throw new Error("db access for cart object failed: anonymous_id must be unique if exist");
};

const updateCartLineItems = async (id, payload) => {
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    console.log(rest);

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "cart not found"
        });
    }

    const newLineItems = payload;
    const newTotalPrice = _recalculateTotalPrice(newLineItems);

    let updatedPayload = rest;
    updatedPayload.lineItems = newLineItems;
    updatedPayload.totalPrice = newTotalPrice;
    updatedPayload = _removeNullFields(updatedPayload);

    const cartObj = createCartObj(updatedPayload);

    if (cartObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: cartObj
        });
    }

    const updatedCart = await Cart.findByIdAndUpdate(_id, cartObj, { new: true });

    return Promise.resolve(serializer(updatedCart));
};

function _removeNullFields (input) {
    let output = input;
    for (let prop of Object.keys(output)) {
        if (output[prop] === null) {
            delete output[prop];
        }
    }
    return output;
}

function _recalculateTotalPrice (lineItems) {
    let discounts = [];
    let vats = [];
    let netPrices = [];
    let grossPrices = [];
    
    for (let i = 0; i < lineItems.length; i++) {
        grossPrices.push(Number(lineItems[i].sumOfGrossPrice));
        netPrices.push(Number(lineItems[i].sumOfNetPrice));
        vats.push(Number(lineItems[i].sumOfVat));
        discounts.push(Number(lineItems[i].sumOfDiscount));
    }

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const totalAmount = grossPrices.reduce(reducer).toFixed(2);
    const totalDiscount = discounts.reduce(reducer).toFixed(2);
    const totalVat = vats.reduce(reducer).toFixed(2);
    const totalNetPrice = netPrices.reduce(reducer).toFixed(2);

    return {
        currency: lineItems[0].currency,
        totalAmount: totalAmount,
        totalDiscount: totalDiscount,
        totalVat: totalVat,
        totalNetPrice: totalNetPrice
    };
};

const updateCartState = async (id, payload) => {

};

const updateCartOwnership = async (id, payload) => {

};

const updateCartShippingInfo = async (id, payload) => {

};

const updateCartPaymentInfo = async (id, payload) => {

};

const deleteCartById = async (id) => {
    try {
        const removedCart = await Cart.findOneAndRemove({ _id: id });
        if (!removedCart) {
            return Promise.resolve({
                status: "fail",
                reason: "order not found"
            });
        }
    
        if (removedCart) {
            return Promise.resolve({
                id: removedCart._id,
                status: "success"
            });
        }
    } catch (err) {
        return Promise.resolve({
            status: "fail",
            reason: err
        });
    }
};

const dropAll = async () => {
    return Cart.remove();
};

module.exports = {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    deleteCartById,
    dropAll
};