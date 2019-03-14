const router = require('express').Router(),
    Product = require('../../../models/Product'),
    logger = require('../../../utils/logger'),
    productIdPrefixes = require('../../../utils/productIdPrefixes');

// add auth middleware in this route
router.post('/', (req, res, next) => {

    if (!req.body.name || !req.body.description || !req.body.category || !req.body.brand) {
        logger.warn(`product create request has rejected as param is missing`);
        return res.status(400).json({ message: 'bad request' });
    }

    const product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = product.findCategory(req.body.category, productIdPrefixes);
    product.categoryCode = product.findCategoryCode(product.category, productIdPrefixes);
    product.brand = product.findBrand(req.body.brand, productIdPrefixes);
    product.brandCode = product.findBrandCode(product.brand, productIdPrefixes);

    if (req.body.volume) {
        // set accepted values
        product.volume = req.body.volume;
    }
    if (req.body.skinType) {

        if (product.isSkintypeValid(req.body.skinType)) {
            product.skinType = req.body.skinType 
        } else {
            return res.status(422).json({ message: 'invalid data' });
        }
         
    }
    if (req.body.prices) {

        if (!Array.isArray(req.body.prices)) {
            return res.status(422).json({ message: 'invalid data' });
        }

        if (product.isPriceDataValid(req.body.prices)) {
            product.prices = req.body.prices
        } else {
            return res.status(422).json({ message: 'invalid data' });
        }
        
    }
    
    product.id = product.createProductId(product.brandCode, product.categoryCode);

    product.save().then((product) => {
        logger.info(`new product has created: ${product}`);
        return res.status(201).send(product);
    }).catch(next);

});

router.put('/:id', (req, res, next) => {
    if (!req.params.id || !req.body.update) {
        logger.warn(`product update request has rejected as param is missing`);
        return res.status(400).json({ message: 'bad request' });
    }

    Product.findOneAndUpdate({ id: req.params.id }, req.body.update)
        .then((product) => {
            if(!product) {
                logger.warn(`product update request has rejected as product id is unknown`);
                return res.status(204).json({ message: `can not find product` });
            }
            logger.info(`product update has succeed: ${product}`);
            return res.status(200).send(product);
        }).catch(next);
});

router.get('/:id', (req, res, next) => {

    /*
    if (!req.params.id) {
        logger.warn(`product get request has rejected as param is missing`);
        return res.status(400).json({ message: 'bad request' });
    } */

    Product.findOne({ id: req.params.id })
        .then((product) => {
            if (!product) {
                logger.warn(`product get request has rejected as product id is unknown`)
                return res.status(204).json({ message: 'can not find product'});
            }
            logger.info(`product get has succeed: ${product}`);
            return res.status(200).send(product);
        }).catch(next);
});

router.delete('/:id', (req, res, next) => {
    /*
    if (!req.params.id) {
        logger.warn('product delete request has rejected as id param is missing');
        return res.status(400).json({ message: 'bad request' });
    }*/

    Product.findOneAndRemove({ id: req.params.id })
        .then((product)=> {
            if (!product) {
                logger.warn('product delete request has rejected as product is unknown')
                return res.status(204).json({ message: 'can not find product' })
            }
            logger.info(`product delete request has succeed: ${product}`);
            return res.status(200).json(product);
        }).catch(next);
});

module.exports = router;