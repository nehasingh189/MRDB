var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, ProjectUserModel, passport) {

    var googleConfig = {
        clientID        : '',
        clientSecret    : '',
        callbackURL     : ''
    };

    passport.use('project', new LocalStrategy(projectLocalStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function projectLocalStrategy(username, password, done) {
        ProjectUserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
           if(user.hasOwnProperty('reviews')) {
            ProjectUserModel
                .findUserById(user._id)
                .then(
                    function(user){
                        done(null, user);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }
        else {
            ProjectUserModel
                .findUserById(user._id)
                .then(
                    function(user){
                        done(null, user);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }
    }
};