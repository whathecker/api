const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const connector = require('../../../../utils/connector');
const dbString = connector.getDBString();
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);

const apiAuth = require('../../../../middlewares/verifyApikey');
const createAdminUser = require('../../../../helpers/admin/adminUser/createAdminUser');

const isLocal = process.env.NODE_ENV === "local";
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

router.use(apiAuth);

router.post('/user', createAdminUser);

module.exports = router;