const productDB = require('../index');
let mockProducts = require('./_mock');

describe('Test database layer of product object', () => {

    const _productId_holder = {
        0: null,
        1: null,
        2: null
    };

    beforeEach(async () => {
        await productDB.dropAll();

        const product = await productDB.addProduct(mockProducts[0]);
        const product2 = await productDB.addProduct(mockProducts[1]);
        const product3 = await productDB.addProduct(mockProducts[2]);
       
        _productId_holder[0] = product.productId;
        _productId_holder[1] = product2.productId;
        _productId_holder[2] = product3.productId;
    });

    afterAll(async () => {
        await productDB.dropAll();
    });

    test('list all products', async () => {
        const products = await productDB.listProducts();
        expect(products).toHaveLength(3);
    });

    test('find product by productId', async () => {
        const id = _productId_holder[0];

        const product = await productDB.findProductByProductId(id);
        const {_id, productId, eanCode, volume, ...rest} = product;

        expect(rest).toEqual(mockProducts[0]);
    });

    test('add a new product', async () => {

        const payload = {
            channel: "EU",
            name: "Other Pure Essence Mask Sheet-Avocado",
            description: "This sheetmask is good for something",
            category: "Sheetmask",
            categoryCode: "ST",
            brand: "Holika Holika",
            brandCode: "HH",
            skinType: "dry",
            inventory: {
                quantityOnHand: 10,
                quarantaine: 0,
                lastModified: new Date('December 19, 2000 03:24:00')
            },
            inventoryHistory: [
                {
                    quantityOnHand: 0,
                    quarantaine: 0,
                    lastModified: new Date('December 19, 1999 03:24:00')
                },
                {
                    quantityOnHand: 10,
                    quarantaine: 0,
                    lastModified: new Date('December 19, 2000 03:24:00')
                },
            ],
            prices: [
                {
                    region: "eu",
                    currency: "euro",
                    price: "2.95",
                    vat: "0.51",
                    netPrice: "2.44"
                }
            ],
            creationDate: new Date('December 19, 1996 03:24:00'),
            lastModified: new Date('December 19, 2000 03:24:00')
        };

        const newProduct = await productDB.addProduct(payload);
        const {_id, productId, eanCode, volume, ...rest } = newProduct;

        expect(rest).toEqual(payload);
    });

    /*
    TODO: implement later
    Need requirements on how to allow user to update the field
    test('update a product', () => {

    }); */

    test('delete a product by productId', async () => {
        const productId = _productId_holder[2];

        const result = await productDB.deleteProductByProductId(productId);
        const products = await productDB.listProducts();

        expect(result.status).toBe('success');
        expect(result.productId).toEqual(productId);
        expect(products).toHaveLength(2);
    });

    test('drop all products in db', async () => {
        await productDB.dropAll();
        const products = await productDB.listProducts();

        expect(products).toHaveLength(0);
    });
});