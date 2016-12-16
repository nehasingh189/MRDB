module.exports = function(mongoose) {

    // use mongoose to declare a critic schema
    var CriticSchema = mongoose.Schema({
        userId: String,
        username: String,
        title: String,
        review: String

    }, {collection: 'project.critic'});
    return CriticSchema;
};