var q = require("q");
module.exports = function(db, mongoose) {

    var MovieSchema = require("./movie.schema.server.js")(mongoose);
    var Movie  = mongoose.model("Movie", MovieSchema);

    var api = {
        createMovie: createMovie,
        findMovieByTmdbID: findMovieByTmdbID,
        findMoviesByTmdbIDs: findMoviesByTmdbIDs,
        userRatesMovie: userRatesMovie,
        userReviewsMovie: userReviewsMovie
    };
    return api;

    function userRatesMovie (tmdbId, rating, userId, username, movie) {
        var deferred = q.defer();

        Movie.findOne({tmdbId: movie.id},
            function (err, doc) {
                if (err) {
                    deferred.reject(err);
                }

                if (doc) {

                    doc.ratings.push ({"userId": userId, "username": username, "value": parseInt(rating)});

                    doc.ratedByUsers.push (userId);
                    doc.save(function(err, doc){
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
                else {

                    movie = new Movie({
                        "tmdbId": tmdbId,
                        "title": movie.title,
                        "imageUrl": movie.poster_path,
                        "videoUrl": movie.untrusted_video_url,
                        "ratings": [],
                        "ratedByUsers": [],
                        "reviews": [],
                        "reviewedByUsers": []
                    });

                    movie.ratings.push ({"userId": userId, "username": username, "value": parseInt(rating)});

                    movie.ratedByUsers.push (userId);

                    movie.save(function(err, doc) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
            });

        return deferred.promise;
    }

    function userReviewsMovie (tmdbId, review, userId, username, movie, isCritic) {
        var deferred = q.defer();
        // find the movie by tmdb ID
        Movie.findOne({tmdbId: movie.id},
            function (err, doc) {
                if (err) {
                    deferred.reject(err);
                }
                if (doc) {
                    doc.reviews.push ({"userId": userId, "username": username, "text": review, "isCritic": isCritic});
                    doc.reviewedByUsers.push (userId);
                    doc.save(function(err, doc){
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
                else {
                     movie = new Movie({
                        "tmdbId": tmdbId,
                        "title": movie.title,
                        "imageUrl": movie.poster_path,
                        "videoUrl": movie.untrusted_video_url,
                        "ratings": [],
                        "ratedByUsers": [],
                        "reviews": [],
                        "reviewedByUsers": []
                    });
                    movie.reviews.push ({"userId": userId, "username": username, "text": review, "isCritic": isCritic});
                    movie.reviewedByUsers.push (userId);
                    movie.save(function(err, doc) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
            });

        return deferred.promise;
    }

    function createMovie(movie) {
        // create instance of movie
        var movie = new Movie({
            "tmdbId": movie.id,
            "title": movie.title,
            "imageUrl": movie.poster_path,
            "videoUrl": movie.untrusted_video_url,
            "ratings": [],
            "ratedByUsers": [],
            "reviews": [],
            "reviewedByUsers": []
        });
        var deferred = q.defer();
        // save movie to database
        movie.save(function (err, doc) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findMovieByTmdbID(tmdbId) {
        var deferred = q.defer();
        Movie.findOne({tmdbId: tmdbId}, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findMoviesByTmdbIDs (tmdbIds) {
        var deferred = q.defer();
        Movie.find({
            tmdbId: {$in: tmdbIds}
        }, function (err, movies) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(movies);
            }
        });
        return deferred.promise;
    }
};