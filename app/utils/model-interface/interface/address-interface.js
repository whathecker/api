const Address = require('../../../models/Address');

const addressInterfaces = {};

/**
 * public method: createAddressInstance
 * @param {Object} addressDetail 
 * Object contain following fields: 
 * firstName, lastName, postalCode, houseNumber, houseNumberAdd
 * mobileNumber, streetName, city, province, country
 * 
 * @param {String} user_id 
 * object_id of User instance associated with the Address instance to be created
 * 
 * Return: new instance of Address
 */

addressInterfaces.createAddressInstance = (addressDetail, user_id) => {
    
    if (!addressDetail) {
        throw new Error('Missing argument: addressDetail cannot be ommitted');
    }

    if (!user_id) {
        throw new Error('Missing argument: user_id cannot be ommitted');
    }

    const address = new Address();
    address.firstName = addressDetail.firstName;
    address.lastName = addressDetail.lastName;
    address.postalCode = addressDetail.postalCode;
    address.houseNumber = addressDetail.houseNumber;
    address.houseNumberAdd = addressDetail.houseNumberAdd;
    address.mobileNumber = addressDetail.mobileNumber;
    address.streetName = addressDetail.streetName;
    address.city = addressDetail.city;
    address.province = addressDetail.province;
    address.country = addressDetail.country;
    address.user = user_id;

    return address;
};

module.exports = addressInterfaces;