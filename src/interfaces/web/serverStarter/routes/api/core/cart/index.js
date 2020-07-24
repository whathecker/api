const cartDB = require('../../../../../../../infra/data-access/cart-db');
const logger = require('../../../../../../_shared/logger');

let cart = {};

cart.listCarts = async (req, res, next) => {
    try {
        const carts = await cartDB.listCarts();
        logger.info(`listCarts endpoint has processed and returned carts`);
        return res.status(200).json({
            status: "success",
            carts: carts
        });
    } catch (exception) {
        next(exception);
    }
};

cart.getCartById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cart = await cartDB.findCartById(id);
        logger.info(`getCartById request is processed | ${cart._id}`);
        return res.status(200).json(cart);
    } catch (exception) {

        if (exception.status === "fail") {
            logger.warn(`getCartById request is failed | unknown id`);
            return res.status(422).json({
                status: "fail",
                message: exception.reason
            });
        }

        next(exception);
    }
};

cart.createCart = async (req, res, next) => {
    const country = req.body.country;

    if (!country) {
        logger.warn(`createCart request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }
    
    try {
        const payload = req.body;
        const cart = await cartDB.addCart(payload);
        logger.info(`createCart request has created new cart | id: ${cart._id}`);
        return res.status(201).json({
            status: "success",
            cart: cart,
            message: "new cart created"
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createCart request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }
};

cart.updateCartState = async (req, res, next) => {
    const id = req.params.id;
    const newCartState = req.body.cartState;

    if (!newCartState) {
        logger.warn(`updateCartState request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedCart = await cartDB.updateCartState(id, newCartState);
        logger.info(`updateCartState request has updated state of the cart | cart_id: ${updatedCart._id} | updated state: ${updatedCart.cartState}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart state has updated'
        });

    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateCartState request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.updateCartLineItems = async (req, res, next) => {
    const id = req.params.id;
    const newLineItems = req.body.lineItems;

    if (!newLineItems || !Array.isArray(newLineItems)) {
        logger.warn(`updateCartLineItems request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedCart = await cartDB.updateCartLineItems(id, newLineItems);
        logger.info(`updateCartLineItems request has updated lineItems of the cart | cart_id: ${updatedCart._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart lineItems has updated'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateCartLineItems request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.updateCartLineItemQty = async (req, res, next) => {
    const id = req.params.id;
    const itemId = req.body.itemId;
    const quantity = req.body.quantity;

    if (!itemId || !quantity) {
        logger.warn(`updateCartLineItems request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const update = {
            itemId: itemId,
            quantity: quantity
        };
        const updatedCart = await cartDB.updateCartLineItemQty(id, update);
        logger.info(`updateCartLineItemQty request has updated lineItems of the cart | cart_id: ${updatedCart._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart lineItems (QTY) has updated'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateCartLineItemQty request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.updateCartOwnership = async (req, res, next) => {
    const id = req.params.id;
    const newCartState = req.body.cartState;

    if (!newCartState) {
        logger.warn(`updateCartOwnership request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedCart = await cartDB.updateCartOwnership(id, newCartState);
        logger.info(`updateCartOwnership request has updated lineItems of the cart | cart_id: ${updatedCart._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart ownership has updated'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateCartOwnership request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.updateShippingInfo = async (req, res, next) => {
    const id = req.params.id;
    const newShippingInfo = req.body.shippingInfo;

    if (!newShippingInfo) {
        logger.warn(`updateShippingInfo request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedCart = await cartDB.updateCartShippingInfo(id, newShippingInfo);
        logger.info(`updateShippingInfo request has updated shippingInfo of the cart | cart_id: ${updatedCart._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart shippingInfo has updated'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateShippingInfo request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.updatePaymentInfo = async (req, res, next) => {
    const id = req.params.id;
    const newPaymentInfo = req.body.paymentInfo;

    if (!newPaymentInfo) {
        logger.warn(`updatePaymentInfo request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedCart = await cartDB.updateCartPaymentInfo(id, newPaymentInfo);
        logger.info(`updatePaymentInfo request has updated paymentInfo of the cart | cart_id: ${updatedCart._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'cart paymentInfo has updated'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updatePaymentInfo request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } else {
            next(exception);
        }
    }
};

cart.deleteCartById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cart = await cartDB.deleteCartById(id);
        logger.info(`deleteCartById request has processed: following cart has removed: ${cart._id}`);
        return res.status(200).json({
            status: "success",
            message: "cart has removed"
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.warn(`deleteCartById request has rejected as cart is unknonw`);
            return res.status(422).json({
                status: "fail",
                message: exception.reason
            });
        }    
        next(exception);
    }
};

module.exports = cart;