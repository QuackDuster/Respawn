var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usuariosRouter = require('./routes/usuarios')
var tokenRouter = require('./routes/token')
var figurasRouter = require('./routes/figuras')
var figurasAPIRouter = require('./routes/API/figuras');
var usuariosAPIRouter = require('./routes/API/usuarios')

const store = new session.MemoryStore;

var app = express()
app.use(session({
  coockie: {maxAge: 240* 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'figuras_respawn'
}))

var app = express();

var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/tienda_figuras';
mongoose.connect(mongoDB, { useNewUrlParser:true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexion: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/figuras', figurasRouter);
app.use('/API/figuras', figurasAPIRouter);
app.use('/API/usuarios', usuariosAPIRouter)

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
