module.exports = function(mongoose) {

    var MovieSchema = require("./movie.schema.server.js")(mongoose);

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,

        roles: [String],

        rates: [
            {
                name: String,
                tmdbId: String,
                rating: Number,
                imageUrl: String
            }
        ],

        ratedMovies: [MovieSchema],

        reviews: [
            {
                name: String,
                tmdbId: String,
                review: String,
                imageUrl: String
            }
        ],

        reviewedMovies: [MovieSchema],
        follows: [
            {
                userId: String,
                username: String,
                rates: [
                    {
                        name: String,
                        tmdbId: String,
                        rating: Number,
                        imageUrl: String
                    }
                ],
                reviews: [
                    {
                        name: String,
                        tmdbId: String,
                        review: String,
                        imageUrl: String
                    }
                ]
            }
        ]
    }, {collection: 'project.user'});
    return UserSchema;
};
