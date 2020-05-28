const packageDB = require('../index');
let mockPackages = require('./_mock');

describe('Test database layer of subscriptionBox object', () => {

    const _packageId_holder = {
        0: null,
        1: null,
        2: null
    };

    beforeEach(async () => {
        await packageDB.dropAll();

        const subscriptionBox = await packageDB.addSubscriptionBox(mockPackages[0]);
        const subscriptionBox2 = await packageDB.addSubscriptionBox(mockPackages[1]);
        const subscriptionBox3 = await packageDB.addSubscriptionBox(mockPackages[2]);

        _packageId_holder[0] = subscriptionBox.packageId;
        _packageId_holder[1] = subscriptionBox2.packageId;
        _packageId_holder[2] = subscriptionBox3.packageId;
    });

    afterAll(async () => {
        await packageDB.dropAll();
    });

    test('list all packages', async () => {
        const subscriptionBoxes = await packageDB.listSubscriptionBoxes();
        expect(subscriptionBoxes).toHaveLength(3);
    });

    test('find package by packageId', async () => {
        const id = _packageId_holder[0];

        const subscriptionBox = await packageDB.findSubscriptionBoxByPackageId(id);
        const {_id, packageId, ...rest} = subscriptionBox;

        expect(rest).toEqual(mockPackages[0]);
    });

    test('add a new package', async () => {
        const payload = {
            name: "Package 3",
            channel: "EU",
            items: ["1", "2"],
            prices: [{
                region: "eu",
                currency: "euro",
                price: "19.00",
                vat: "3.30",
                netPrice: "15.70"
            }],
            boxType: "oily",
            boxTypeCode: "OL",
            creationDate: new Date('December 19, 1995 03:24:00'),
            lastModified: new Date('December 19, 1999 03:24:00')
        };

        const newPackage = await packageDB.addSubscriptionBox(payload);
        const {_id, packageId, ...rest} = newPackage;

        expect(rest).toEqual(payload);
    });

    test('update a package - name', async () => {
        const packageId = _packageId_holder[1];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockPackages[1]));
        deepCopiedPayload.name = "updated name";

        const updatedSubscriptionBox = await packageDB.updateSubscriptionBox(packageId, deepCopiedPayload);
        const {_id, ...rest} = updatedSubscriptionBox;

        expect(rest.name).toBe(deepCopiedPayload.name);
        expect(rest.packageId).toBe(packageId);
    });

    test('update a package - items', async () => {
        const packageId = _packageId_holder[2];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockPackages[2]));
        deepCopiedPayload.items = ["1"];

        const updatedSubscriptionBox = await packageDB.updateSubscriptionBox(packageId, deepCopiedPayload);
        const {_id, ...rest} = updatedSubscriptionBox;
        console.log(updatedSubscriptionBox);

        expect(rest.items).toEqual(deepCopiedPayload.items);
        expect(rest.packageId).toBe(packageId);
    });

    test('update a package - price', async () => {
        const packageId = _packageId_holder[0];
        let deepCopiedPayload = JSON.parse(JSON.stringify(mockPackages[0]));
        deepCopiedPayload.prices[0] = {
            region: "eu",
            currency: "euro",
            price: "124.00"
        };

        const updatedSubscriptionBox = await packageDB.updateSubscriptionBox(packageId, deepCopiedPayload);
        const {_id, ...rest} = updatedSubscriptionBox;

        expect(rest.prices[0].region).toBe("eu");
        expect(rest.prices[0].currency).toBe("euro");
        expect(rest.prices[0].price).toBe("124.00");
        expect(rest.prices[0].vat).toBe("21.52");
        expect(rest.prices[0].netPrice).toBe("102.48");
        expect(rest.packageId).toBe(packageId);
    });

    test('delete a package by packageId', async () => {
        const packageId = _packageId_holder[1];

        const result = await packageDB.deleteSubscriptionBoxByPackageId(packageId);
        const subscriptionBoxes = await packageDB.listSubscriptionBoxes();

        expect(result.status).toBe('success');
        expect(result.packageId).toEqual(packageId);
        expect(subscriptionBoxes).toHaveLength(2);
    });

    test('drop all packages in db', async () => {
        await packageDB.dropAll();
        const subscriptionBoxes = await packageDB.listSubscriptionBoxes();

        expect(subscriptionBoxes).toHaveLength(0);
    });

});