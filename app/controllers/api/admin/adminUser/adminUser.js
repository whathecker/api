const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const AdminUser = require('../../../../models/AdminUser');
const apiAuth = require('../../../../middlewares/verifyApikey');
const adminAuth = require('../../../../middlewares/adminAuth');
const createAdminUser = require('../../../../helpers/admin/adminUser/createAdminUser');
const loginAdminUser = require('../../../../helpers/admin/adminUser/loginAdminUser');

router.use(apiAuth);
router.use(passport.initialize());

passport.use('admin-local', new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password'}, 
    async (email, password, done) => {

        try {
            const adminUser = await AdminUser.findOne({ email: email }).exec();
            console.log(adminUser);
            if (!adminUser) {
                return done(null, false);
            }
            const passwordMatch = adminUser.validatePassword(adminUser, password);
            //const passwordMatch = adminUser.validatePassword(adminUser, password);

            if (!passwordMatch) {
                return done(null, false);
            }
            if (passwordMatch) {
                return done(null, adminUser);
            } else {
                return done('Incorrect email or password');
            }

        } catch (error) {
            done(error);
        }

}));

router.post('/user/login', loginAdminUser);
router.post('/user', createAdminUser);


module.exports = router;