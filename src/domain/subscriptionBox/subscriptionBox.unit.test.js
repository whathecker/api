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