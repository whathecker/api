const router = require('express').Router();
const logger = require('../../../utils/logger');
const SubscriptionBox = require('../../../models/SubscriptionBox');
const Product = require('../../../models/Product');
const subscriptionBoxIdPrefixes = require('../../../utils/subscriptionBoxIdPrefixes');
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptionBoxes = require('../../../helpers/subscriptionBox/getSubscriptionBoxes');
const getSubscriptionBoxById = require('../../../helpers/subscriptionBox/getSubscriptionBoxById');
const createSubscriptionBox = require('../../../helpers/subscriptionBox/createSubscriptionBox');

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
// no admin auth as it's consumed at checkout

router.get('/', getSubscriptionBoxes);
router.get('/subscriptionBox/:id', adminAuth, getSubscriptionBoxById);
router.post('/subscriptionBox', adminAuth, createSubscriptionBox);

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