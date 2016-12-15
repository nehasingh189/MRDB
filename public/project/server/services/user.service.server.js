var bcrypt = require("bcrypt-nodejs");
module.exports = function(app, userModel, movieModel, passport) {

    var auth = authorized;
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../uploads' });

    app.post('/api/project/login', passport.authenticate('project'), login);
    app.post("/api/project/user", createUser);// admin
    app.post("/api/project/register", register);//register
    app.get("/api/project/user", auth, getUser);
    app.get("/api/project/user/:id", auth, getUserById);
    app.get("/api/project/user/:username",getUserByUsername);
    app.put("/api/project/user/follow", auth, follow);
    app.put("/api/project/user/:id", auth, updateUser);
    app.delete("/api/project/user/:id", auth, deleteUser);// admin
    app.get("/api/project/loggedin", loggedin);
    app.post("/api/project/logout", logout);
    app.get("/api/project/profile/:userId", profile);
    app.put("/api/project/user/:userId/role", auth, addRole);// admin
    app.post("/api/project/user/upload", upload.single('myFile'), uploadImage);
    function createUser (req, res) {
        if(isAdmin(req.user)) {
            var newUser = req.body;
            if(newUser.roles.length < 2)
                newUser.roles = ["user"];
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

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ["user"];
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

    function getUser (req, res) {
        if (Object.keys(req.query).length === 0) {
            userModel.findAllUsers() // /api/project/user
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function ( err ) {
                        res.status(400).send(err);
                    });
        }
        else if (req.query.username) {
            if (req.query.password) {
                var credentials = {
                    username: req.query.username,
                    password: req.query.password
                };
                userModel.findUserByCredentials(credentials)// /api/project/user?username=alice&password=wonderland
                    .then(
                        function (doc) {
                            req.session.currentUser = doc;
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

    function updateUser(req,res) {
        var userId = req.params.id;
        var userToUpdate = req.body;
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

    function loggedin(req, res) {
        res.json(req.isAuthenticated() ? req.user : null);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function profile(req, res) {
        var userId = req.params.userId;
        var user = null;
        userModel.findUserById(userId)
            .then(
                function (doc) {
                    user = doc;
                    var tmdbIds = [];
                    for(var r in user.rates) {
                        tmdbIds.push(user.rates[r].tmdbId);
                    }
                    // fetch movies this user has rated
                    return movieModel.findMoviesByTmdbIDs(tmdbIds);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (movies) {
                    user.ratedMovies = movies;
                    var tmdbIds = [];
                    for(var r in user.reviews) {
                        tmdbIds.push(user.reviews[r].tmdbId);
                    }
                    // fetch movies this user has reviewed
                    return movieModel.findMoviesByTmdbIDs(tmdbIds);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (movies) {
                    user.reviewedMovies = movies;
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function addRole(req, res) {
        if(isAdmin(req.user)) {
            var userId = req.params.userId;
            var role = req.body.role;
            userModel.findUserById(userId)
                .then(
                    function (user) {
                        if(user.roles.indexOf(role)<0) {
                            user.roles.push(role);
                        }
                        return userModel.updateUser(userId, user)
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                )
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

    function getUserByUsername(req, res) {
        var username = req.userquery.username;
        userModel
            .findUserByUsername(username)
            .then(
                function (users) {
                    if (users.length > 0) {
                        res.json(users[0]);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err.message);
                });
    }

    function follow(req, res) {
        var follower = req.body.follower;
        var followee = req.body.followee;
        var follow = {
            userId: followee._id,
            username: followee.username,
            rates: followee.rates,
            reviews: followee.reviews
        };
        follower.follows.push(follow);
        userModel.updateUser(follower._id, follower)
            .then(
                function (follower) {
                    req.session.currentUser = follower;
                    req.json(follower);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
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


    function uploadImage(req, res) {
        var userId = req.body.id;
        var width = req.body.width;
        var myFile = req.file;

        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;

        userModel
            .getUserById(userId,res)
            .then(
                function (user) {
                    // Set the url for the widget
                    user.url = "/uploads/" + filename;

                    // Update existing widget and redirect
                    userModel
                        .updateUser(userId, user)
                        .then(
                            function (updateUser) {
                                res.redirect("/project/#/user/" + userId);
                            },
                            function (failedUpdate) {
                                res.send(400).send(failedUpdate);
                            }
                        );
                },
                function (error) {
                    res.send(400).send(error);
                }
            );
    }

};

