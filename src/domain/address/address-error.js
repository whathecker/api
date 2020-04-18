const typeErrors = Object.freeze({
    user_id: new Error('Address object must have user_id property as string'),
    firstName: new Error('Address object must have firstName property as string'),
    lastName: new Error('Address object must have lastName property as string'),
    mobileNumber: new Error('Address object has invalid type at property: mobileNumber'),
    postalCode: new Error('Address object must have postalCode property as string'),
    houseNumber: new Error('Address object must have houseNumber property as string'),
    houseNumberAdd: new Error('Address object has invalid type at property: houseNumberAdd'),
    streetName: new Error('Address object must have streetName property as string'),
    city: new Error('Address object must have city property as string'),
    province: new Error('Address object has invalid type at property: province'),
    country: new Error('Address object must have country property as string'),
    creationDate: new Error('Address object has invalid type at property: creationDate'),
    lastModified: new Error('Address object has invalid type at property: lastModified')
});

const genericErrors = Object.freeze({
    invalid_mobile_num: new Error('Address object contain invalid mobile number: please check your input'),
    invalid_postal_code: new Error('Address object contain invalid postal code: please check your input'),
    invalid_house_number: new Error('Address object contain invalid house number: please check your input')
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};