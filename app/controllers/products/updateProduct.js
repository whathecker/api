const Product = require('../../models/Product');
const logger = require('../../utils/logger');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');
const SkinType = require('../../models/SkinType');

async function updateProduct (req, res, next) {
    if (!req.params.id) {
        logger.warn(`updateProduct request has rejected as param is missing`);
        return res.status(400).json({ 
            status: "failed",
            message: 'bad request' 
        });
    }

    const category = await Category.findOne({ categoryName: req.body.category }).exec();
    const skinType = await SkinType.findOne({ skinType: req.body.skinType }).exec();
    const brand = await Brand.findOne({ brandName: req.body.brand }).exec();

    if (req.body.category && !category) {
        return res.status(422).json({ 
            status: 'failed',
            message: `unknonw category name` 
        });
    }

    if (req.body.skinType && !skinType) {
        return res.status(422).json({ 
            status: 'failed',
            message: `unknonw skinType name` 
        });
    }

    if (req.body.brand && !brand) {
        return res.status(422).json({ 
            status: 'failed',
            message: `unknonw brand name` 
        });
    }

    Product.findOne({ id: req.params.id })
    .then((product) => {
        if (!product) {
            logger.warn(`updateProduct request has rejected as product id is unknown`);
            return res.status(422).json({ 
                status: 'failed',
                message: `unknonw product id` 
            });
        }

        if (product) {
            if (req.body.name) {
                product.name = req.body.name;
                product.markModified('name');
            }
            if (req.body.description) {
                product.description = req.body.description;
                product.markModified('description');
            }
            if (req.body.category) {
                product.category = category.categoryName;
                product.categoryCode = category.categoryCode;
                product.markModified('category');
                product.markModified('categoryCode');
            }
            if (req.body.skinType) {
                product.skinType = skinType.skinType;
                product.markModified('skinType');
            }
            if (req.body.brand) {
                product.brand = brand.brandName;
                product.brandCode = brand.brandCode;
                product.markModified('brand');
                product.markModified('brandCode');
            }
            if (req.body.prices) {

                if (!Array.isArray(req.body.prices)) {
                    return res.status(422).json({ 
                        status: 'failed',
                        message: 'invalid data type: prices' 
                    });
                }

                const isPriceDataValid = product.isPriceDataValid(req.body.prices);
                if (!isPriceDataValid) {
                    logger.warn(`updateProduct request has rejected as prices param isn't valid`);
                    return res.status(422).json({ 
                        status: 'failed',
                        message: 'invalid price format' 
                    });
                }
                if (isPriceDataValid) {
                    for (let i = 0; i < req.body.prices.length; i++) {
                        const price = req.body.prices[i].price;
                        const vatRate = 0.21;
                        req.body.prices[i].vat = product.setVat(price, vatRate);
                        req.body.prices[i].netPrice = product.setNetPrice(price, vatRate);
                    }
                    product.prices = req.body.prices;
                    product.markModified('prices');
                }
            }

            if (req.body.quantityOnHand) {
                if (isNaN(req.body.quantityOnHand)) {
                    return res.status(422).json({ 
                        status: 'failed',
                        message: 'invalid quantityOnHand format' 
                    });
                }
                product.inventory.quantityOnHand = req.body.quantityOnHand;
                product.inventory.lastModified = Date.now();
                const inventoryInstance = product.inventory;
                product.inventoryHistory.push(inventoryInstance);
                product.markModified('inventory');
                product.markModified('inventoryHistory');
            }
            
            product.lastModified = Date.now();
            product.markModified('lastModified');
            product.save().then(() => {
                return res.status(200).json({
                    status: 'success',
                    message: 'product data has updated'
                });
            });

        }

    }).catch(next);

}

module.exports = updateProduct;