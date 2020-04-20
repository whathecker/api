let addressDB = require('./index');

describe('Test database access layer of address object', () => {
    
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

        await addressDB.addAddress(mockAddresses[0]);
        await addressDB.addAddress(mockAddresses[1]);
    });

    test('find a address by id', async () => {
        const address = await addressDB.findAddressById("2");

        const expected = {
            _id: "2",
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
        const {_id, ...result} = newAddress;

        expect(result).toEqual(payload);
    });

    test('update a address', async () => {
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
        
        const updatedAddress = await addressDB.updateAddress("2", payload);
        delete updatedAddress._id;

        expect(updatedAddress).toEqual(payload);
    });

    test('list addresses by user_id', async () => {
        const user_id = "1";

        const addresses = await addressDB.listAddressesByUserId(user_id);

        expect(addresses).toHaveLength(2);
    });

    test('delete address by id', async () => {
        const address_id = "2";
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