module.exports = function(app, db, mongoose, passport, ProjectUserModel) {

    var movieModel = require("./models/movie.model.js")(db, mongoose);
    var criticModel = require("./models/critic.model.js")(db, mongoose);

    var userService  = require("./services/user.service.server.js") (app, ProjectUserModel, movieModel, passport);
    var movieService  = require("./services/movie.service.server.js") (app, ProjectUserModel, movieModel);
    var criticService  = require("./services/critic.service.server.js") (app, criticModel);
};