const router = require('express').Router();
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createSkinType = require('../../../../helpers/admin/skinType/createSkinType');
const getSkinTypes = require('../../../../helpers/admin/skinType/getSkinTypes');
router.use(apiAuth);

router.get('/', getSkinTypes);
router.post('/skintype', createSkinType);

module.exports = router;