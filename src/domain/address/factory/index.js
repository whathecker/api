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
        
        const result_postal_code = DutchAddressFactory.validatePostalCode(postalCode);
        if (!result_postal_code) {
            return errors.genericErrors.invalid_postal_code;
        }

        const result_house_num = DutchAddressFactory.validateHouseNumber(houseNumber);
        if (!result_house_num) {
            return errors.genericErrors.invalid_house_number;
        }

        if (mobileNumber) {
            const result_mobile_num = DutchAddressFactory.validateMobileNumber(mobileNumber);
            if (!result_mobile_num) {
                return errors.genericErrors.invalid_mobile_num;
            }
        }

        const payload = {
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
        };

        return new Address(payload);
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

class Address {
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

        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.postalCode = postalCode;
        this.houseNumber = houseNumber;
        this.streetName = streetName;
        this.city = city;
        this.country = country;

        (mobileNumber)? this.mobileNumber = mobileNumber : null;
        (houseNumberAdd)? this.houseNumberAdd = houseNumberAdd : null;
        (province)? this.province = province : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
    }
}


module.exports = DutchAddressFactory;