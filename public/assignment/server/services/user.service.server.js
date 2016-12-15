var bcrypt = require("bcrypt-nodejs");
module.exports = function(app, userModel, passport) {

    var auth = authorized;
    //users end points
    app.post('/api/assignment/login', passport.authenticate('assignment'), login);
    app.post("/api/assignment/register", register);
    app.get("/api/assignment/loggedin", loggedin);
    app.post("/api/assignment/logout", logout);
    app.put("/api/assignment/user/:id", auth, updateUser);
    app.get("/api/assignment/user", auth, getUser);

    //admin end points
    app.post("/api/assignment/admin/user", auth, createUser);
    app.get("/api/assignment/admin/user", auth, getAllUsers);
    app.get("/api/assignment/admin/user/:id", auth, getUserById);
    app.put("/api/assignment/admin/user/:id", auth, adminUpdateUser);
    app.delete("/api/assignment/admin/user/:id", auth, deleteUser);


    function createUser (req, res) {
        if(isAdmin(req.user)) {
            var newUser = req.body;
            if(!newUser.roles)
                newUser.roles = ["student"];
            userModel
                .findUserByUsername(newUser.username)
                .then(
                    function(user){
                        if(user == null) {
                            newUser.password = bcrypt.hashSync(newUser.password);
                            return userModel.createUser(newUser)
                                .then(
                                    function(){
                                        return userModel.findAllUsers();
                                    },
                                    function(err){
                                        res.status(400).send(err);
                                    }
                                );
                        } else {
                            return userModel.findAllUsers();
                        }
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){
                        res.json(users);
                    },
                    function(){
                        res.status(400).send(err);
                    }
                )
        } else {
            res.send(403);
        }
    }

    function register (req, res) {
        var newUser = req.body;
        newUser.roles = ["student"];
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return userModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function getAllUsers(req, res) {
        if(isAdmin(req.user)) {
            userModel.findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function (err) {
                        res.status(400).send(err);
                    });
        }else {
            res.send(403);
        }
    }

    function getUser (req, res) {
       if (req.query.username) {
            if (req.query.password) {
                var credentials = {
                    username: req.query.username,
                    password: req.query.password
                };
                userModel.findUserByCredentials(credentials)// /api/assignment/user?username=username&password=password
                    .then(
                        function (doc) {
                            res.json(doc);
                        },
                        function ( err ) {
                            res.status(400).send(err);
                        })
            }
            else {
                userModel.findUserByUsername(req.query.username)// /api/assignment/user?username=username
                    .then(
                        function (doc) {
                            res.json(doc);
                        },
                        function ( err ) {
                            res.status(400).send(err);
                        })
            }
        }
        else
            res.json(null);
    }

    function getUserById (req, res) {
        if(isAdmin(req.user)) {
            var userId = req.params.id;
            userModel.findUserById(userId)
                .then(
                    function (doc) {
                        res.json(doc);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else {
            res.send(403);
        }
    }

    function updateUser(req,res) {
        var userId = req.params.id;
        var userToUpdate = req.body;
        if((!isAdmin(req.user)) && (userToUpdate.roles.indexOf("admin") > -1) ) {
            res.send(403);
        }
        else {
            userModel
                .findUserById(userId)
                .then(
                    function (user) {
                        if (user.password !== userToUpdate.password) {
                            userToUpdate.password = bcrypt.hashSync(userToUpdate.password);
                        }
                        userModel
                            .updateUser(userId, userToUpdate)
                            .then(
                                function (doc) {
                                    res.json(doc);
                                },
                                function (err) {
                                    res.status(400).send(err);
                                }
                            );
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function adminUpdateUser (req, res) {
        if(isAdmin(req.user)) {
            var userId = req.params.id;
            var userToUpdate = req.body;
            if(userToUpdate.roles.length < 1)
                userToUpdate.roles = ["student"];
            userModel
                .findUserById(userId)
                .then(
                    function (user) {
                        if (user.password !== userToUpdate.password) {
                            userToUpdate.password = bcrypt.hashSync(userToUpdate.password);
                        }
                        userModel
                            .updateUser(userId, userToUpdate)
                            .then(
                                function (doc) {
                                    res.json(doc);
                                },
                                function (err) {
                                    res.status(400).send(err);
                                }
                            );
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else {
            res.send(403);
        }
    }

    function deleteUser (req, res) {
        if(isAdmin(req.user)) {
            var userId = req.params.id;
            userModel.deleteUser(userId)
                .then(
                    function (doc) {
                        res.json(doc);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.send(403);
        }
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.json(req.isAuthenticated() ? req.user : null);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function isAdmin(user) {
        if(user.roles.indexOf("admin") > -1) {
            return true;
        }
        return false;
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }
};
