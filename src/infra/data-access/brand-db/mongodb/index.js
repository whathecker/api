const Brand = require('../../../db/mongodb/models/brand');
const serializer = require('../mongodb/serializer');
const createBrandObj = require('../../../../domain/brand');

const listBrands = async () => {
    const brands = await Brand.find();
    return Promise.resolve(serializer(brands));
};

const findBrandByName = async (brandName) => {
    const brand = await Brand.findOne({ brandName: brandName });

    if (!brand) {
        return Promise.reject({
            status: "fail",
            reason: "brand not found"
        });
    }

    return Promise.resolve(serializer(brand));
};

const addBrand = async (payload) => {

    const brand = createBrandObj(payload);

    if (brand instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: brand
        });
    }

    const newBrand = await Brand.create(brand);

    return Promise.resolve(serializer(newBrand));
};

const deleteBrandByName = async (brandName) => {
    const removedBrand = await Brand.findOneAndRemove({ brandName: brandName });

    if (!removedBrand) {
        return Promise.reject({
            status: "fail",
            reason: "brand not found"
        });
    }

    if (removedBrand) {
        return Promise.resolve({
            _id: removedBrand._id,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return Brand.remove();
};

module.exports = {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
};
