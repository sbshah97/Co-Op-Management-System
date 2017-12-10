var User = require('./models/user');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var flash = require('express-flash');
var express= require('express');
var User = require('../app/models/user');
var app= express();
module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/home', isLoggedIn, function(req, res){
		res.render('home.ejs', { user: req.user });
	});


	app.get('/categories', isLoggedIn, function(req, res){
		res.render('categories.ejs', { user: req.user });
	});

	app.get('/eat-chips', isLoggedIn, function(req, res){
		res.render('eat-chips.ejs', { user: req.user });
	});

	app.get('/forgot', function(req, res) {
		res.render('forgot', {
			user: req.user
		});
	});



	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/login',
		failureFlash: true
	}));



	app.post('/forgot', function(req, res, next) {
		async.waterfall([
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function(token, done) {
				User.findOne({ 'local.email' : req.body.email }, function(err, user) {
					console.log(token);
					if (!user) {
						req.flash('error', 'No account with that email address exists.');
						console.log("email dosnt exists" + req.body.email);
						return res.redirect('/forgot');
					}
					user.local.resetPasswordToken = token;
                    user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                   
                    user.save(function(err) {
                    	done(err, token, user);
                    });
                });
			},
			function(token, user, done) {
				var transporter = nodemailer.createTransport( {
					service: 'gmail',
					auth: {
						user: 'samplemailernitk@gmail.com',
						pass: '1234abcd!@#$'
					}
				}); 
				var mailOptions = {
					to: user.local.email,
					from: 'samplemailernitk@gmail.com',
					subject: 'Node.js Password Reset',
					text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				};
				
				transporter.sendMail(mailOptions, function(err, info) {
					console.log("email has been sent");
					req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
					done(err, 'done');
				});
			}
			], function(err) {
				if (err) return next(err);
				res.redirect('/forgot');
			});
	});



	app.get('/reset/:token', function(req, res) {
		User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
			if (!user) {
				req.flash('error', 'Password reset token is invalid or has expired.');
				console.log("password reset token is innvalid");
				return res.redirect('/forgot');
			}
			res.render('reset', {
				user: req.user
			});
		});
	});



	

	app.post('/reset/:token', function(req, res) {
		async.waterfall([
			function(done) {
				User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires' : { $gt: Date.now() } }, function(err, user) {
					if (!user) {
						req.flash('error', 'Password reset token is invalid or has expired.');
						console.log("niklo yahan se");
						return res.redirect('back');
					}

					user.local.password = user.generateHash(req.body.password);
					user.local.resetPasswordToken = undefined;
					user.local.resetPasswordExpires = undefined;

					user.save(function(err) {
						if(err)
							return done(err);
                        req.flash('success', 'Success! Your password has been changed.');
						return done(null, user);
					});
				});
			},
			function(user, done) {
				var transporter = nodemailer.createTransport( {
					service: 'google',
					auth: {
						user: 'samplemailernitk@gmail.com',
						pass: '1234abcd!@#$'
					}
				});
				var mailOptions = {
					to: user.local.email,
					from: 'samplemailernitk@gmail.com',
					subject: 'Your password has been changed',
					text: 'Hello,\n\n' +
					'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
				};
				transporter.sendMail(mailOptions, function(err) {
					req.flash('success', 'Success! Your password has been changed.');
					done(err);
				});
			}
			], function(err) {
				res.redirect('/');
			});
	});





	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}