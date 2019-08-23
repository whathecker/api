const router = require('express').Router();
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createCategory = require('../../../../controllers/admin/category/createCategory');
const getCategories = require('../../../../controllers/admin/category/getCategories');
router.use(apiAuth);
router.get('/', getCategories);
router.post('/category', createCategory);
module.exports = router;