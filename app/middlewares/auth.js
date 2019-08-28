
function isAuthenticated (req, res, next) {
    //console.log(req.user);
    !req.user? res.status(401).json({ message: 'unauthorized' }) : next();
}

module.exports = isAuthenticated;