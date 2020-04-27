const Category = require('../../../db/mongodb/models/category');
const serializer = require('../mongodb/serializer');
const createCategoryObj = require('../../../../domain/category');

const listCategories = async () => {
    const categories = await Category.find();
    return Promise.resolve(serializer(categories));
};

const findCategoryByName = async (categoryName) => {
    const category = await Category.findOne({ categoryName: categoryName });

    if (!category) {
        return Promise.reject({
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

    const newCategory = await Category.create(category);

    return Promise.resolve(serializer(newCategory));
};

const deleteCategoryByName = async (categoryName) => {
    const removedCategory = await Category.findOneAndRemove({ 
        categoryName: categoryName 
    });

    if (!removedCategory) {
        return Promise.reject({
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