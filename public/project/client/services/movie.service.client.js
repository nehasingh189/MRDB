(function() {
    "use strict";
    angular
        .module("mrdb")
        .factory("MovieService", MovieService);
    function MovieService($http) {

        var api = {
            addRating: addRating,
            addReview: addReview,
            getMovieDetails: getMovieDetails
        };
        return api;

        function addRating(userId, username, tmdbId, rating, movie) {
            return $http.post("/api/project/movie/" + tmdbId + "/rating/" + rating + "/user/" + userId + "/username/" + username, movie);
        }

        function addReview(userId, username, tmdbId, review) {
            return $http.post("/api/project/movie/" + tmdbId + "/review/user/" + userId + "/username/" + username, review);
        }

        function getMovieDetails(tmdbId) {
            return $http.get("/api/project/movie/" + tmdbId + "/details");
        }
    }
})();
