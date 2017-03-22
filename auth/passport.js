//facebook strategy
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var keys = require('./keys');
// load up the user model
var User = require('../models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    })

    passport.use(new FacebookStrategy({
        // clientID: keys.facebookAuth.clientID,
        clientID:'1454706357935887',
        clientSecret:'fc82402acee632c6c9c3c43dffd33804',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
      
    },

        function (token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user); // user found, return that user
                    }

                    else {
                        // if there is no user, create them
                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.displayName;
                        // newUser.facebook.email = profile.emails[0].value,
                    newUser.facebook.picture = profile.photos[0].value;
                        newUser.facebook.link = profile.link;
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));
}