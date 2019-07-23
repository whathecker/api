const SubscriptionBox = require('../../models/SubscriptionBox');
const SkinType = require('../../models/SkinType');
const logger = require('../../utils/logger');

async function createSubscriptionBox (req, res, next) {
    if (!req.body.boxType || !req.body.name || !req.body.prices || !req.body.items) {
        logger.warn(`createSubscriptionBox request has rejected | bad request`);
        // to refactor to have more structured error object
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    const subscriptionBox = new SubscriptionBox();
    const boxType = await SkinType.findOne({ skinType: req.body.boxType }).exec();
    subscriptionBox.boxType = boxType.skinType;
    subscriptionBox.boxTypeCode = boxType.skinTypeCode;
    subscriptionBox.id = subscriptionBox.createPackageId(subscriptionBox.boxTypeCode);
    subscriptionBox.name = req.body.name;

    // update prices field
    if (!Array.isArray(req.body.prices)) {
        logger.warn(`createSubscriptionBox request has rejected as prices param isn't array`);
        return res.status(422).json({ 
            status: 'failed',
            message: 'invalid data' 
        });
    }
    const isPriceDataValid = subscriptionBox.isPriceDataValid(req.body.prices);
    if (!isPriceDataValid) {
        logger.warn(`createSubscriptionBox request has rejected as prices param isn't valid`);
        return res.status(422).json({ 
            status: 'failed',
            message: 'invalid price format' 
        });
    }
    if (isPriceDataValid) {
        for (let i = 0; i < req.body.prices.length; i++) {
            const price = req.body.prices[i].price;
            const vatRate = 0.21;
            req.body.prices[i].vat = subscriptionBox.setVat(price, vatRate);
            req.body.prices[i].netPrice = subscriptionBox.setNetPrice(price, vatRate);
        }
        subscriptionBox.prices = req.body.prices
    }
    

    // update items field
    if (Array.isArray(req.body.items) === false) {
        logger.warn(`createSubscriptionBox request has rejected as items param isn't array`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });  
    }

    let newItemsToUpdate = [];

    const items = req.body.items;
    items.forEach((item) => {
        const _id = item._id;
        newItemsToUpdate.push(_id);
    });

    subscriptionBox.items = newItemsToUpdate;

    subscriptionBox.save().then((subscriptionBox) => {
        logger.info(`createSubscriptionBox request has processed | new package: ${subscriptionBox.id}`);
        return res.status(201).json({
            status: 'success',
            message: 'new box created'
        });
    });


}

module.exports = createSubscriptionBox;