const Cart = require('../../../db/mongodb/models/cart');
const createCartObj = require('../../../../domain/cart');
const serializer = require('./serializer');

const listCarts = async () => {
    const carts = await Cart.find();
    return Promise.resolve(serializer(carts));
};

const findCartById = async (id) => {
    const cart = await Cart.findById(id);

    if (!cart) {
        return Promise.resolve({
            status: "fail",
            reason: "cart not found"
        });
    }

    return Promise.resolve(serializer(cart));
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

const deleteCartById = async (id) => {
    const removedCart = await Cart.findByIdAndRemove(id);

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
};

const dropAll = async () => {
    return Cart.remove();
};

module.exports = {
    listCarts,
    findCartById,
    addCart,
    deleteCartById,
    dropAll
};