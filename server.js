var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var validator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var users = require('./routes/users');
var items = require('./routes/items');

mongoose.connect('mongodb://heroku_nqp9659l:fokrlgfpjrjka0of8ec9n3u2fm@ds013216.mlab.com:13216/heroku_nqp9659l',
//mongoose.connect('mongodb://localhost/HoneyFetch', 
    function() {
        console.log('HoneyFetch database connected!');
    });

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(validator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use('/users', users);
app.use('/items', items);

server.listen(process.env.PORT || 3000);
console.log("Server started on port 3000");

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/html/index.html');
});

app.use(express.static('public'));
