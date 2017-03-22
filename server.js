// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var passport = require("passport");
var session = require("express-session");
var express = require('express');
var path =require('path');
var cookieSecret = 'anything';


// Create a new express app
var app = express();
app.use(cookieParser());
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(__dirname +"/public"));

// -------------------------------------------------
app.use(session({secret: cookieSecret,
                saveUninitialized: true,
                resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// MongoDB configuration (Change this URL to your own DB)
mongoose.connect("mongodb://localhost/userDB");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Facebook Login oauth routes
require('./auth/passport')(passport);
require('./routes/routes.js')(app,passport);
// require('./routes/routes.js')(app);

// Starting our express server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
