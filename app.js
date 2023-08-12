var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var carsRouter = require('./routes/cars');
var tiresRouter = require('./routes/tires');
var batteriesRouter = require('./routes/batteries');
var accessoriesRouter = require('./routes/accessories');

const mongoose = require('mongoose')
const systemConfig = require('./config/system')

var app = express(); 

// auth setup
var passport = require('passport')
var session = require('express-session')
var githubStrategy = require('passport-github2').Strategy


var userModel = require('./models/user')


// multer setup - For image/file save feature implementation
const multer = require('multer')

// No use of this
// const storage = multer.diskStorage({
//   destination: "/uploads/images",
//   filename: (req, file, callback) => {
//     callback(null, file.fieldname)
//   }
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//using the session object and setting up the options
app.use(session({
  secret: 'xstore2023', // secret session key for the app
  resave: false, // no re-save without any change in session state
  saveUninitialized: false // no save without any session state instantiation
}))

// linking with the app
app.use(passport.initialize())
app.use(passport.session())

passport.use(userModel.createStrategy())

passport.use(new githubStrategy({
  clientID: systemConfig.oauth.github.clientID,
  clientSecret: systemConfig.oauth.github.clientSecret,
  callbackURL: systemConfig.oauth.github.callbackURL
},
  // create async callback function
  // profile is github profile
  async (accessToken, refreshToken, profile, done) => {
    // search user by ID
    const user = await userModel.findOne({ oauthId: profile.id });
    // user exists (returning user)
    if (user) {
      // no need to do anything else
      return done(null, user);
    }
    else {
      // new user so register them in the db
      const newUser = new userModel({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        oauthDateCreated: Date.now()
      });
      // add to DB
      const savedUser = await newUser.save();
      // return
      return done(null, savedUser);
    }
  }
));

passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())



const hbs = require('hbs')

hbs.registerHelper('optionGenerator', (optValue, targetValue) => {
  var selectedAttribute = ''
  if (optValue === targetValue)
  {
    selectedAttribute = 'selected'
  }
    return new hbs.SafeString(`<option value="${optValue}" ${selectedAttribute} >${optValue}</option>`)
})

hbs.registerHelper('areEqual', (firstVal, lastVal) => {
  return (firstVal === lastVal)
})

// app.use(hbs)

mongoose.connect(systemConfig.db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((msg) => {
  console.log('Database Connection Successful!')
})
.catch((err) => {
  console.log('Error while connecting to database')
})

app.use('/', indexRouter);
app.use('/cars', carsRouter);
app.use('/tires', tiresRouter);
app.use('/batteries', batteriesRouter);
app.use('/accessories', accessoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
