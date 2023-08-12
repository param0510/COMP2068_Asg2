var express = require('express');
var router = express.Router();

var userModel = require('../models/user')
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'xStore', authUser: req.user });
});

router.get('/login', (req, res) => {
  // Obtain messages if any
  let messages = req.session.messages || [];
  // Clear messages
  req.session.messages = [];
  res.render('login', {title: 'Login', messages: messages})
})


router.post('/login', passport.authenticate('local', {
  successRedirect: '/cars',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}))


// github handlers

// GET handler for /github
// call passport authenticate and pass the name of the stragety 
// and the information we require from github
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));

// GET handler for /github/callback 
// this is the url they come back to after entering their credentials
router.get('/github/callback',
  // callback to send user back to login if unsuccessful
  passport.authenticate('github', { failureRedirect: '/login' }),
  // callback when login is successful
  (req, res, next) => { res.redirect('/cars') }
);


router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'})
  
})
router.post('/register', (req, res) => {
  userModel.register(new userModel({
    username: req.body.username
  }),
  req.body.password,
  (err, newUser) => {
    if (err){
      return res.redirect('/register')
    }
    else{
      req.logIn(newUser, (error) => {
        res.redirect('/cars')
      })
    }
  }
  )
})


router.get('/logout', (req, res) => {
  req.logout( (err) => {
    res.redirect('/login')
  })
})

module.exports = router;
