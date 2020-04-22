const brandDB = require('./index');

describe('Test database access layer of brand object', () => {

    let _brand_id_holder = {
        0: null,
        1: null,
        2: null
    }

    beforeEach(async () => {
        await brandDB.dropAll();

        let mockBrands = [
            {
                brandCode: "LG",
                brandName: "Leegeeham"
            },
            {
                brandCode: "MS",
                brandName: "Missha"
            },
            {
                brandCode: "KL",
                brandName: "Klaris"
            },
        ];

        const brand = await brandDB.addBrand(mockBrands[0]);
        const brand2 = await brandDB.addBrand(mockBrands[1]);
        const brand3 =await brandDB.addBrand(mockBrands[2]);

        _brand_id_holder[0] = brand._id;
        _brand_id_holder[1] = brand2._id;
        _brand_id_holder[2] = brand3._id;
    });

    test('list all brands', async () => {
        const brands = await brandDB.listBrands();

        expect(brands).toHaveLength(3);
    });

    test('find brand by name', async () => {
        const brand_name = "Leegeeham";

        const brand = await brandDB.findBrandByName(brand_name);
        const {_id, ...rest} = brand;
        
        const expected = {
            brandCode: "LG",
            brandName: "Leegeeham"
        };

        expect(rest).toEqual(expected);
    });

    test('add a new brand', async () => {
        const payload = {
            brandCode: "AR",
            brandName: "Aromatica"
        };

        const newBrand = await brandDB.addBrand(payload);
        const {_id, ...rest} = newBrand;

        expect(rest).toEqual(payload);
    });

    test('delete a brand by name', async () => {
        const brand_name = "Leegeeham";
        const brand_id = _brand_id_holder[0];

        const result = await brandDB.deleteBrandByName(brand_name);
        const brands = await brandDB.listBrands();

        console.log(brands);
        expect(result.status).toBe('success');
        expect(result._id).toEqual(brand_id);
        expect(brands).toHaveLength(2);
    });

    test('drop all brands in db', async () => {
        await brandDB.dropAll();

        const brands = await brandDB.listBrands();

        expect(brands).toHaveLength(0);
    });

});