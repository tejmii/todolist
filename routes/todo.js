var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

require('../models/todo');
require('../models/user');

var todo = mongoose.model('todo');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

router.get('/all', isAuthenticated, function(req, res){
    todo.find({user: req.session.passport.user}, function(err, todos){
        res.render('todo', {items:todos});
    });
});

router.get('/done', isAuthenticated, function(req, res){
    todo.find({user: req.session.passport.user, status: "done"}, function(err, todos){
        res.render('todo', {items:todos});
    });
});

router.post('/add',isAuthenticated, function(req, res){
	new todo({task: req.body.task, user: req.session.passport.user}).save(function(err, doc){
		res.redirect('/todo/all');
	});
});

router.get('/delete/:id',isAuthenticated, function(req, res){
	todo.remove({_id: req.params.id}, function(err){
		res.redirect('/todo/all');
	});
});

router.post('/update',isAuthenticated, function(req, res){
	todo.where({_id: req.body.id}).update({status: req.body.status}, function(err, doc){
        res.redirect('/todo/all');
	});
});

router.get('/json',isAuthenticated, function(req, res){
    todo.find({user: req.session.passport.user}, function(err, todos){
        res.json({items:todos});
    });
});

router.get('/done/json',isAuthenticated, function(req, res){
    todo.find({user: req.session.passport.user, status: "done"}, function(err, todos){
        res.json({items:todos});
    });
});

module.exports = router;
