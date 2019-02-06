const router = require('express').Router(),
    logger = require('../../../utils/logger'),
    SubscriptionBox = require('../../../models/SubscriptionBox'),
    Product = require('../../../models/Product'),
    subscriptionBoxIdPrefixes = require('../../../utils/subscriptionBoxIdPrefixes');

router.post('/', (req, res, next) => {

    if (!req.body.boxType || !req.body.boxName) {
        logger.warn(`package create request has rejected as param is missing`);
        return res.status(400).json({ message: 'bad request' });
    }

    const subscriptionBox = new SubscriptionBox();
    subscriptionBox.boxType = subscriptionBox.findPackageType(req.body.boxType, subscriptionBoxIdPrefixes);
    subscriptionBox.boxTypeCode = subscriptionBox.findPackageTypeCode(subscriptionBox.boxType, subscriptionBoxIdPrefixes);
    subscriptionBox.id = subscriptionBox.createPackageId(subscriptionBox.boxTypeCode);
    subscriptionBox.name = req.body.boxName;

    let queries = [];
    
    if (req.body.items) {
 
        if (Array.isArray(req.body.items) === false) {
            return res.status(400).json({ message: 'bad request' });
        } 

        for (let i = 0; i < req.body.items.length; i++) {
            let query;
            const productId = req.body.items;
            query = Product.findOne({ id: productId });
            queries.push(query);
        }
        //console.log('check the queries out');
        //console.log(queries);

        Promise.all(queries).then((product_ids) => {
            //console.log('resolved array of products');
            //console.log(product_ids);

            for (let i = 0; i < product_ids.length; i++) {
                let item = {};
                item.product = product_ids[0]._id;
                subscriptionBox.items.push(item);
            }

        }).catch(next);
    } 

    subscriptionBox.save().then((subscriptionBox) => {
        logger.info(`new package has created: ${subscriptionBox}`);
        return res.status(201).send(subscriptionBox);
    }).catch(next);
});

router.delete('/:id', (req, res, next) => {
    SubscriptionBox.findOneAndRemove({ id: req.params.id })
        .then((subscriptionBox) => {
            if (!subscriptionBox) {
                logger.warn('package delete request has rejected as product is unknown')
                return res.status(204).json({ message: 'can not find package' })
            }
            logger.info(`package delete request has succeed: ${subscriptionBox}`);
            return res.status(200).json(subscriptionBox);
        }).catch(next);
});

module.exports = router;