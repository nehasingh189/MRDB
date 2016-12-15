module.exports = function(mongoose) {

    // use mongoose to declare a movie schema
    var MovieSchema = mongoose.Schema({
        tmdbId: String,
        title: String,
        imageUrl: String,
        videoUrl: [String],

        ratings: [
            {
                userId: String,
                username: String,
                value: Number
            }
        ],

        ratedByUsers: [String],

        reviews: [
            {
                userId: String,
                username: String,
                text: String,
                isCritic: Boolean
            }
        ],

        reviewedByUsers: [String]

    }, {collection: 'project.movie'});
    return MovieSchema;
};