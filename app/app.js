var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var pdfRouter = require('./routes/pdf');
var serviceRouter = require('./routes/service');
var adminServiceRouter = require('./routes/adminService');

const app = express();

app.all('*', function(req, res, next) {
  const MYSQLENGINE = require('mysqlEngine');
  const eng = new MYSQLENGINE();
  // const _dbConfig = require('/var/_config/mysql/dev/dbConfig.json');
  req.app.set('mysqlEngine', eng);
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  next();
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/pdf', pdfRouter);
app.use('/_service_', serviceRouter);
app.use('/_adminService_', adminServiceRouter);

/*
app.use('/', express.static('public/build/'))
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});*/
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
