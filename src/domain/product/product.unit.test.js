const errors = require('./product-error');
const buildCreateProductObj = require('./product');
const productSchema = require('./product-schema');
const validator = require('../validator')(productSchema);

const createProductObj = buildCreateProductObj(validator);


const dummyData = Object.freeze({   
    channel: 'EU',
    name: 'Missha sheetmask',
    description: 'This is a sheetmask from Missha',
    category: 'Sheetmask',
    categoryCode: 'ST',
    brand: 'Missha',
    brandCode: 'MS',
    skinType: 'dry',
    volume: '10ml',
    eanCode: '156185165198156',
    prices: [
        {
            region: 'eu',
            currency: 'euro',
            price: "10.00"  
        }
    ],
    inventory: {
        quantityOnHand: 10,
        quarantaine: 0,
    },
    inventoryHistory: [this.inventory],
    creationDate: new Date('December 17, 1995 03:24:00'),
    lastModified: new Date('December 17, 1999 03:24:00')
});

describe('Make product object', () => {

    test('object is created - without volume and eanCode, creationDate, lastModified', ()=> {
        
        let payload = dummyData;
        delete payload.volume;
        delete payload.eanCode;
        delete payload.creationDate;
        delete payload.lastModified;

        const product = createProductObj(payload);

        expect(product.channel).toBe(payload.channel);
        expect(product.name).toBe(payload.name);
        expect(product.description).toBe(payload.description);
        expect(product.category).toBe(payload.category);
        expect(product.categoryCode).toBe(payload.categoryCode);
        expect(product.brand).toBe(payload.brand);
        expect(product.brandCode).toBe(payload.brandCode);
        expect(product.skinType).toBe(payload.skinType);

        expect(product.prices[0].region).toBe(payload.prices[0].region);
        expect(product.prices[0].currency).toBe(payload.prices[0].currency);
        expect(product.prices[0].price).toBe(payload.prices[0].price);
        expect(product.prices[0].vat).toBe('1.74');
        expect(product.prices[0].netPrice).toBe('8.26');
        expect(product.inventory).toEqual(payload.inventory);
        expect(product.inventoryHistory).toContainEqual(payload.inventory);
    }); 

    test('object is created - with volume, creationDate, lastModified', ()=> {

        let payload = dummyData;
        delete payload.eanCode;

        const product = createProductObj(payload);

        expect(product.volume).toBe(payload.volume);
        expect(product.creationDate).toBe(payload.creationDate);
        expect(product.lastModified).toBe(payload.lastModified);

        expect(product.channel).toBe(payload.channel);
        expect(product.name).toBe(payload.name);
        expect(product.description).toBe(payload.description);
        expect(product.category).toBe(payload.category);
        expect(product.categoryCode).toBe(payload.categoryCode);
        expect(product.brand).toBe(payload.brand);
        expect(product.brandCode).toBe(payload.brandCode);
        expect(product.skinType).toBe(payload.skinType);

        expect(product.prices[0].region).toBe(payload.prices[0].region);
        expect(product.prices[0].currency).toBe(payload.prices[0].currency);
        expect(product.prices[0].price).toBe(payload.prices[0].price);
        expect(product.prices[0].vat).toBe('1.74');
        expect(product.prices[0].netPrice).toBe('8.26');
        expect(product.inventory).toEqual(payload.inventory);
        expect(product.inventoryHistory).toContainEqual(payload.inventory);
    }); 

    test('object is created - with eanCode, creationDate, lastModified', ()=> {

        let payload = dummyData;
        delete payload.volume;

        const product = createProductObj(payload);

        expect(product.eanCode).toBe(payload.eanCode);
        expect(product.creationDate).toBe(payload.creationDate);
        expect(product.lastModified).toBe(payload.lastModified);

        expect(product.channel).toBe(payload.channel);
        expect(product.name).toBe(payload.name);
        expect(product.description).toBe(payload.description);
        expect(product.category).toBe(payload.category);
        expect(product.categoryCode).toBe(payload.categoryCode);
        expect(product.brand).toBe(payload.brand);
        expect(product.brandCode).toBe(payload.brandCode);
        expect(product.skinType).toBe(payload.skinType);

        expect(product.prices[0].region).toBe(payload.prices[0].region);
        expect(product.prices[0].currency).toBe(payload.prices[0].currency);
        expect(product.prices[0].price).toBe(payload.prices[0].price);
        expect(product.prices[0].vat).toBe('1.74');
        expect(product.prices[0].netPrice).toBe('8.26');
        expect(product.inventory).toEqual(payload.inventory);
        expect(product.inventoryHistory).toContainEqual(payload.inventory);
    }); 

    test('object is created - with volume and eanCode', ()=> {
        let payload = dummyData;
        const product = createProductObj(payload);

        expect(product.volume).toBe(payload.volume);
        expect(product.eanCode).toBe(payload.eanCode);

        expect(product.creationDate).toBe(payload.creationDate);
        expect(product.lastModified).toBe(payload.lastModified);

        expect(product.channel).toBe(payload.channel);
        expect(product.name).toBe(payload.name);
        expect(product.description).toBe(payload.description);
        expect(product.category).toBe(payload.category);
        expect(product.categoryCode).toBe(payload.categoryCode);
        expect(product.brand).toBe(payload.brand);
        expect(product.brandCode).toBe(payload.brandCode);
        expect(product.skinType).toBe(payload.skinType);

        expect(product.prices[0].region).toBe(payload.prices[0].region);
        expect(product.prices[0].currency).toBe(payload.prices[0].currency);
        expect(product.prices[0].price).toBe(payload.prices[0].price);
        expect(product.prices[0].vat).toBe('1.74');
        expect(product.prices[0].netPrice).toBe('8.26');
        expect(product.inventory).toEqual(payload.inventory);
        expect(product.inventoryHistory).toContainEqual(payload.inventory);
    }); 

    test('object is created - price is 14.55 euro', ()=> {
        let payload = dummyData;
        payload.prices[0].price = "14.55";

        const product = createProductObj(payload);

        expect(product.prices[0].price).toBe(payload.prices[0].price);
        expect(product.prices[0].vat).toBe('2.53');
        expect(product.prices[0].netPrice).toBe('12.02');
    });

    test('object is created - price is 99 euro', ()=> {
        let payload = dummyData;
        payload.prices[0].price = "99";

        const product = createProductObj(payload);

        expect(product.prices[0].price).toBe('99.00');
        expect(product.prices[0].vat).toBe('17.18');
        expect(product.prices[0].netPrice).toBe('81.82');
    });

    test('price cannot be zero', ()=> {
        let payload = dummyData;
        payload.prices[0].price = "0.00";

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.genericErrors.zero_price);
    });

    test('invalid region in price', ()=> {
        let payload = dummyData;
        payload.prices[0].region = "some odd region";

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.genericErrors.invalid_region_in_price);
    });

    test('invalid currency in price', ()=> {
        let payload = dummyData;
        payload.prices[0].currency = "some odd currency";

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.genericErrors.invalid_currency_in_price);
    });

    test('product id must have length of 9', () => {
        let payload = dummyData;
        const product = createProductObj(payload);

        expect(product.id).toHaveLength(9);
    });

    test('first 2 chars of product id must be same as brandCode', () => {
        let payload = dummyData;
        const product = createProductObj(payload);

        expect(product.id.slice(0, 2)).toBe(payload.brandCode);
    });

    test('third and forth chars of product id must be same as categoryCode', () => {
        let payload = dummyData;
        const product = createProductObj(payload);

        expect(product.id.slice(2, 4)).toBe(payload.categoryCode);
    });



    test('product object must have a channel property', () => {
        let payload = dummyData;
        delete payload.channel;
        
        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.channel.message);
    });

    test('channel property must be string', () => {
        let payload = dummyData;
        payload.channel = 0;

        const product = createProductObj(payload); 

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.channel.message);
    });

    test('product object must have a name property', () => {
        let payload = dummyData;
        delete payload.name;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.name.message);
    });

    test('name property must be string', () => {
        let payload = dummyData;
        payload.name = true;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.name.message);
    });

    test('product object must have a description property', () => {
        let payload = dummyData;
        delete payload.description;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.description.message);
    });

    test('description property must be string', () => {
        let payload = dummyData;
        payload.description = 103;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.description.message);
    });

    test('product object must have a category property', () => {
        let payload = dummyData;
        delete payload.category;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.category.message);
    });

    test('category property must be string', () => {
        let payload = dummyData;
        payload.category = 103;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.category.message);
    });

    test('product object must have a categoryCode property', () => {
        let payload = dummyData;
        delete payload.categoryCode;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.categoryCode.message);
    });

    test('categoryCode property must be string', () => {
        let payload = dummyData;
        payload.categoryCode = 103;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.categoryCode.message);
    });

    test('product object must have a brand property', () => {
        let payload = dummyData;
        delete payload.brand;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.brand.message);
    });

    test('brand property must be string', () => {
        let payload = dummyData;
        payload.brand = null;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.brand.message);
    });

    test('product object must have a brandCode property', () => {
        let payload = dummyData;
        delete payload.brandCode;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.brandCode.message);
    });

    test('brandCode property must be string', () => {
        let payload = dummyData;
        payload.brandCode = null;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.brandCode.message);
    });

    test('product object must have a skinType property', () => {
        let payload = dummyData;
        delete payload.skinType;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.skinType.message);
    });

    test('skinType property must be string', () => {
        let payload = dummyData;
        payload.skinType = null;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.skinType.message);
    });

    test('volume property must be string if exist', () => {
        let payload = dummyData;
        payload.volume = 12032;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.volume.message);
    });

    test('eanCode property must be string if exist', () => {
        let payload = dummyData;
        payload.eanCode = 12032;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.eanCode.message);
    });

    test('creationDate property must be string if exist', () => {
        let payload = dummyData;
        payload.creationDate = 'weird odd text';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be string if exist', () => {
        let payload = dummyData;
        payload.lastModified = 'weird odd text';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.lastModified.message);
    });

    test('prices property must have region property', () => {
        let payload = dummyData;
        delete payload.prices[0].region;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.region_in_prices.message);
    });

    test('region property in prices must be string', () => {
        let payload = dummyData;
        payload.prices[0].region = 239012394;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.region_in_prices.message);
    });

    test('prices property must have currency property', () => {
        let payload = dummyData;
        delete payload.prices[0].currency;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.currency_in_prices.message);
    });

    test('currency property in prices must be string', () => {
        let payload = dummyData;
        payload.prices[0].currency = 239012394;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.currency_in_prices.message);
    });

    test('prices property must have price property', () => {
        let payload = dummyData;
        delete payload.prices[0].price;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.price_in_prices.message);
    });

    test('price property in prices must be string', () => {
        let payload = dummyData;
        payload.prices[0].price = 34904902290;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.price_in_prices.message);
    });

    test('vat property in prices must be string if exist', () => {
        let payload = dummyData;
        payload.prices[0].vat = 12901290;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.vat_in_prices.message);
    });

    test('netPrice property in prices must be string if exist', () => {
        let payload = dummyData;
        payload.prices[0].netPrice = 12901290;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.netPrice_in_prices.message);
    });

    test('inventory property must have quantityOnHand property', () => {
        let payload = dummyData;
        delete payload.inventory.quantityOnHand;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quantityOnHand_in_inventory.message);
    });

    test('quantityOnHand property in inventory must be number', () => {
        let payload = dummyData;
        payload.inventory.quantityOnHand = 'some quantity';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quantityOnHand_in_inventory.message);
    });

    test('inventory property must have quarantaine property', () => {
        let payload = dummyData;
        delete payload.inventory.quarantaine;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quarantaine_in_inventory.message);
    });

    test('quarantaine property in inventory must be number', () => {
        let payload = dummyData;
        payload.inventory.quarantaine = 'some quantity';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quarantaine_in_inventory.message);
    });

    test('lastModified property in inventory must be date if exist', () => {
        let payload = dummyData;
        payload.inventory.lastModified = 'some date';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.lastModified_in_inventory.message);
    });

    test('item in inventoryHistory property must have quantityOnHand property', () => {
        let payload = dummyData;
        delete payload.inventoryHistory[0].quantityOnHand;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quantityOnHand_in_inventoryHistory.message);
    });

    test('quantityOnHand property in inventoryHistory must be number', () => {
        let payload = dummyData;
        payload.inventoryHistory[0].quantityOnHand = 'some quantity';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quantityOnHand_in_inventoryHistory.message);
    });

    test('item in inventoryHistory property must have quarantaine property', () => {
        let payload = dummyData;
        delete payload.inventoryHistory[0].quarantaine;

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quarantaine_in_inventoryHistory.message);
    });

    test('quarantaine property in inventoryHistory must be number', () => {
        let payload = dummyData;
        payload.inventoryHistory[0].quarantaine = 'some quantity';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.quarantaine_in_inventoryHistory.message);
    });

    test('lastModified property in inventoryHistory must be date', () => {
        let payload = dummyData;
        payload.inventoryHistory[0].lastModified = 'some date';

        const product = createProductObj(payload);

        expect(product instanceof Error).toBe(true);
        expect(product.message).toBe(errors.typeErrors.lastModified_in_inventoryHistory.message);
    });

});