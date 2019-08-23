const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const PDFDocument = require('pdfkit');
const path = require('path');

function convertMonthToString (month) {
    let converted = '';
    switch (month) {
        case 0:
            converted = 'Jan';
            break;
        case 1:
            converted = 'Feb';
            break;
        case 2:
            converted = 'Mar';
            break;
        case 3:
            converted = 'Apr';
            break;
        case 4:
            converted = 'May';
            break;
        case 5:
            converted = 'Jun';
            break;
        case 6:
            converted = 'Jul';
            break;
        case 7:
            converted = 'Aug';
            break;
        case 8:
            converted = 'Sep';
            break;
        case 9:
            converted = 'Oct';
            break;
        case 10:
            converted = 'Nov';
            break;
        case 11:
            converted = 'Dec';
            break;
    }
    return converted;
}

function set2DigitsDate (date) {
    if (date < 10) {
        return "0" + date.toString();
    } 
    return date.toString();
}

function getCurrencySymbol (currency) {
    let currencySymbol;

    switch (currency) {
        case 'euro':
            currencySymbol = "€";
            break;
    }

    return currencySymbol;
}

function generatePDFHeader (doc, logo) {
    doc.image(logo, 60, 50, { width: 100, height: 100})
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('hellochokchok.com', 200, 65, { align: "right" })
    .fontSize(11)
    .font('Courier')
    .text('Chokchok V.O.F', 200, 80, { align: "right" })
    .text('Commelinestraat 42', 200, 95, { align: "right" })
    .text('1093TV Amsterdam', 200, 110, { align: 'right' })
    .text('KvK: 74367919', 200, 140, { align: "right"})
    .text('BTW/VAT: NL859870133B01', 200, 155, { align: "right" });
}

function generateCustomerInfo (doc, user) {
    const firstName = user.firstName;
    const lastName = user.lastName;
    const streetName = user.defaultShippingAddress.streetName;
    const houseNumber = user.defaultShippingAddress.houseNumber;
    const houseNumberAdd = user.defaultShippingAddress.houseNumberAdd;
    const postalCode = user.defaultShippingAddress.postalCode;
    const city = user.defaultShippingAddress.city;
    const email = user.email;
    doc.fontSize(16)
    .font('Helvetica-Bold')
    .text('Invoice', 70, 220, { align: "left" })
    .fontSize(10)
    .font('Courier')
    .text(`${firstName} ${lastName}`, 70, 250, { align: "left" })
    .text(`${streetName} ${houseNumber}${houseNumberAdd}`, 70, 265, { align: "left" })
    .text(`${postalCode} ${city}`, 70, 280, { align: "left" })
    .text(`${email}`, 70, 295, { align: "left"});
}

function generateInvoiceInfo (doc, invoiceNumber, creationDate, shippedDate) {
    const creationDateInTime = new Date(creationDate);
    //console.log(creationDateInTime);
    const year = creationDateInTime.getFullYear().toString();
    const month = convertMonthToString(creationDateInTime.getMonth());
    const date = set2DigitsDate(creationDateInTime.getDate());

    const shippedDateInTime = new Date(shippedDate);
    const shippedYear = shippedDateInTime.getFullYear().toString();
    const shippedMonth = convertMonthToString(shippedDateInTime.getMonth());
    const shippedDay = set2DigitsDate(shippedDateInTime.getDate());

    // add shipped date later
    
    doc.fontSize(10)
    .font('Helvetica-BoldOblique')
    .text('Invoice ID:', 70, 350, { align: "left" })
    .text('Invoice date:', 70, 368, { align: "left" })
    .text('Delivery date:', 70, 386, { align: "left" })
    .font('Courier')
    .text(`${invoiceNumber}`, 160, 350, { align: "left"})
    .text(`${date} ${month} ${year}`, 160, 368, { align: "left"})
    .text(`${shippedDay} ${shippedMonth} ${shippedYear}`, 160, 386, { align: "left" });
}

function generateTableHeader (doc) {
    doc.fontSize(10)
    .font('Helvetica-Bold')
    .text('Product description', 70, 450)
    .text('Tax', 240, 450)
    .text('Qty', 280, 450)
    .text('Price per Qty', 320, 450)
    .text('Discount', 400, 450)
    .text('Price(incl. VAT)', 400, 450, { align: "right"});
    doc.moveTo(70, 470).lineTo(563, 470).stroke();
}

function generateTableBody (doc, vatRate, lineItemDetails) {

    
    const currencySymbol = getCurrencySymbol(lineItemDetails[0].currency);

    doc.fontSize(9)
    .font('Helvetica')
    .text(`${lineItemDetails[0].name}`, 70, 490)
    .text(`${vatRate}%`, 240, 490)
    .text(`${lineItemDetails[0].quantity}`, 285, 490)
    .text(`${currencySymbol} ${lineItemDetails[0].originalPrice}`, 330, 490)
    .text(`${currencySymbol} ${lineItemDetails[0].discount}`, 405, 490)
    .text(`${currencySymbol} ${lineItemDetails[0].grossPrice}`, 400, 490, { align: "right" });
    doc.moveTo(70, 520).lineTo(563, 520).stroke();

}

function generateTotalAmount (doc, orderAmount) {
    //console.log(priceDetail);
    const currencySymbol = getCurrencySymbol(orderAmount.currency);
    doc.fontSize(10)
    .font('Helvetica')
    .text('Subtotal amount (excl. VAT)', 310, 550)
    .text('VAT', 412, 570)
    .text('Total amount (incl. VAT)', 328, 590)
    .font('Helvetica')
    .text(`${currencySymbol}`, 455, 550)
    .text(`${currencySymbol}`, 455, 570)
    .text(`${currencySymbol}`, 455, 590)
    .text(`${orderAmount.totalNetPrice}`, 500, 550)
    .text(`${orderAmount.totalVat}`, 500, 570)
    .text(`${orderAmount.totalAmount}`, 500, 590);
}

function generateFooterText (doc) {
    doc.fontSize(14)
    .font('Times-BoldItalic')
    .text('thanks for your purchase at chokchok!', 50, 680, { 
        align: "center",
        continued: true
    });
}



function getUserInvoice (req, res , next) {
    if (req.user) {

        const orderNumber = req.params.orderNumber;
        Order.findOne({ orderNumber: orderNumber })
        .populate({
            path: 'user',
            populate: { path: 'defaultShippingAddress'}
        })
        .populate('package')
        .populate('items')
        .populate('shippedItems')
        .then((order) => {
            if (!order) {
                logger.info(`getUserInvoice request has not processed, can't find order | ${orderNumber}`);
                return res.status(200).json({});
            }

            if (order) {
                console.log(order);
                let doc = new PDFDocument({ margin: 50 });
                doc.pipe(res);
                const rootDir = path.dirname(require.main.filename);
                const logo = `${rootDir}/app/images/chokchok_logo_pink.jpg`;

                // generate header section
                generatePDFHeader(doc, logo);

                // generate customer info section
                generateCustomerInfo(doc, order.user);

                // generate invoice info section
                generateInvoiceInfo(doc, order.invoiceNumber, order.creationDate, order.shippedDate);

                // generate table header
                generateTableHeader(doc);

                // generate table body for subscription order
                generateTableBody(doc, 21, order.orderAmountPerItem);

                // generate subtotal block 
                generateTotalAmount(doc, order.orderAmount);

                // generate footer text
                generateFooterText(doc);

                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=${order.invoiceNumber}.pdf`,
                    "Access-Control-Expose-Headers": 'Content-Disposition'
                });
                doc.end();
                logger.info(`getUserInvoice request has processed | ${orderNumber}`);
                return res.status(200).end();
            }

            
        }).catch(next);
        
    }
}

module.exports = getUserInvoice;