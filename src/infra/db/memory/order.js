const orders = [
    {
        _id: "1",
        country: "NL",
        orderNumber: "ECNL8092517600",
        user_id: "1",
        invoiceNumber: "0805081926636",
        billingAddress: {
            firstName: "Yunjae",
            lastName: "Oh",
            mobileNumber: "06151515",
            postalCode: "1093TV",
            houseNumber: "100",
            houseNumberAdd: " ",
            streetName: "Randomstraat",
            country: "The Netherlands"
        },
        shippingAddress: {
            firstName: "Yunjae",
            lastName: "Oh",
            mobileNumber: "06151515",
            postalCode: "1093TV",
            houseNumber: "100",
            houseNumberAdd: " ",
            streetName: "Randomstraat",
            country: "The Netherlands"
        },
        isSubscription: true,
        orderStatus: {
            status: "PAID",
            timestamp: new Date('December 17, 1995 03:24:00')
        },
        orderStatusHistory: [
            {
                status: "RECEIVED",
                timestamp: new Date('December 14, 1995 03:24:00')
            },
            {
                status: "PAID",
                timestamp: new Date('December 17, 1995 03:24:00')
            }
        ],
        paymentMethod: {
            type: "mastercard",
            recurringDetail: "billing_id"
        },
        paymentStatus: {
            status: "AUTHORIZED",
            timestamp: new Date('December 17, 1995 03:24:00')
        },
        paymentHistory: [
            {
                status: "OPEN",
                timestamp: new Date('December 14, 1995 03:24:00')
            },
            {
                status: "AUTHORIZED",
                timestamp: new Date('December 17, 1995 03:24:00')
            }
        ],
        creationDate: new Date('December 14, 1995 03:24:00'),
        deliverySchedule: new Date('December 24, 1995 03:24:00'),
        isShipped: true,
        shippedDate: new Date('December 24, 1995 03:24:00'),
        courier: 'DHL',
        trackingNumber: ["12345677", "12345436"],
        isConfEmailDelivered: true,
        lastModified: new Date('December 24, 1995 03:24:00'),
        orderAmountPerItem: [
            {
                itemId: "PKOL90587",
                name: "chokchok 'oily' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            },
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ],
        orderAmount: {
            currency: "euro",
            totalAmount: "49.90",
            totalDiscount: "0.00",
            totalVat: "8.66",
            totalNetPrice: "41.24"
        },
        shippedAmountPerItem: [
            {
                itemId: "PKOL90587",
                name: "chokchok 'oily' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            },
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ],
        shippedAmount: {
            currency: "euro",
            totalAmount: "49.90",
            totalDiscount: "0.00",
            totalVat: "8.66",
            totalNetPrice: "41.24"
        }
    },
    {
        _id: "2",
        country: "NL",
        orderNumber: "ECNL809251700",
        user_id: "1",
        invoiceNumber: "0805081926656",
        billingAddress: {
            firstName: "Yunsoo",
            lastName: "Oh",
            mobileNumber: "06151515",
            postalCode: "1093TV",
            houseNumber: "100",
            houseNumberAdd: " ",
            streetName: "Randomstraat",
            country: "The Netherlands"
        },
        shippingAddress: {
            firstName: "Yunsoo",
            lastName: "Oh",
            mobileNumber: "06151515",
            postalCode: "1093TV",
            houseNumber: "100",
            houseNumberAdd: " ",
            streetName: "Randomstraat",
            country: "The Netherlands"
        },
        isSubscription: true,
        orderStatus: {
            status: "RECEIVED",
            timestamp: new Date('December 14, 1995 03:24:00')
        },
        orderStatusHistory: [
            {
                status: "RECEIVED",
                timestamp: new Date('December 14, 1995 03:24:00')
            }
        ],
        paymentMethod: {
            type: "mastercard",
            recurringDetail: "billing_id"
        },
        paymentStatus: {
            status: "OPEN",
            timestamp: new Date('December 14, 1995 03:24:00')
        },
        paymentHistory: [
            {
                status: "OPEN",
                timestamp: new Date('December 14, 1995 03:24:00')
            }
        ],
        creationDate: new Date('December 14, 1995 03:24:00'),
        deliverySchedule: new Date('December 24, 1995 03:24:00'),
        isShipped: false,
        isConfEmailDelivered: true,
        lastModified: new Date('December 14, 1995 03:24:00'),
        orderAmountPerItem: [
            {
                itemId: "PKOL90587",
                name: "chokchok 'oily' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ],
        orderAmount: {
            currency: "euro",
            totalAmount: "24.95",
            totalDiscount: "0.00",
            totalVat: "4.33",
            totalNetPrice: "20.62"
        },
        shippedAmountPerItem: [
            {
                itemId: "PKOL90587",
                name: "chokchok 'oily' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ]
    }
];

module.exports = orders;