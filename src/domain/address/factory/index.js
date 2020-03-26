const errors = require('../address-error');
const AddressBaseFactory = require('../../_shared_factory').address_base_factory;

class DutchAddressFactory extends AddressBaseFactory {
    constructor({
        user,
        firstName,
        lastName,
        mobileNumber,
        postalCode,
        houseNumber,
        houseNumberAdd,
        streetName,
        city,
        province,
        country,
        creationDate,
        lastModified
    } = {}) {

    }

    static validateMobileNumber (mobileNumber) {
        const dutchMobileRegex = /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/
        return dutchMobileRegex.test(mobileNumber);
    }

    static validatePostalCode (postalCode) {
        const dutchPostalCodeRegex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        return dutchPostalCodeRegex.test(postalCode);
    }

    static validateHouseNumber (houseNumber) {
        if (houseNumber.length <= 5) {
            return true
        }
        return false;
    }
}


module.exports = DutchAddressFactory;