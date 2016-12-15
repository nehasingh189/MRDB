module.exports = function(app, userModel, movieModel) {
    app.get("/api/project/movie/:tmdbId/details", getMovieDetails);
    app.post("/api/project/movie/:tmdbId/rating/:ratedValue/user/:userId/username/:username", userRatesMovie);
    app.post("/api/project/movie/:tmdbId/review/user/:userId/username/:username", userReviewsMovie);

    function userRatesMovie(req, res) {
        var tmdbId = req.params.tmdbId;
        var rating = req.params.ratedValue;
        var userId = req.params.userId;
        var username = req.params.username;
        var movie = req.body;
        userModel
            .userRatesMovie(tmdbId,userId, movie, rating)
              .then(
                function (user) {
                    return movieModel.userRatesMovie(tmdbId, rating,userId, username, movie);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )

            .then(
                function (movie) {
                    movie._doc.totalRatings = calculateRatingsForMovie(movie);
                    res.json(movie);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function userReviewsMovie(req, res) {
        var tmdbId = req.params.tmdbId;
        var review = req.body.text;
        var userId = req.params.userId;
        var username = req.params.username;
        var movie = req.body.movie;
        var isCritic = req.body.isCritic;
        userModel
            .userReviewsMovie(tmdbId,userId, movie, review)
            .then(
                function (user) {
                    return movieModel.userReviewsMovie(tmdbId, review, userId, username, movie, isCritic);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
          .then(
                function (movie) {
                    res.json(movie);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function getMovieDetails(req, res) {
        var tmdbId = req.params.tmdbId;
        var movie = null;
        movieModel
            .findMovieByTmdbID(tmdbId)
            .then (
                function (doc) {
                    movie = doc;
                    if (doc) {
                        doc._doc.totalRatings = calculateRatingsForMovie(doc);
                        res.json(doc);
                    } else {
                        res.json (null);
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function calculateRatingsForMovie(movie) {
        var rCount = movie.ratings.length;
        var ratingSum = 0.0;
        for(var r in movie.ratings) {
            ratingSum += parseFloat(movie.ratings[r].value);
        }
        return ratingSum/rCount;
    }
};