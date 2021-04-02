const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config({'path': './.env'});

// routes
const loginRouter = require('./routes/auth');
const refereeRouter = require('./routes/referee');
const clubRouter = require('./routes/club');
const playersRouter = require('./routes/player');
const userRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//DB connection
require("./database/connection");

// listen on routes
app.use('/auth', loginRouter);
app.use('/referees', refereeRouter);
app.use('/clubs', clubRouter);
app.use('/players', playersRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.send({
    content: 'Not found'
  });
});

// error handler
app.use(function(err, req, res, next) {
  if (! err) {
    return next();
  }
  console.log(err);
  res.status(500);
  res.send({
    content: 'Internal server error'
  });
});

module.exports = app;
