let buildCreateBrandObj = function(brandValidator) {
    return ({
        brandName, 
        brandCode
    } = {}) => {

        let {error} = brandValidator({brandName, brandCode});
        if (error) {
            return new Error(error);
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

