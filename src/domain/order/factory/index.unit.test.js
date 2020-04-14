const OrderFactory = require('./index');

describe('Test OrderFactory', () => {

    test('createOrderNumber must return valid orderNumber', () => {
        
        const orderNumber = OrderFactory.createOrderNumber({
            envVar: 'production',
            country: 'NL'
        });

        const orderNumber2 = OrderFactory.createOrderNumber({
            envVar: 'staging',
            country: 'NL'
        });

        const orderNumber3 = OrderFactory.createOrderNumber({
            envVar: 'new',
            country: 'new'
        });

        expect(orderNumber).toHaveLength(14);
        expect(orderNumber.slice(0,2)).toBe('EC');
        expect(orderNumber.slice(2,4)).toBe('NL');

        expect(orderNumber2).toHaveLength(14);
        expect(orderNumber2.slice(0,2)).toBe('ST');
        expect(orderNumber2.slice(2,4)).toBe('NL');

        expect(orderNumber3).toHaveLength(14);
        expect(orderNumber3.slice(0,2)).toBe('DV');
        expect(orderNumber3.slice(2,4)).toBe('NL');
    });

    test('validateOrderStatus must return true', () => {
        const orderStatus = {
            status: 'RECEIVED',
            timestamp: new Date('December 17, 1995 03:24:00')
        };
        const orderStatus2 = {
            status: 'PENDING',
            timestamp: new Date('December 18, 1995 03:24:00')
        };
        const orderStatus3 = {
            status: 'PAID',
            timestamp: new Date('December 19, 1995 03:24:00')
        };
        const orderStatus4 = {
            status: 'SHIPPED',
            timestamp: new Date('December 20, 1995 03:24:00')
        };
        const orderStatus5 = {
            status: 'CANCELLED',
            timestamp: new Date('December 21, 1995 03:24:00')
        };
        const orderStatus6 = {
            status: 'OVERDUE',
            timestamp: new Date('December 22, 1995 03:24:00')
        };

        const result = OrderFactory.validateOrderStatus(orderStatus);
        const result2 = OrderFactory.validateOrderStatus(orderStatus2);
        const result3 = OrderFactory.validateOrderStatus(orderStatus3);
        const result4 = OrderFactory.validateOrderStatus(orderStatus4);
        const result5 = OrderFactory.validateOrderStatus(orderStatus5);
        const result6 = OrderFactory.validateOrderStatus(orderStatus6);
        
        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
        expect(result6).toBe(true);
    });

    test('validateOrderStatus must return false', () => {
        const orderStatus = {
            status: 'TOBEPAID',
            timestamp: new Date('December 17, 1995 03:24:00')
        };
        
        const result = OrderFactory.validateOrderStatus(orderStatus);
        
        expect(result).toBe(false);
    });

    test('validateOrderStatusHistory must return true', () => {
        const orderStatusHistory = [
            {
                status: 'RECEIVED',
                timestamp: new Date('December 17, 1995 03:24:00')
            },
            {
                status: 'PAID',
                timestamp: new Date('December 19, 1995 03:24:00')
            }
        ];

        const result = OrderFactory.validateOrderStatusHistory(orderStatusHistory);

        expect(result).toBe(true);
    });

    test('validateOrderStatusHistory must return false', () => {
        const orderStatusHistory = [
            {
                status: 'RECEIVED',
                timestamp: new Date('December 17, 1995 03:24:00')
            },
            {
                status: 'PAID',
                timestamp: new Date('December 19, 1995 03:24:00')
            },
            {
                status: '__',
                timestamp: new Date('December 20, 1995 03:24:00')
            }
        ];

        const result = OrderFactory.validateOrderStatusHistory(orderStatusHistory);

        expect(result).toBe(false);
    });

    test('validatePaymentStatus must return true', () => {
        const paymentStatus = {
            status: "OPEN",
            timestamp: new Date('December 17, 1995 03:24:00')
        };
        const paymentStatus2 = {
            status: "AUTHORIZED",
            timestamp: new Date('December 18, 1995 03:24:00')
        };
        const paymentStatus3 = {
            status: "PENDING",
            timestamp: new Date('December 19, 1995 03:24:00')
        };
        const paymentStatus4 = {
            status: "REFUSED",
            timestamp: new Date('December 20, 1995 03:24:00')
        };
        const paymentStatus5 = {
            status: "CANCELLED",
            timestamp: new Date('December 20, 1995 03:24:00')
        };
        const paymentStatus6 = {
            status: "REFUNDED",
            timestamp: new Date('December 20, 1995 03:24:00')
        };

        const result = OrderFactory.validatePaymentStatus(paymentStatus);
        const result2 = OrderFactory.validatePaymentStatus(paymentStatus2);
        const result3 = OrderFactory.validatePaymentStatus(paymentStatus3);
        const result4 = OrderFactory.validatePaymentStatus(paymentStatus4);
        const result5 = OrderFactory.validatePaymentStatus(paymentStatus5);
        const result6 = OrderFactory.validatePaymentStatus(paymentStatus6);

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
        expect(result6).toBe(true);
    });

    test('validatePaymentStatus must return false', () => {
        const paymentStatus = {
            status: "NOT_PAID",
            timestamp: new Date('December 17, 1995 03:24:00')
        };

        const result = OrderFactory.validatePaymentStatus(paymentStatus);

        expect(result).toBe(false);
    });

    test('validatePaymentHistory must return true', () => {
        const paymentHistory = [
            {
                status: "OPEN",
                timestamp: new Date('December 17, 1995 03:24:00')
            },
            {
                status: "AUTHORIZED",
                timestamp: new Date('December 18, 1995 03:24:00')
            },
            {
                status: "CANCELLED",
                timestamp: new Date('December 19, 1995 03:24:00')
            },
        ];

        const result = OrderFactory.validatePaymentHistory(paymentHistory);

        expect(result).toBe(true);
    });

    test('validatePaymentHistory must return false', () => {
        const paymentHistory = [
            {
                status: "OPEN",
                timestamp: new Date('December 17, 1995 03:24:00')
            },
            {
                status: "AUTHORIZED",
                timestamp: new Date('December 18, 1995 03:24:00')
            },
            {
                status: "__",
                timestamp: new Date('December 19, 1995 03:24:00')
            },
        ];

        const result = OrderFactory.validatePaymentHistory(paymentHistory);

        expect(result).toBe(false);
    });


    test('validateOrderAmountPerItem must indicate currency is invalid', () => {
        const orderAmountPerItem = [
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "usd",
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
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('currency');
    });

    test('validateAmountPerItem must indicate quantity is invalid', () => {
        const orderAmountPerItem = [
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "euro",
                quantity: 0,
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
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('quantity');
    });

    test('validateAmountPerItem must indicate grossPrice is invalid', () => {
        const orderAmountPerItem = [
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "240.95",
                netPrice: "20.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('grossPrice');
    });

    test('validateAmountPerItem must indicate netPrice is invalid', () => {
        const orderAmountPerItem = [
            {
                itemId: "PKOL90585",
                name: "chokchok 'normal' skin type package",
                currency: "euro",
                quantity: 1,
                originalPrice: "24.95",
                discount: "0.00",
                vat: "4.33",
                grossPrice: "24.95",
                netPrice: "200.62",
                sumOfGrossPrice: "24.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('netPrice');
    });

    test('validateAmountPerItem must indicate sumOfGrossPrice is invalid', () => {
        const orderAmountPerItem = [
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
                sumOfGrossPrice: "240.95",
                sumOfNetPrice: "20.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('sumOfGrossPrice');
    });

    test('validateAmountPerItem must indicate sumOfNetPrice is invalid', () => {
        const orderAmountPerItem = [
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
                sumOfNetPrice: "200.62",
                sumOfVat: "4.33",
                sumOfDiscount: "0.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('sumOfNetPrice');
    });

    test('validateAmountPerItem must indicate sumOfVat is invalid', () => {
        const orderAmountPerItem = [
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
                sumOfVat: "41.33",
                sumOfDiscount: "0.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('sumOfVat');
    });

    test('validateAmountPerItem must indicate sumOfDiscount is invalid', () => {
        const orderAmountPerItem = [
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
                sumOfDiscount: "10.00"
    
            }
        ];

        const result = OrderFactory.validateAmountPerItem(orderAmountPerItem);
        expect(result.success).toBe(false);
        expect(result.error).toBe('sumOfDiscount');
    });

    test('validateTotalAmount must indicate currency is invalid', () => {
        const orderAmount = {
            currency: "usd",
            totalAmount: "49.90",
            totalDiscount: "0.00",
            totalVat: "8.66",
            totalNetPrice: "41.24"
        };

        const result = OrderFactory.validateTotalAmount(orderAmount);
        expect(result.success).toBe(false);
        expect(result.error).toBe('currency');
    });

    test('validateTotalAmount must indicate price is wrong', () => {
        const orderAmount = {
            currency: "euro",
            totalAmount: "49.90",
            totalDiscount: "0.00",
            totalVat: "8.66",
            totalNetPrice: "410.24"
        };

        const result = OrderFactory.validateTotalAmount(orderAmount);
        expect(result.success).toBe(false);
        expect(result.error).toBe('price');
    });

    test('validateTotalAmount must indicate data is correct', () => {
        const orderAmount = {
            currency: "euro",
            totalAmount: "49.90",
            totalDiscount: "0.00",
            totalVat: "8.66",
            totalNetPrice: "41.24"
        };

        const result = OrderFactory.validateTotalAmount(orderAmount);
        expect(result.success).toBe(true);
        expect(result.error).toBe(null);
    });


});