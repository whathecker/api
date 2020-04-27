const mockProducts = [
    {
        channel: "EU",
        productId: "LGST50001",
        name: "Skim Supplement Sheetmask",
        description: "This sheetmask is good for something",
        category: "Sheetmask",
        categoryCode: "ST",
        brand: "Missha",
        brandCode: "MS",
        skinType: "oily",
        inventory: {
            quantityOnHand: 30,
            quarantaine: 0,
            lastModified: new Date('December 17, 1999 03:24:00')
        },
        inventoryHistory: [
            {
                quantityOnHand: 0,
                quarantaine: 0,
                lastModified: new Date('December 17, 1998 03:24:00')
            },
            {
                quantityOnHand: 30,
                quarantaine: 0,
                lastModified: new Date('December 17, 1999 03:24:00')
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
        creationDate: new Date('December 17, 1995 03:24:00'),
        lastModified: new Date('December 17, 1999 03:24:00')
    },
    {
        channel: "EU",
        productId: "LGST50100",
        name: "Another Skim Supplement Sheetmask",
        description: "This sheetmask is good for something",
        category: "Sheetmask",
        categoryCode: "ST",
        brand: "Missha",
        brandCode: "MS",
        skinType: "normal",
        inventory: {
            quantityOnHand: 10,
            quarantaine: 0,
            lastModified: new Date('December 18, 1999 03:24:00')
        },
        inventoryHistory: [
            {
                quantityOnHand: 0,
                quarantaine: 0,
                lastModified: new Date('December 18, 1998 03:24:00')
            },
            {
                quantityOnHand: 10,
                quarantaine: 0,
                lastModified: new Date('December 18, 1999 03:24:00')
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
        creationDate: new Date('December 18, 1995 03:24:00'),
        lastModified: new Date('December 18, 1999 03:24:00')
    },
    {
        channel: "EU",
        productId: "LGST50100",
        name: "Pure Essence Mask Sheet-Avocado",
        description: "This sheetmask is good for something",
        category: "Sheetmask",
        categoryCode: "ST",
        brand: "Holika Holika",
        brandCode: "HH",
        skinType: "dry",
        inventory: {
            quantityOnHand: 10,
            quarantaine: 0,
            lastModified: new Date('December 19, 1999 03:24:00')
        },
        inventoryHistory: [
            {
                quantityOnHand: 0,
                quarantaine: 0,
                lastModified: new Date('December 19, 1998 03:24:00')
            },
            {
                quantityOnHand: 10,
                quarantaine: 0,
                lastModified: new Date('December 19, 1999 03:24:00')
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
        creationDate: new Date('December 19, 1995 03:24:00'),
        lastModified: new Date('December 19, 1999 03:24:00')
    },
]

module.exports = mockProducts;