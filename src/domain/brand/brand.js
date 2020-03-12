let buildCreateBrandObj = function(brandValidator) {
    return ({
        brandName, 
        brandCode
    } = {}) => {

        const result = brandValidator({brandName, brandCode});
        
        if (result instanceof Error) {
            return result;
        }

        return new Brand(brandName, brandCode);

    }

}

class Brand {
    constructor(brandName, brandCode) {
        this.brandName = brandName;
        this.brandCode = brandCode;
    }
}

module.exports = buildCreateBrandObj;

