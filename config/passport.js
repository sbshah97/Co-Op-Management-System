var LocalStrategy = require('passport-local').Strategy;
var passport= require('passport');
var User = require('../app/models/user');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err,user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('error', 'That email already taken'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
                    newUser.local.firstname = req.body.firstname;
                    newUser.local.lastname = req.body.lastname;
                    newUser.local.telephone = req.body.telephone;
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({ 'local.email': email}, function(err, user){
				if(err)
					return done(err);
				if(!user)
					return done(null, false, req.flash('error', 'No User found'));
				if(!user.validPassword(password))
					return done(null, false, req.flash('error', 'invalid password'));

				return done(null, user);

			});
		});
	}
	));


};



