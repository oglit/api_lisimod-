// Require Dependencias
var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var favicon = require('favicon');
var fs = require('fs');
var multer = require('multer');



// require mongo
var db = require('./db/db.js');
db.conectar();
var app = express();

// require todos los modelos
fs.readdirSync(__dirname+ '/models').forEach(function(filename){
  if (~filename.indexOf('.js')) require(__dirname+'/models/'+filename);
});


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade'); 

app.use(multer({ dest: './uploads/'}));

// middlewares
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
//habilita cors en toda la api
app.use(cors()); 
app.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

// // Force HTTPS on Heroku
// if (app.get('env') === 'production') {
//   app.use(function(req, res, next) {
//     var protocol = req.get('x-forwarded-proto');
//     protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
//   });
// }
// app.use(express.static(path.join(__dirname, '../../client')));


// routes API
app.use('/', require('./routes'));


// ERROR HANDLERS

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
      res.send('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
    res.send('error', {
    message: err.message,
    error: {}
  });
});


// Start the server
app.set('port', process.env.PORT || 5000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;