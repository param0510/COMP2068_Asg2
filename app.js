var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var carsRouter = require('./routes/cars');

const mongoose = require('mongoose')
const systemConfig = require('./config/system')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const hbs = require('hbs')

hbs.registerHelper('optionGenerator', (optValue, targetValue) => {
  var selectedAttribute = ''
  if (optValue === targetValue)
  {
    selectedAttribute = 'selected'
  }
    return new hbs.SafeString(`<option value="${optValue}" ${selectedAttribute} >${optValue}</option>`)
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