var express = require('express');
var app = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

var connectionString = process.env.MONGODB_URI||'mongodb://nehasingh189:nehasingh189@ds133328.mlab.com:33328/mrdb';

var db = mongoose.connect(connectionString);

connectionString = process.env.MLAB_DB_URL_INIT +
    process.env.MLAB_DB_USERNAME + ":" +
    process.env.MLAB_DB_PASSWORD +
    process.env.MLAB_DB_URL_END + '/' +
    process.env.MLAB_DB_NAME;


app.use(bodyParser.json());// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(multer());
app.use(
    session({ secret: process.env.PASSPORT_SECRET,
        resave: true,
        saveUninitialized: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), app.get('ipaddress'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var ProjectUserSchema = require("./public/project/server/models/user.schema.server.js")(mongoose);
var ProjectUser = mongoose.model("ProjectUser", ProjectUserSchema);
var ProjectUserModel = require('./public/project/server/models/user.model.js')(db, mongoose, ProjectUser);


require("./public/security/security.js")(app, ProjectUserModel, passport);
require("./public/project/server/app.js")(app, db, mongoose, passport, ProjectUserModel);
app.listen(port, ipaddress);