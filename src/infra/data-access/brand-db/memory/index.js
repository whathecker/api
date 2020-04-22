let BRANDS = require('../../../db/memory/brand');
const createBrandObj = require('../../../../domain/brand');

const listBrands = () => {
    return Promise.resolve(BRANDS);
};

const findBrandByName = (brandName) => {
    const brand = BRANDS.find(brand => {
        return brand.brandName === brandName;
    });

    if (!brand) {
        return Promise.reject({
            status: "fail",
            reason: "brand not found"
        });
    }

    return Promise.resolve(brand);
}

const addBrand = (payload) => {

    const brand = createBrandObj(payload);

    if (brand instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: brand
        });
    }

    try {
        _isBrandNameUnique(brand.brandName);
        _isBrandCodeUnique(brand.brandCode);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }
    
    const new_id = BRANDS.length + 1;

    const newBrand = {
        _id: new_id.toString(),
        brandName: brand.brandName,
        brandCode: brand.brandCode
    }
    BRANDS.push(newBrand);

    return Promise.resolve(BRANDS[BRANDS.length - 1]);
};

async function _isBrandNameUnique (brandName) {
    const brand = await findBrandByName(brandName);

    const { status } = brand;

    if (status === "fail") return;
    
    throw new Error('db access for brand object failed: brandName must be unique');
}

function _isBrandCodeUnique (brandCode) {
    const brand = BRANDS.find(brand => {
        return brand.brandCode === brandCode;
    });

    if (!brand) return;
    
    throw new Error('db access for brand object failed: brandCode must be unique');
}


const deleteBrandByName = (brandName) => {

    return findBrandByName(brandName).then(brand => {

        if (!brand) {
            return Promise.reject({
                status: "failed",
                reason: "brand not found"
            });
        }

        if (brand) {
            let deletedBrand;
            BRANDS = BRANDS.filter(brand => {

                if (brand.brandName !== brandName) {
                    return true;
                }

                if (brand.brandName === brandName) {
                    deletedBrand = brand;
                    return false;
                }

            });
            
            return Promise.resolve({
                _id: deletedBrand._id,
                status: "success"
            });
        }
    });
};

const dropAll = () => {
    BRANDS = [];
    return Promise.resolve(BRANDS);
};

module.exports = {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
};