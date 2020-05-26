const productDB = require('../index');
let mockProducts = require('./_mock');

describe('Test database access layer of product object', () => {

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

    test('update a product - name and description', async () => {
        const productId = _productId_holder[1];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockProducts[1]));
        deepCopiedPayload.name = "updated name";
        deepCopiedPayload.description = "updated description";

        const updatedProduct = await productDB.updateProduct(productId, deepCopiedPayload);
        const {_id, eanCode, volume, ...rest} = updatedProduct;
        
        expect(rest).toEqual(deepCopiedPayload);
        expect(rest.name).toBe(deepCopiedPayload.name);
        expect(rest.description).toBe(deepCopiedPayload.description);
        expect(rest.productId).toBe(productId);
    });

    test('update a product - inventory', async () => {
        const productId = _productId_holder[2];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockProducts[2]));
        deepCopiedPayload.inventory = {
            quantityOnHand: 20,
            quarantaine: 0,
            lastModified: new Date(Date.now())
        };
        
        const updatedProduct = await productDB.updateProduct(productId, deepCopiedPayload);
        const {_id, eanCode, volume, ...rest} = updatedProduct;

        expect(rest.inventory).toEqual(deepCopiedPayload.inventory);
        expect(rest.inventoryHistory).toHaveLength(3);
        expect(rest.inventoryHistory[rest.inventoryHistory.length - 1]).toEqual(deepCopiedPayload.inventory);
        expect(rest.productId).toBe(productId);
    });

    test('updatea a product - price', async () => {
        const productId = _productId_holder[0];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockProducts[0]));
        deepCopiedPayload.prices[0] = {
            region: "eu",
            currency: "euro",
            price: "10.00"
        };

        const updatedProduct = await productDB.updateProduct(productId, deepCopiedPayload);
        const {_id, eanCode, volume, ...rest} = updatedProduct;

        expect(rest.prices[0].region).toBe("eu");
        expect(rest.prices[0].currency).toBe("euro");
        expect(rest.prices[0].price).toBe("10.00");
        expect(rest.prices[0].vat).toBe("1.74");
        expect(rest.prices[0].netPrice).toBe("8.26");
        expect(rest.productId).toBe(productId);
    });

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