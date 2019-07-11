const router = require('express').Router(),
    Inventory = require('../../../models/Inventory'),
    logger = require('../../../utils/logger'),
    Product = require('../../../models/Product'),
    apiAuth = require('../../../middlewares/verifyApikey');

router.use(apiAuth);

// middleware to check if product exists 
router.param('productId', (req, res, next, productId) => {

    Product.findOne({ id: productId })
    .then((product)=> {

        if (!product) {
            return res.status(404).json({ message: 'product not found'});
        }
        
        req.product = product;
        logger.info(`product is retrieved from query param and added to req: ${req.product}`);
        return next();
    }).catch(next);

})
// post endpoint to create one inventory
router.post('/:productId', (req, res, next) => {

    const inventory = new Inventory();
    inventory.product = req.product._id;
    if (req.body.quantity) { 

        if (isNaN(req.body.quantity)) {
            return res.status(400).json({ message: 'bad request' });
        }
        
        inventory.quantity = req.body.quantity; 
    }

    inventory.save().then((inventory) => {
        logger.info(`new inventory is successfully saved to database: ${inventory}`);
        return res.status(201).send(inventory);
    }).catch(next);

});

router.get('/:productId', (req, res, next) => {
    
    Inventory.findOne({ product: req.product._id })
    .populate('product').exec()
    .then((inventory)=> {
        
        if (!inventory) {
            logger.warn(`get inventory request has succeed, but no inventory is found`)
            return res.status(204).json({ message: 'inventory not found' });
        }
        
        logger.info(`get inventory request has succeed: ${inventory}`);
        return res.status(200).send(inventory);
    }).catch(next);
});


function updateInventoryQuantity (req, res, next, quantity) {

    if (isNaN(quantity) || !quantity) {
        logger.warn(`update inventory QTY has failed as request param is invalid`);
        return res.status(400).json({ message: `bad request` });
    }

    let update = {};
    update.quantity = quantity;
    update.lastModified = Date.now();

    Inventory.findOneAndUpdate({ product: req.product._id }, update)
        .then((inventory) => {
            if (!inventory) {
                logger.warn(`update inventory QTY has failed as inventory is unknonw`);
                return res.status(204).json({ message: `cannot find inventory` });
            }
            logger.info(`update inventory QTY has succeed: ${inventory}`);
            return res.status(200).send(inventory);
        }).catch(next);

}


// put endpoint to update qty of one inventory 
router.put('/:productId', (req, res, next) => {

    if (!req.body.quantity) {
        logger.warn(`update inventory QTY request has failed as quantity is missing`);
        return res.status(400).json({ message: 'bad request' });
    } 
    return updateInventoryQuantity(req, res, next, req.body.quantity);
});

router.delete('/:productId', (req, res, next) => {

    Inventory.findOneAndRemove({ product: req.product._id })
    .then((inventory) => {
        if (!inventory) {
            logger.warn(`product delete request has failed as inventory is unknown`);
            return res.status(204).json({ message: 'cannot find product' });
        }
        logger.info(`inventory delete request has succeed: ${inventory}`);
        return res.status(200).json(inventory);
    }).catch(next);
    
});
module.exports = router;