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
            reason: "cart not found"
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

    try {
        _verifyCartState(cart.cartState);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    };

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

const updateCartLineItemQty = async (id, payload) => {
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "cart not found"
        });
    }

    let newLineItems;
    let newTotalPrice;

    try {
        const itemId = payload.itemId;
        const quantity =  payload.quantity;
        _verifyCartState(cart.cartState);
        newLineItems = _findAndUpdateItemInLineItems(cart.lineItems, itemId, quantity);
        newTotalPrice = _recalculateTotalPrice(newLineItems);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    };

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

function _findAndUpdateItemInLineItems(lineItems, itemId, qty) {
    const index = lineItems.findIndex(item => {
        return item.itemId === itemId;
    });

    if (index === -1) {
        throw new Error("db access for cart object failed: cannot find item in lineItems")
    }

    if (qty === 0) {
        lineItems.splice(index, 1);
        return lineItems;
    }

    const newSumOfGrossPrice = _multiplyPriceByQty(lineItems[index].grossPrice, qty);
    const newSumOfNetPrice = _multiplyPriceByQty(lineItems[index].netPrice, qty);
    const newSumOfVat = _multiplyPriceByQty(lineItems[index].vat, qty);
    const newSumOfDiscount = _multiplyPriceByQty(lineItems[index].discount, qty);

    lineItems[index].quantity = qty;
    lineItems[index].sumOfGrossPrice = newSumOfGrossPrice;
    lineItems[index].sumOfNetPrice = newSumOfNetPrice;
    lineItems[index].sumOfVat = newSumOfVat;
    lineItems[index].sumOfDiscount = newSumOfDiscount;
    return lineItems;
}

function _multiplyPriceByQty (price, quantity) {
    price = Number(price);

    let computedPrice = price * quantity;

    return computedPrice.toFixed(2);
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
        _isCartMerging(newCartState, cart.cartState);
        _verifyCartState(cart.cartState);
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

function _isCartMerging (newState, state) {
    if (newState === "MERGED" && state === "ACTIVE") {
        throw new Error('db access for updating cart object failed: cannot update cartState from ACTIVE to MERGE, use updateCartOwnership method');
    }
}

function _verifyCartState (state) {
    if (state === "ORDERED" || state === "MERGED") {
        throw new Error('db access for updating cart object failed: cannot update cartState for ORDERED or MERGED cart');
    }
}

const updateCartOwnership = async (id, payload) => {
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
        _verifyCartState(cart.cartState);
        _verifyCartOwnership(cart.user_id);
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

function _verifyCartOwnership (user_id) {
    if (user_id) {
        throw new Error('db access for updating cart object failed: cannot update cartOwnership for cart already belong to user'); 
    }
}

const updateCartShippingInfo = async (id, payload) => {
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "cart not found"
        });
    }

    try {
        _verifyCartState(cart.cartState);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    };

    const newShippingInfo = payload;
    let updatedPayload = rest;
    updatedPayload.shippingInfo = newShippingInfo;

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

const updateCartPaymentInfo = async (id, payload) => {
    const cart = await findCartById(id);
    const { status, _id, ...rest } = cart;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "cart not found"
        });
    }

    try {
        _verifyCartState(cart.cartState);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    };

    const newPaymentInfo = payload;
    let updatedPayload = rest;
    updatedPayload.paymentInfo = newPaymentInfo;

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
    addCart,
    updateCartLineItems,
    updateCartLineItemQty,
    updateCartState,
    updateCartOwnership,
    updateCartShippingInfo,
    updateCartPaymentInfo,
    deleteCartById,
    dropAll
};



