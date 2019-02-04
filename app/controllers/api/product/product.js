const router = require('express').Router(),
    Product = require('../../../models/Product'),
    logger = require('../../../utils/logger'),
    productIdPrefixes = require('../../../utils/productIdPrefixes');


function findCategory (categoryInput) {
    for (let category in productIdPrefixes.categoryPrefix) {
        console.log(category);
        if (categoryInput === category) {
            return category;
        }
    }
    // or throw error here?
    return null;
}

function findCategoryCode (categoryNameInput) {
    if (!categoryNameInput) {
        throw new Error('Invalid Param: categoryNameInput cannot be blank');
    }
    return productIdPrefixes.categoryPrefix[categoryNameInput];
}

function findBrand (brandInput) {
    for (let brand in productIdPrefixes.brandPrefix) {
        console.log(brand);
        if (brandInput === brand) {
            return brand;
        }
    }
    // or throw error here?
    return null;
}

function findBrandCode (brandNameInput) {
    if (!brandNameInput) {
        throw new Error('Invalid Param: brandNameInput cannot be blank');
    }
    return productIdPrefixes.brandPrefix[brandNameInput];
}


// handle unhappy flows in this route
// add auth middleware in this route
router.post('/product', (req, res, next) => {

    if (!req.body.name || !req.body.description || !req.body.category || !req.body.brand) {
        logger.warn(`product create request has rejected as param is missing`);
        return res.status(400).json({ message: 'bad request' });
    }

    const product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = findCategory(req.body.category);
    product.categoryCode = findCategoryCode(product.category);
    product.brand = findBrand(req.body.brand);
    product.brandCode = findBrandCode(product.brand);

    if (req.body.volume) {
        product.volume = req.body.volume;
    }
    if (req.body.skinType) {
        product.skinType = req.body.skinType;
    }
    // check how to update array 
    product.priceData = req.body.priceData;

    product.id = product.createProductId(product.brandCode, product.categoryCode);
    product.save().then((product) => {
        logger.info(`new product has created: ${product}`);
        return res.status(201).send(product);
    }).catch(next);
});

router.put('/product/:id', (req, res, next) => {
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

router.get('/product/:id', (req, res, next) => {

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

router.delete('/product/:id', (req, res, next) => {
    /*
    if (!req.params.id) {
        logger.warn('product delete request has rejected as id param is missing');
        return res.status(400).json({ message: 'bad request' });
    }*/

    Product.findOneAndRemove({ id: req.params.id })
        .then((product)=> {
            if (!product) {
                logger.warn('product delete request has rejected as product is unknown')
                res.status(204).json({ message: 'can not find product' })
            }
            logger.info(`product delete request has succeed: ${product}`);
            return res.status(200).json(product);
        }).catch(next);
});

module.exports = router;