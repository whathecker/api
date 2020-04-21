let addressDB = require('./index');

describe('Test database access layer of address object', () => {
    
    let _address_id_holder = {
        0: null,
        1: null
    }

    beforeEach(async () => {
        await addressDB.dropAll();

        let mockAddresses = [
            {
                user_id: "1",
                firstName: "Yunjae",
                lastName: "Oh",
                mobileNumber: "0615151515",
                postalCode: "1034AA",
                houseNumber: "10",
                houseNumberAdd: "A",
                streetName: "Randomstraat",
                city: "Amsterdam",
                province: "Noord-Holland",
                country: "Netherlands"
            },
            {
                user_id: "1",
                firstName: "Junseok",
                lastName: "Oh",
                mobileNumber: "0615141415",
                postalCode: "1044AA",
                houseNumber: "5",
                houseNumberAdd: " ",
                streetName: "Anotherstraat",
                city: "Amsterdam",
                province: "Noord-Holland",
                country: "Netherlands"
            }
        ];

        const address = await addressDB.addAddress(mockAddresses[0]);
        const address2 = await addressDB.addAddress(mockAddresses[1]);

        _address_id_holder[0] = address._id;
        _address_id_holder[1] = address2._id;
    });

    test('find a address by id', async () => {
        const address_id = _address_id_holder[1];

        const address = await addressDB.findAddressById(address_id);

        delete address.creationDate;
        delete address.lastModified;

        const expected = {
            _id: address_id,
            user_id: "1",
            firstName: "Junseok",
            lastName: "Oh",
            mobileNumber: "0615141415",
            postalCode: "1044AA",
            houseNumber: "5",
            houseNumberAdd: " ",
            streetName: "Anotherstraat",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        };

        expect(address).toEqual(expected);
    });

    test('add a address', async () => {
        let payload = {
            user_id: "1",
            firstName: "Yunsoo",
            lastName: "Oh",
            mobileNumber: "0615161615",
            postalCode: "1054AA",
            houseNumber: "5",
            houseNumberAdd: " ",
            streetName: "Otherstraat",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        };

        const newAddress = await addressDB.addAddress(payload);
        const {_id, creationDate, lastModified, ...result} = newAddress;

        expect(result).toEqual(payload);
    });

    test('update a address', async () => {
        const address_id = _address_id_holder[1];

        const payload = {
            user_id: "1",
            firstName: "Junseok",
            lastName: "Oh",
            mobileNumber: "0615161620",
            postalCode: "1056AA",
            houseNumber: "5",
            houseNumberAdd: " ",
            streetName: "Anotherstraat",
            city: "Rotterdam",
            province: "South-Holland",
            country: "Netherlands"
        };

        const updatedAddress = await addressDB.updateAddress(address_id, payload);
        const {_id, creationDate, lastModified, ...result} = updatedAddress; 

        expect(result).toEqual(payload);
    });

    test('list addresses by user_id', async () => {
        const user_id = "1";

        const addresses = await addressDB.listAddressesByUserId(user_id);

        expect(addresses).toHaveLength(2);
    });

    test('delete address by id', async () => {
        const address_id = _address_id_holder[1];
        const user_id = "1";

        const result = await addressDB.deleteAddressById(address_id);
        const addresses = await addressDB.listAddressesByUserId(user_id);
        
        expect(result.status).toBe('success');
        expect(result._id).toEqual(address_id);
        expect(addresses).toHaveLength(1);
    });

    test('drop all addresses in db', async () => {
        const user_id = "1";

        await addressDB.dropAll();
        const addresses = await addressDB.listAddressesByUserId(user_id);

        expect(addresses).toHaveLength(0);
    });
});