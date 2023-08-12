// authorization checker - use to check if user is authorized or not
function isLoggedIn (req, res, next) {
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = isLoggedIn