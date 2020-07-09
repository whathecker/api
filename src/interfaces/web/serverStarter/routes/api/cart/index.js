const cartDB = require('../../../../../../infra/data-access/cart-db');
const logger = require('../../../../../_shared/logger');

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

        if (cart.status === "fail") {
            logger.warn(`getCartById request is failed | unknown id`);
            return res.status(422).json({
                status: "fail",
                message: cart.reason
            });
        }

        logger.info(`getCartById request is processed | ${cart._id}`);
        return res.status(200).json(cart);
    } catch (exception) {
        next(exception);
    }
};

cart.createCart = async (req, res, next) => {
    const country = req.body.country;

    if (!country) {
        logger.warn(`createCart request has rejected as param is missing`);
        return res.status(400).json({
            status: "failed",
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

cart.deleteCartById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cart = await cartDB.deleteCartById(id);

        if (cart.status === "fail") {
            logger.warn(`deleteCartById request has rejected as cart is unknonw`);
            return res.status(422).json({
                status: "fail",
                message: cart.reason
            });
        }

        logger.info(`deleteCartById request has processed: following cart has removed: ${cart._id}`);
        return res.status(200).json({
            status: "success",
            message: "cart has removed"
        });
    } catch (exception) {
        next(exception);
    }
};

module.exports = cart;