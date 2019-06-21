const router = require('express').Router(),
    logger = require('../../../utils/logger'),
    SubscriptionBox = require('../../../models/SubscriptionBox'),
    Product = require('../../../models/Product'),
    subscriptionBoxIdPrefixes = require('../../../utils/subscriptionBoxIdPrefixes'),
    apiAuth = require('../../../middlewares/verifyApikey');

router.use(apiAuth);

router.post('/', (req, res, next) => {

    if (!req.body.boxType || !req.body.boxName) {
        logger.warn(`package create request has rejected as param is missing`);
        // to refactor to have more structured error object
        return res.status(400).json({ message: 'bad request' });
    }

    const subscriptionBox = new SubscriptionBox();
    subscriptionBox.boxType = subscriptionBox.findPackageType(req.body.boxType, subscriptionBoxIdPrefixes);
    subscriptionBox.boxTypeCode = subscriptionBox.findPackageTypeCode(subscriptionBox.boxType, subscriptionBoxIdPrefixes);
    subscriptionBox.id = subscriptionBox.createPackageId(subscriptionBox.boxTypeCode);
    subscriptionBox.name = req.body.boxName;
    subscriptionBox.items = [];
    console.log(subscriptionBox.items);
    let queries = [];
    
    

    if (req.body.prices) {
        if (!Array.isArray(req.body.prices)) {
            logger.warn(`package create request has rejected as prices param isn't array`);
            // to refactor to have more structured error object
            return res.status(422).json({ message: 'invalid data' });
        }  

        if (subscriptionBox.isPriceDataValid(req.body.prices)) {

            for (let i = 0; i < req.body.prices.length; i++) {
                const price = req.body.prices[i].price;
                const vatRate = 0.21;
                req.body.prices[i].vat = subscriptionBox.setVat(price, vatRate);
                req.body.prices[i].netPrice = subscriptionBox.setNetPrice(price, vatRate);
            }

            subscriptionBox.prices = req.body.prices
        } else {
            logger.warn(`package create request has rejected as prices param isn't valid`);
            // to refactor to have more structured error object
            return res.status(422).json({ message: 'invalid data' });
        }
    }


    if (req.body.items) {
 
        if (Array.isArray(req.body.items) === false) {
            logger.warn(`package create request has rejected as items param isn't array`);
            // to refactor to have more structured error object
            return res.status(400).json({ message: 'bad request' });
        } 

        for (let i = 0; i < req.body.items.length; i++) {
            let query;
            const productId = req.body.items[i];
            query = Product.findOne({ id: productId });
            queries.push(query);
        }
        //console.log('check the queries out');
        //console.log(queries);

        Promise.all(queries).then((products) => {
            //console.log('resolved array of products');
            //console.log(products);

            for (let i = 0; i < products.length; i++) {
                let item = {};
                item._id = products[i]._id;
                //console.log(item);
                
                subscriptionBox.items.set(i, item);
                
                //subscriptionBox.items.push(item);
                
            }

            //console.log(subscriptionBox.items);
            subscriptionBox.markModified('items');
            //console.log(subscriptionBox);

            subscriptionBox.save().then((subscriptionBox) => {
                logger.info(`new package has created: ${subscriptionBox.id}`);
                return res.status(201).send(subscriptionBox);
            }).catch(next);

        }).catch(next);
    } 
    
    
});

router.get('/', (req, res, next) => {
    // add query param to populate item detail
    SubscriptionBox.find()
        .then((data) => {
            if (!data) {
                logger.warn('request was accepted but no data is returned');
                return res.status(204).json({ message: 'no data' });
            }
            //populate items sub document before sending response to client
            logger.info(`request has succeed`);
            return res.status(200).json(data);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {

});


router.delete('/:id', (req, res, next) => {
    SubscriptionBox.findOneAndRemove({ id: req.params.id })
        .then((subscriptionBox) => {
            if (!subscriptionBox) {
                logger.warn('subscriptionBox delete request has rejected as product is unknown');
                return res.status(204).json({ message: 'can not find subscriptionBox' });
            }
            logger.info(`subscriptionBox delete request has succeed: ${subscriptionBox}`);
            return res.status(200).json(subscriptionBox);
        }).catch(next);
});

module.exports = router;