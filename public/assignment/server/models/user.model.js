var q = require("q");
module.exports = function(db, mongoose, UserModel) {

    //var UserSchema = require("./user.schema.server.js")(mongoose);
    //var UserModel = mongoose.model('AssignUser', UserSchema);

    var api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUsersByIds: findUsersByIds,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function createUser(user) {
        var deferred = q.defer();
        UserModel.create(user, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findAllUsers() {
        var deferred = q.defer();
        UserModel.find(function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();
        UserModel.findById(userId, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var deferred = q.defer();
        if(user.phones) {
            if(user.phones && user.phones.indexOf(",")>-1) {
                user.phones =  user.phones.split(",");
            }
        }
        // create new user without an _id field
        var newUser = {
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phones: user.phones,
            roles: user.roles
        };
        UserModel.update (
            {_id: userId},
            {$set: newUser},
            function (err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    UserModel.findById(userId,
                        function (err, user) {
                            if(err) {
                                deferred.reject(err);
                            }
                            else {
                                deferred.resolve(user);
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();
        UserModel.remove({_id: userId}, function(err, users){
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        UserModel.findOne({ username: username }, function(err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(credentials) {
        var deferred = q.defer();
        UserModel.findOne(
            { username: credentials.username,
                password: credentials.password },
            function(err, doc) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function findUsersByIds (userIds) {
        var deferred = q.defer();
        UserModel.find({ '_id': { $in: userIds} }, function(err, users){
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });
    }
};
