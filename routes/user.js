var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(),
    passport 	   = require('passport'),
    passportLocal  = require('passport-local');

require('../models/user');

var User = mongoose.model('user');

passport.use( new passportLocal.Strategy(function(username, password, done){
	User.findOne({ username: username }, function (err, user) {
      if (!user) {
        return done(null, false, { message: 'Username not found' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Wrong password' });
      }
      return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/', function(req, res){
	if(req.isAuthenticated()){
		res.redirect('/todo/all');
	}
	res.render('login', { message: req.session.messages });
});

router.post('/', loginPost);

function loginPost(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.messages = info.message;
      return res.redirect('/');
    }
	req.logIn(user, function(err) {
		if (err) {
			req.session.messages = "Error";
			return next(err);
		}
      return res.redirect('/todo/all');
    });
    
  })(req, res, next);
}

router.get('/logout', function(req, res){
	req.logout();
	req.session.messages = "";
	res.redirect('/');
});

router.get('/signup', function(req, res){	
	if(req.isAuthenticated()){
		res.redirect('/todo/all');
	}
	res.render('signup');
});

router.post('/signup', function(req, res){	
	new User({username: req.body.username, password: req.body.password}).save(function(err, doc){
        res.redirect('/');
	});
});

module.exports = router;