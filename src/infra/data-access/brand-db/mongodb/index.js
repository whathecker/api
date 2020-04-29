const Brand = require('../../../db/mongodb/models/brand');
const serializer = require('./serializer');
const createBrandObj = require('../../../../domain/brand');

const listBrands = async () => {
    const brands = await Brand.find();
    return Promise.resolve(serializer(brands));
};

const findBrandByName = async (brandName) => {
    const brand = await Brand.findOne({ brandName: brandName });

    if (!brand) {
        return Promise.resolve({
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

    try {
        await _isBrandNameUnique(brand.brandName);
        await _isBrandCodeUnique(brand.brandCode);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newBrand = await Brand.create(brand);

    return Promise.resolve(serializer(newBrand));
};

async function _isBrandNameUnique (brandName) {
    const brand = await findBrandByName(brandName);
    
    const { status } = brand;

    if (status === "fail") return;
    
    throw new Error('db access for brand object failed: brandName must be unique');
}

async function _isBrandCodeUnique (brandCode) {
    const brand = await Brand.findOne({ brandCode: brandCode });

    if (!brand) return;
    
    throw new Error('db access for brand object failed: brandCode must be unique');
}

const deleteBrandByName = async (brandName) => {
    const removedBrand = await Brand.findOneAndRemove({ brandName: brandName });

    if (!removedBrand) {
        return Promise.resolve({
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
    return await Brand.remove();
};

module.exports = {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
};
