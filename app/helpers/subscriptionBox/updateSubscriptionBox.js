const SubscriptionBox = require('../../models/SubscriptionBox');
const SkinType = require('../../models/SkinType');
const logger = require('../../utils/logger');

async function updateSubscriptionBox (req, res, next) {
    if (!req.params.id) {
        logger.warn(`updateSubscriptionBox request has rejected as param is missing`);
        return res.status(400).json({ 
            status: "failed",
            message: 'bad request' 
        });
    }

    
    const boxType = await SkinType.findOne({ skinType: req.body.boxType }).exec();

    SubscriptionBox.findOne({ id: req.params.id })
    .then((box) => {
        if (!box) {
            logger.warn(`updateSubscriptionBox request has rejected as product id is unknown`);
            return res.status(422).json({ 
                status: 'failed',
                message: `unknonw subscriptionBox id` 
            });
        }
        if (box) {
            if (req.body.name) {
                box.name = req.body.name;
                box.markModified('name');
            }

            if (req.body.boxType) {
                box.boxType = boxType.skinType;
                box.boxTypeCode = boxType.skinTypeCode;
                box.markModified('boxType');
                box.markModified('boxTypeCode');
            }

            if (req.body.items) {
                let newItemsToUpdate = [];
                const items = req.body.items;
                items.forEach(item => {
                    const _id = item._id;
                    newItemsToUpdate.push(_id);
                });
                box.items = newItemsToUpdate;
                box.markModified('items');
            }

            if (req.body.prices) {
                const isPriceDataValid = box.isPriceDataValid(req.body.prices);
                if (!isPriceDataValid) {
                    logger.warn(`updateSubscriptionBox request has rejected as prices param isn't valid`);
                    return res.status(422).json({ 
                        status: 'failed',
                        message: 'invalid price format' 
                    });
                }
                if (isPriceDataValid) {
                    for (let i = 0; i < req.body.prices.length; i++) {
                        const price = req.body.prices[i].price;
                        const vatRate = 0.21;
                        req.body.prices[i].vat = box.setVat(price, vatRate);
                        req.body.prices[i].netPrice = box.setNetPrice(price, vatRate);
                    }
                    box.prices = req.body.prices;
                    box.markModified('prices');
                }
            }
            box.lastModified = Date.now();
            box.markModified('lastModified');
            box.save().then(() => {
                return res.status(200).json({
                    status: 'success',
                    message: 'subscriptionBox data is updated'
                });
            });
        }
    }).catch(next);


    /*

    SubscriptionBox.findOneAndUpdate({ id: req.params.id }, update)
    .then((subscriptionBox) => {
        if(!subscriptionBox) {
            logger.warn(`updateSubscriptionBox request has rejected as product id is unknown`);
            return res.status(204).json({ 
                status: 'failed',
                message: `can not find product` 
            });
        }
        logger.info(`updateSubscriptionBox has succeed: ${subscriptionBox.id}`);
        return res.status(200).json({
            status: "success",
            subscriptionBox: subscriptionBox,
            message: 'subscriptionBox data is updated'
        });
    }) */
}

module.exports = updateSubscriptionBox;