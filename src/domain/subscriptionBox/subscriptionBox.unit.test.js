const errors = require('./subscriptionBox-error');
const buildCreateSubscriptionBoxObj = require('./subscriptionBox');
const subscriptionBoxSchema = require('./subscriptionBox-schema');
const validator = require('../validator')(subscriptionBoxSchema);

const createSubscriptionBoxObj = buildCreateSubscriptionBoxObj(validator);

const dummyData = {
    channel: "EU",
    name: "chokchok 'normal' skin type package",
    boxType: "normal",
    boxTypeCode: "NM",
    prices: [
        {
            region: "eu",
            currency: "euro",
            price: "19.95"
        }
    ],
    items: [
        "objectid",
        "objectid",
        "objectid"
    ],
    creationDate: new Date('December 17, 1995 03:24:00'),
    lastModified: new Date('December 17, 1999 03:24:00')
}

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Make subscriptionBox object', () => {

    test('object is created: without id, creationDate, lastModified', () => {
        
        let payload = copyObj(dummyData);

        const originalCreationDate = payload.creationDate;
        const originalLastModified = payload.lastModified;

        delete payload.creationDate;
        delete payload.lastModified;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.channel).toBe(payload.channel);
        expect(subscriptionBox.name).toBe(payload.name);
        expect(subscriptionBox.boxType).toBe(payload.boxType);
        expect(subscriptionBox.boxTypeCode).toBe(payload.boxTypeCode);

        expect(subscriptionBox.prices[0].region).toBe(payload.prices[0].region);
        expect(subscriptionBox.prices[0].currency).toBe(payload.prices[0].currency);
        expect(subscriptionBox.prices[0].price).toBe(payload.prices[0].price);
        expect(subscriptionBox.prices[0].vat).toBe('3.46');
        expect(subscriptionBox.prices[0].netPrice).toBe('16.49');

        expect(subscriptionBox.items).toBe(payload.items);
        
        expect(subscriptionBox.creationDate).not.toBe(originalCreationDate);
        expect(subscriptionBox.lastModified).not.toBe(originalLastModified);
    });

    test('object is created: without id, items', () => {

        let payload = copyObj(dummyData);

        const originalItems = payload.items;

        delete payload.items;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.channel).toBe(payload.channel);
        expect(subscriptionBox.name).toBe(payload.name);
        expect(subscriptionBox.boxType).toBe(payload.boxType);
        expect(subscriptionBox.boxTypeCode).toBe(payload.boxTypeCode);

        expect(subscriptionBox.prices[0].region).toBe(payload.prices[0].region);
        expect(subscriptionBox.prices[0].currency).toBe(payload.prices[0].currency);
        expect(subscriptionBox.prices[0].price).toBe(payload.prices[0].price);
        expect(subscriptionBox.prices[0].vat).toBe('3.46');
        expect(subscriptionBox.prices[0].netPrice).toBe('16.49');

        expect(subscriptionBox.items).not.toBe(originalItems);
        
        expect(subscriptionBox.creationDate).toBe(payload.creationDate);
        expect(subscriptionBox.lastModified).toBe(payload.lastModified);
        
    });

    test('object is created: with all fields', () => {

        let payload = copyObj(dummyData);

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.channel).toBe(payload.channel);
        expect(subscriptionBox.name).toBe(payload.name);
        expect(subscriptionBox.boxType).toBe(payload.boxType);
        expect(subscriptionBox.boxTypeCode).toBe(payload.boxTypeCode);

        expect(subscriptionBox.prices[0].region).toBe(payload.prices[0].region);
        expect(subscriptionBox.prices[0].currency).toBe(payload.prices[0].currency);
        expect(subscriptionBox.prices[0].price).toBe(payload.prices[0].price);
        expect(subscriptionBox.prices[0].vat).toBe('3.46');
        expect(subscriptionBox.prices[0].netPrice).toBe('16.49');

        expect(subscriptionBox.items).toBe(payload.items);
        
        expect(subscriptionBox.creationDate).toBe(payload.creationDate);
        expect(subscriptionBox.lastModified).toBe(payload.lastModified);

    });

    test('invalid channel', () => {
        let payload = copyObj(dummyData);
        payload.channel = "APAC"

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.genericErrors.invalid_channel.message);
    });

    test('price cannot be zero', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].price = "0.00";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.genericErrors.zero_price.message); 
    });

    test('set vat & netPrice - price is 14.55 euro', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].price = "14.55";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.prices[0].price).toBe(payload.prices[0].price);
        expect(subscriptionBox.prices[0].vat).toBe("2.53");
        expect(subscriptionBox.prices[0].netPrice).toBe("12.02");
    });

    test('set vat & netPrice - price is 99 euro', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].price = "99";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.prices[0].price).toBe(payload.prices[0].price);
        expect(subscriptionBox.prices[0].vat).toBe("17.18");
        expect(subscriptionBox.prices[0].netPrice).toBe("81.82");
    });

    test('invalid region in price', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].region = "some odd region";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.genericErrors.invalid_region_in_price.message);
    });

    test('invalid currency in price', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].currency = "some odd currency";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.genericErrors.invalid_currency_in_price.message);
    });

    test('id must have length of 9', () => {
        let payload = dummyData;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.id).toHaveLength(9);
    });

    test('prefix of id must be PK + boxTypeCode', () => {
        let payload = dummyData;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.id.slice(0, 2)).toBe("PK");
        expect(subscriptionBox.id.slice(2, 4)).toBe(payload.boxTypeCode);
    });

    test('when id already exist, do not create new one', () => {
        let payload = copyObj(dummyData);
        payload.id = "PKNM10505";

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox.id).toBe(payload.id);
    });
});

describe('Type checking: subscriptionBox object', () => {

    test('subscriptionBox object must have a channel property', () => {
        let payload = copyObj(dummyData);
        delete payload.channel;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.channel.message);
    });

    test('channel property must be string', () => {
        let payload = copyObj(dummyData);
        payload.channel = 0;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.channel.message);
    });

    test('subscriptionBox object must have a name property', () => {
        let payload = copyObj(dummyData);
        delete payload.name;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.name.message);
    });

    test('name property must be string', () => {
        let payload = copyObj(dummyData);
        payload.name = 0;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.name.message);
    });

    test('subscriptionBox object must have a boxType property', () => {
        let payload = copyObj(dummyData);
        delete payload.boxType;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.boxType.message);
    });

    test('boxType property must be string', () => {
        let payload = copyObj(dummyData);
        payload.boxType = 0;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.boxType.message);
    });

    test('items property must be array', () => {
        let payload = copyObj(dummyData);
        payload.items = { };

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.items.message);
    });

    test('creationDate property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = true;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = true;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.lastModified.message);
    });

    test('prices property must have region property', () => {
        let payload = copyObj(dummyData);
        delete payload.prices[0].region;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.region_in_prices.message);
    });

    test('region property in prices must be string', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].region = 1239042394032;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.region_in_prices.message);
    });

    test('prices property must have currency property', () => {
        let payload = copyObj(dummyData);
        delete payload.prices[0].currency;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.currency_in_prices.message);
    });

    test('currency property in prices must be string', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].currency = 239034934;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.currency_in_prices.message);
    });

    test('prices property must have price property', () => {
        let payload = copyObj(dummyData);
        delete payload.prices[0].price;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.price_in_prices.message);
    });

    test('price property in prices must be string', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].price = 34904902290;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.price_in_prices.message);
    });

    test('vat property in prices must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].vat = 12901290;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.vat_in_prices.message);
    });

    test('netPrice property in prices must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.prices[0].netPrice = 12901290;

        const subscriptionBox = createSubscriptionBoxObj(payload);

        expect(subscriptionBox instanceof Error).toBe(true);
        expect(subscriptionBox.message).toBe(errors.typeErrors.netPrice_in_prices.message);
    });


});