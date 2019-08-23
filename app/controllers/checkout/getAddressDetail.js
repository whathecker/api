const logger = require('../../utils/logger');
const addressAxios = require('../../../axios-postalcode');


function getAddressDetail (req, res, next) {
    console.log(req.body);
    const postalCode = req.body.postalCode;
    const houseNumber = req.body.houseNumber;

    //return res.status(400).end();
    if (!postalCode || !houseNumber) {

        logger.warn('/checkout/address request returned 422 as postalCode or houseNumber param is missing');
        return res.status(422).json({
            status: res.status,
            message: 'bad request: missing postalCode or houseNumber'
        });

    } else {

        addressAxios.get(`/addresses/?postcode=${postalCode}&number=${houseNumber}`)
        .then((response)=> {
            const status = response.status;
            const addressData = response.data._embedded['addresses'];

            if (status === 200 && addressData.length === 0) {
                console.log(response);
                logger.info('/checkout/address no address was found');
                return res.status(204).json({
                    status: res.status,
                    message: 'address was not found',
                });
            }

            if (status === 200 && addressData.length !== 0) {
                logger.info('/checkout/address | address was returned');
                return res.status(200).json({
                    status: res.status,
                    message: 'address has returned',
                    data: addressData
                });
            }

        })
        .catch(next);

    } 

}

module.exports = getAddressDetail;

