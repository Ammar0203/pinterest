require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { default: mongoose } = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const { default: axios } = require('axios');
const cors = require('cors')
require('./strategies/local-strategy')

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'))
app.use('/api/image', require('./routes/image'))

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
});


async function connect() {
  try {
    const PORT = process.env.PORT || 3000
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('DB connected successfully')
    app.listen(PORT)
    console.log(`Server running on ${PORT}`)
  }
  catch (err) {
    console.log(err)
  }
}
connect()

module.exports = app;