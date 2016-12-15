module.exports = function(mongoose) {

    // use mongoose to declare a critic schema
    var CriticSchema = mongoose.Schema({
        userId: String,
        username: String,
        title: String,
        review: String

        // store critic documents in this collection
    }, {collection: 'project.critic'});
    return CriticSchema;
};