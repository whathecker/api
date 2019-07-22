const Product = require('../../models/Product');
const logger = require('../../utils/logger');
const productIdPrefixes = require('../../utils/productidPrefixes');

function createProduct (req, res, next) {
    if (!req.body.name || !req.body.description || !req.body.category || !req.body.brand) {
        logger.warn(`createProduct request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
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
            return res.status(422).json({ 
                status: 'failed',
                message: 'invalid skinType' 
            });
        }
         
    }
    if (req.body.prices) {

        if (!Array.isArray(req.body.prices)) {
            return res.status(422).json({ 
                status: 'failed',
                message: 'invalid data type: prices' 
            });
        }

        if (!product.isPriceDataValid(req.body.prices)) {
            return res.status(422).json({ 
                status: 'failed',
                message: 'invalid price format' 
            });
        }

        if (product.isPriceDataValid(req.body.prices)) {
            for (let i = 0; i < req.body.prices.length; i++) {
                const price = req.body.prices[i].price;
                const vatRate = 0.21;
                req.body.prices[i].vat = product.setVat(price, vatRate);
                req.body.prices[i].netPrice = product.setNetPrice(price, vatRate);
            }
            console.log(req.body.prices);
            product.prices = req.body.prices
        } 
        
    }

    if (req.body.quantityOnHand) {
        product.inventory = {
            quantityOnHand : req.body.quantityOnHand,
            lastModified : Date.now()
        }
    }

    product.id = product.createProductId(product.brandCode, product.categoryCode);

    product.save().then((product) => {
        logger.info(`createProduct request has processed | new product has created: ${product}`);
        return res.status(201).json({
            status: 'success',
            product: product,
            message: 'new product is created'
        });
    }).catch(next);
}

module.exports = createProduct;