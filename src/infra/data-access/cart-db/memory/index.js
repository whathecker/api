let CARTS = require('../../../db/memory/cart');
const createCartObj = require('../../../../domain/cart');

const listCarts = () => {
    return Promise.resolve(CARTS);
};

const findCartById = (id) => {
    const cart = CARTS.find(cart => {
        return cart._id === id;
    });

    if (!cart) {
        return Promise.resolve({
            status: "fail",
            reason: "order not found"
        });
    }

    return Promise.resolve(cart);
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

    const new_id = CARTS.length + 1;

    const newCart = {
        _id: new_id.toString(),
        ...cartObj
    };
    CARTS.push(newCart);

    return Promise.resolve(CARTS[CARTS.length - 1]);
};

function _isAnonymousIdUnique (anonymous_id) {
    const cart = CARTS.find(cart => {
        return cart.anonymous_id === anonymous_id;
    });

    if (cart === undefined) return;

    throw new Error("db access for cart object failed: anonymous_id must be unique if exist");
}

const deleteCartById = async (id) => {
    const cart = await findCartById(id);

    const { status } = cart;

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "cart not found"
        });
    }

    let deletedCart;
    CARTS = CARTS.filter(cart => {

        if (cart._id !== id) {
            return true;
        }

        if (cart._id === id) {
            deletedCart = cart;
            return false;
        }
    });

    return Promise.resolve({
        id: deletedCart._id,
        status: "success"
    });
};

const dropAll = () => {
    CARTS = [];
    return Promise.resolve(CARTS);
};

module.exports = {
    listCarts,
    findCartById,
    addCart,
    deleteCartById,
    dropAll
};



