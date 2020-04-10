class AddressBaseFactory {

    static validateMobileNumber () {
        throw new Error('Cannot call validateMobileNumber directly at parent class: implement this method');
    }

    static validatePostalCode () {
        throw new Error('Cannot call validatePostalCode directly at parent class: implement this method');
    }

    static validateHouseNumber () {
        throw new Error('Cannot call validateHouseNumber directly at parent class: implement this method');
    }

}

module.exports = AddressBaseFactory;