const router = require('express').Router();
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createCategory = require('../../../../helpers/admin/category/createCategory');
const getCategories = require('../../../../helpers/admin/category/getCategories');
router.use(apiAuth);
router.get('/', getCategories);
router.post('/category', createCategory);
module.exports = router;