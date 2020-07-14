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
        return Promise.reject({
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

const updateCartLineItems = async (id, payload = []) => {
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "cart not found"
        });
    }

    const newLineItems = payload;
    const newTotalPrice = _recalculateTotalPrice(newLineItems);

    let updatedPayload = rest;
    updatedPayload.lineItems = newLineItems;
    updatedPayload.totalPrice = newTotalPrice;

    const cartObj = createCartObj(updatedPayload);

    if (cartObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: cartObj
        });
    }

    const updatedCart = {
        _id: _id,
        ...cartObj
    };
    const index_in_db_array = parseInt(_id) - 1;
    CARTS[index_in_db_array] = updatedCart;
    
    return Promise.resolve(CARTS[index_in_db_array]);
};

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
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "cart not found"
        });
    }

    const newCartState = payload;

    try {
        _verifyCartState(newCartState, cart.cartState);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    };

    let updatedPayload = rest;
    updatedPayload.cartState = newCartState;

    const cartObj = createCartObj(updatedPayload);

    if (cartObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: cartObj
        });
    }

    const updatedCart = {
        _id: _id,
        ...cartObj
    };
    const index_in_db_array = parseInt(_id) - 1;
    CARTS[index_in_db_array] = updatedCart;
    
    return Promise.resolve(CARTS[index_in_db_array]);
};

function _verifyCartState(newState, state) {
    if (state === "ORDERED" || state === "MERGED") {
        throw new Error('db access for updating cart object failed: cannot update cartState for ORDERED or MERGED cart');
    } 
    if (newState === "MERGED" && state === "ACTIVE") {
        throw new Error('db access for updating cart object failed: cannot update cartState from ACTIVE to MERGE, use updateCartOwnership method');
    }
    return;
}

const updateCartOwnership = async (id, payload) => {

};

const updateCartShippingInfo = async (id, payload) => {

};

const updateCartPaymentInfo = async (id, payload) => {

};



const deleteCartById = async (id) => {
    const cart = await findCartById(id);

    const { status } = cart;

    if (status === "fail") {
        return Promise.reject({
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
    updateCartLineItems,
    updateCartState,
    addCart,
    deleteCartById,
    dropAll
};



