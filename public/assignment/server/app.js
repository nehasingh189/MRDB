module.exports = function(app, db, mongoose, passport, AssignmentUserModel) {
    //var userModel    = require("./models/user.model.js")(db, mongoose, AssignmentUser);
    var formModel   = require("./models/form.model.js")(db, mongoose);
    var fieldModel   = require("./models/field.model.js")(db, mongoose);

    var userService  = require("./services/user.service.server.js") (app, AssignmentUserModel, passport);
    var formService = require("./services/form.service.server.js")(app, formModel);
    var fieldService = require("./services/field.service.server.js")(app, formModel, fieldModel);
};