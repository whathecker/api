
function isAuthenticated (req, res, next) {

    console.log(req.session);

    /*
    console.log(req.session.cookie);
    console.log(req.session.passport);
    console.log(req.user);
    
    if (!req.session.passport.user) {
        console.log('unauthorized user');
        res.status(401).json({ message: 'unauthoized user'});
    } else {
        next();
    } */
}

module.exports = isAuthenticated;