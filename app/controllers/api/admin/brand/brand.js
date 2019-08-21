const router = require('express').Router();
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createBrand = require('../../../../helpers/admin/brand/createBrand');
const getBrands = require('../../../../helpers/admin/brand/getBrands');

router.use(apiAuth);
router.get('/', adminAuth, getBrands);
router.post('/brand', adminAuth, createBrand);
module.exports = router;