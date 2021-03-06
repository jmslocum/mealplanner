var express = require('express');
var morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var dbConfig = require('./src/config/database');

var app = express();
var port = process.env.PORT || 8080;

//Set up the server to log all requests to the console
app.use(morgan('dev'));

//Set up the server to log to the /var/log/mealplanner directory
/*
var accessLogStream = rfs('mealplanner-access.log', {
  interval: '1d',
  path: '/var/log/mealplanner'
});

app.use(morgan('combined', {stream: accessLogStream}));
*/
//Serve everything in the public directory statically
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());

//Set up the view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

//Get rid of warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

//Connect the database
mongoose.connect(dbConfig.url).catch(function(error) {
  if (error) {
    console.error('Unable to connect to database url: ' + dbConfig.url + ' error: ' + error);
  }
});

//Add the routes
var routes = require('./src/routes/routes');
var imageRoutes = require('./src/routes/imageRoutes');
var mealRoutes = require('./src/routes/mealRoutes');
var configRoutes = require('./src/routes/configRoutes');
var menuRoutes = require('./src/routes/menuRoutes');
var inventoryRoutes = require('./src/routes/inventoryRoutes');

app.use('/', routes);
app.use('/image', imageRoutes);
app.use('/meal', mealRoutes);
app.use('/config', configRoutes);
app.use('/menu', menuRoutes);
app.use('/inventory', inventoryRoutes);

app.listen(port, function(err) {
  if (err) {
    console.error('Unable to start server on port: ' + port + ', error: ' + err);
    return;
  }
  console.log('MealPlanner running on port: ' + port);
});
