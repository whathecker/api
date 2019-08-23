const Product = require('../../../models/Product');

const productInterfaces = {};

/**
 * private method: createProductInstance
 * @param {object} productDetail 
 * Return: new instance of Product model
 */

productInterfaces.createProductInstance = (productDetail) => {

    if (!productDetail) {
        throw new Error('Missing argument: cannot create Billing instance without productDetail argument');
    }

    const product = new Product();
    product.name = productDetail.name;
    product.description = productDetail.description;
    product.category = productDetail.category;
    product.categoryCode = productDetail.categoryCode;
    product.brand = productDetail.brand;
    product.brandCode = productDetail.brandCode;
    product.skinType = productDetail.skinType;
    product.id = product.createProductId(product.brandCode, product.categoryCode);
    product.prices = [{
        region: productDetail.prices[0].region,
        currency: productDetail.prices[0].currency,
        price: productDetail.prices[0].price,
        vat: product.setVat(productDetail.prices[0].price, 0.21),
        netPrice: product.setNetPrice(productDetail.prices[0].price, 0.21)
    }];
    product.inventory = { quantityOnHand: productDetail.qty };
    product.inventoryHistory = [product.inventory];

    return product;
}

module.exports = productInterfaces;
