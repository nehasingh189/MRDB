/**
 * CS5610: NEHA SINGH
 */

(function(){
    angular
        .module("mrdb")
        .factory("MovieApiService", MovieApiService);

    function MovieApiService($http, $q){

        var api = {
            searchMovies: searchMovies,
            findMovieByID: findMovieByID,
            fetchVideoById: fetchVideoById,
            findCastByID: findCastByID,
            getNowPlaying: getNowPlaying,
            getUpcomingMovies: getUpcomingMovies,
            getPopularMovies: getPopularMovies,
            getTopRatedMovies: getTopRatedMovies,
            fetchAllVideos: fetchAllVideos,
            getGenres: getGenres,
            searchMovieByGenre:searchMovieByGenre
        };
        var apikey = "a1aa62ec3ff2b05c1b0e804adce79c24";
        var baseUrl = "https://api.themoviedb.org/3";
        return api;

            function getNowPlaying() {
            var url = baseUrl + '/movie/now_playing?api_key=' + apikey;
            return $http.get(url);
        }

        function getUpcomingMovies() {
            var url = baseUrl + '/movie/upcoming?api_key=' + apikey;
            return $http.get(url);
        }

        function getPopularMovies() {
            var url = baseUrl + '/movie/popular?api_key=' + apikey;
            return $http.get(url);
        }

        function getTopRatedMovies() {
            var url = baseUrl + '/movie/top_rated?api_key=' + apikey;
            return $http.get(url);
        }

        function searchMovieByGenre(genrequery){
            var genreSearchurl = baseUrl + '/genre/'+ genrequery+'/movies?api_key=' + apikey;
            return $http.get(genreSearchurl);

        }
        function searchMovies(query) {
            var moviesSearchUrl = baseUrl + '/search/movie?api_key=' + apikey + '&query=' + query + '&language=en&include_adult=false';
            return $http.get(moviesSearchUrl);
        }

        function findMovieByID(id, callback) {
            var appendTags = 'videos,credits,reviews';
            $http.get(baseUrl + '/movie/' + id + '?api_key=' + apikey + '&append_to_response=' + appendTags)
                .success(callback);
        }

        function findCastByID(id, callback) {
            var appendTags = 'movie_credits';
            $http.get(baseUrl + '/person/' + id + '?api_key=' + apikey + '&append_to_response=' + appendTags)
                .success(callback);
        }

        function fetchVideoById(id) {
            var videoUrl = baseUrl + '/movie/' + id + '/videos?api_key=' + apikey;
            return $http.get(videoUrl);
        }

        function fetchAllVideos(movies) {
            var promises = movies.map(function(movie) {
                var videoUrl = baseUrl + '/movie/' + movie.id + '/videos?api_key=' + apikey;
                return $http.get(videoUrl);
            });
            return $q.all(promises);
        }

        function getGenres() {
            var url = baseUrl + '/genre/movie/list?api_key=' + apikey;
            return $http.get(url);
        }
    }
})();