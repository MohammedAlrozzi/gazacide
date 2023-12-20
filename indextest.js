const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Added packages
const session = require('express-session'); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 

const app = express();

// Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// User array 
let users = [{
  id: 1,
  username: 'john',
  password: 'secret' 
}];

// Passport config
passport.use(new LocalStrategy(function(username, password, done) {
  let user = users.find(u => u.username === username && u.password === password);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  let user = users.find(u => u.id === id);
  cb(null, user);
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect('/login'); 
}

// Rest of app code 

// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({message: 'Login successful'});
});

// Use authentication middleware
app.get('/incidents', isAuthenticated, (req, res) => {
  // ... route logic
}); 

app.post('/add-incident', isAuthenticated, (req, res) => {
  // ... route logic  
});

// Other routes...

app.listen(3000);