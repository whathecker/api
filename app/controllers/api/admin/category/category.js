const router = require('express').Router();
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createCategory = require('../../../../helpers/admin/category/createCategory');
const getCategories = require('../../../../helpers/admin/category/getCategories');
router.use(apiAuth);
router.get('/', adminAuth, getCategories);
router.post('/category', adminAuth, createCategory);
module.exports = router;