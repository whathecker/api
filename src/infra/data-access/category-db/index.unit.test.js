const categoryDB = require('./index');

describe('Test database access layer of category object', () => {
    const _category_id_holder = {
        0: null,
        1: null,
    }

    beforeEach(async () => {
        await categoryDB.dropAll();

        const mockCategory = [
            {
                categoryName: "Sheetmask",
                categoryCode: "ST"
            },
            {
                categoryName: "Serum",
                categoryCode: "SR"
            }
        ];

        const category = await categoryDB.addCategory(mockCategory[0]);
        const category2 = await categoryDB.addCategory(mockCategory[1]);

        _category_id_holder[0] = category._id;
        _category_id_holder[1] = category2._id;
    });

    afterAll(async () => {
        await categoryDB.dropAll();
    });

    test('list all categories', async () => {
        const categories = await categoryDB.listCategories();

        expect(categories).toHaveLength(2);
    });

    test('find category by name', async () => {
        const category_name = "Serum";

        const category = await categoryDB.findCategoryByName(category_name);
        const {_id, ...rest} = category;

        const expected = {
            categoryName: "Serum",
            categoryCode: "SR"
        };

        expect(rest).toEqual(expected);
    });

    test('add a new category', async () => {
        const payload = {
            categoryName: "Shampoo",
            categoryCode: "SP"
        };

        const newCategory = await categoryDB.addCategory(payload);
        const {_id, ...rest} = newCategory;

        expect(rest).toEqual(payload);
    });

    test('delete a category by name', async () => {
        const category_name = "Serum";
        const category_id = _category_id_holder[1];

        const result = await categoryDB.deleteCategoryByName(category_name);
        const categories = await categoryDB.listCategories();

        expect(result.status).toBe('success');
        expect(result._id).toEqual(category_id);
        expect(categories).toHaveLength(1);
    });

    test('drop all categories in db', async () => {
        await categoryDB.dropAll();

        const categories = await categoryDB.listCategories();

        expect(categories).toHaveLength(0);
    });
});