const subscriptionBoxes = [
    {
        _id: "1",
        packageId: "PKDR10055",
        name: "Package 1",
        channel: "EU",
        items: ["1", "2"],
        prices: [{
            region: "eu",
            currency: "euro",
            price: "19.00",
            vat: "3.30",
            netPrice: "15.70"
        }],
        boxType: "dry",
        boxTypeCode: "DR",
        creationDate: new Date('December 17, 1995 03:24:00'),
        lastModified: new Date('December 17, 1999 03:24:00')
    },
    {
        _id: "2",
        packageId: "PKDR10065",
        name: "Package 2",
        channel: "EU",
        items: ["1", "2"],
        prices: [{
            region: "eu",
            currency: "euro",
            price: "19.00",
            vat: "3.30",
            netPrice: "15.70"
        }],
        boxType: "normal",
        boxTypeCode: "NM",
        creationDate: new Date('December 18, 1995 03:24:00'),
        lastModified: new Date('December 18, 1999 03:24:00')
    },
    {
        _id: "3",
        packageId: "PKDR10065",
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
    }
];

module.exports = subscriptionBoxes;