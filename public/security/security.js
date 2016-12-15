var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, ProjectUserModel, AssignmentUserModel, passport) {

    var googleConfig = {
        clientID        : '',
        clientSecret    : '',
        callbackURL     : ''
    };

    passport.use('project', new LocalStrategy(projectLocalStrategy));
    //passport.use('assignment', new GoogleStrategy(googleConfig, assignmentGoogleStrategy));
    passport.use('assignment', new LocalStrategy(assignmentLocalStrategy));
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

    function assignmentLocalStrategy(username, password, done) {
        AssignmentUserModel
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


    function assignmentGoogleStrategy(token, refreshToken, profile, done) {
        AssignmentUserModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var username = email.split('@')[0];
                        var newGoogleUser = {
                            username: username,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: email,
                            roles: ["student"],
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return AssignmentUserModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        //differentiate between project and assignment user.
        // So checking for reviews property which is in project user but not in assignment user.
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
            AssignmentUserModel
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