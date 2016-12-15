module.exports = function(mongoose) {

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phones: [String],
        roles: [String]
    }, {collection: 'assignment.user'});
    return UserSchema;
};
