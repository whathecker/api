const Category = require('../../../db/mongodb/models/category');
const serializer = require('./serializer');
const createCategoryObj = require('../../../../domain/category');

const listCategories = async () => {
    const categories = await Category.find();
    return Promise.resolve(serializer(categories));
};

const findCategoryByName = async (categoryName) => {
    const category = await Category.findOne({ 
        categoryName: categoryName 
    });

    if (!category) {
        return Promise.resolve({
            status: "fail",
            reason: "category not found"
        });
    }

    return Promise.resolve(serializer(category));
};

const addCategory = async (payload) => {

    const category = createCategoryObj(payload);

    if (category instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: category
        });
    }

    try {
        await _isCategoryNameUnique(category.categoryName);
        await _isCategoryCodeUnique(category.categoryCode);
    }

    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newCategory = await Category.create(category);

    return Promise.resolve(serializer(newCategory));
};

async function _isCategoryNameUnique (categoryName) {
    const category = await findCategoryByName(categoryName);

    const { status } = category;

    if (status === "fail") return;

    throw new Error("db access for category object failed: categoryName must be unique");
};

async function _isCategoryCodeUnique (categoryCode) {
    const category = await Category.findOne({
        categoryCode: categoryCode
    });

    if (!category) return;

    throw new Error("db access for skinType object failed: skinTypeCode must be unique");
};

const deleteCategoryByName = async (categoryName) => {
    const removedCategory = await Category.findOneAndRemove({ 
        categoryName: categoryName 
    });

    if (!removedCategory) {
        return Promise.resolve({
            status: "fail",
            reason: "category not found"
        });
    }

    if (removedCategory) {
        return Promise.resolve({
            _id: removedCategory._id,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return Category.remove();
};

module.exports = {
    listCategories,
    findCategoryByName,
    addCategory,
    deleteCategoryByName,
    dropAll
}