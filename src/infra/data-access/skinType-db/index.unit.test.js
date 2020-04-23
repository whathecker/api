const skinTypeDB = require('./index');

describe('Test database access layer of skinType object', () => {

    const _skinType_id_holder = {
        0: null,
        1: null,
        2: null,
    };

    beforeEach(async () => {
        await skinTypeDB.dropAll();

        const mockSkinTypes = [
            {
                skinType: "dry",
                skinTypeCode: "DR",
            },
            {
                skinType: "normal",
                skinTypeCode: "NM"
            },
            {
                skinType: "oily",
                skinTypeCode: "OL"
            }
        ];

        const skinType = await skinTypeDB.addSkinType(mockSkinTypes[0]);
        const skinType2 = await skinTypeDB.addSkinType(mockSkinTypes[1]);
        const skinType3 = await skinTypeDB.addSkinType(mockSkinTypes[2]);

        _skinType_id_holder[0] = skinType._id;
        _skinType_id_holder[1] = skinType2._id;
        _skinType_id_holder[2] = skinType3._id;
    });

    test('list all skin types', async () => {
        const skinTypes = await skinTypeDB.listSkinTypes();

        expect(skinTypes).toHaveLength(3);
    });

    test('find skin type by name', async () => {
        const skinType_name = "dry";

        const skinType = await skinTypeDB.findSkinTypeByName(skinType_name);
        const {_id, ...rest} = skinType;

        const expected = {
            skinType: "dry",
            skinTypeCode: "DR"
        };

        expect(rest).toEqual(expected);
    });

    test('add a new skin type', async () => {
        const payload = {
            skinType: "dry",
            skinTypeCode: "DR"
        };

        const newSkinType = await skinTypeDB.addSkinType(payload);
        const {_id, ...rest} = newSkinType;

        expect(rest).toEqual(payload);
    });

    test('delete a skin type by name', async () => {
        const skinType_name = "normal";
        const skinType_id = _skinType_id_holder[1];

        const result =  await skinTypeDB.deleteSkinTypeByName(skinType_name);
        const skinTypes = await skinTypeDB.listSkinTypes();

        expect(result.status).toBe('success');
        expect(result._id).toEqual(skinType_id);
        expect(skinTypes).toHaveLength(2);
    });

    test('drop all skin types in db', async () => {
        await skinTypeDB.dropAll();

        const skinTypes = await skinTypeDB.listSkinTypes();

        expect(skinTypes).toHaveLength(0);
    });
});