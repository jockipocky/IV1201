require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



const bodyParser = require('body-parser');



//var indexRouter = require('./routes/index');
var usersRouter = require('./src/routes/auth');
var applicationsRouter = require('./src/routes/applications');
var app = express();



const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // <-- put your frontend URL/port here
  credentials: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    next();
});
//app.use('/', indexRouter);
app.use('/auth', usersRouter);

app.use('/applications', applicationsRouter);



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
 
