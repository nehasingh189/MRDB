(function (){
    "use strict";
    angular
        .module("mrdb")
        .controller("MovieSearchController", MovieSearchController);

    function MovieSearchController(UserService, $routeParams, MovieApiService, $sce) {
        var vm = this;
        vm.search = search;
        vm.query = $routeParams.query;
        vm.fetchAllVideos = fetchAllVideos;
        vm.genreName = genreName;

        function init() {
            if (vm.query) {
                getCurrentUser();
                search(vm.query);
                getGenres();
            }
        }

        return init();

        function getCurrentUser() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                })
        }

        function search(query) {
            MovieApiService
                .searchMovies(query)
                .then(function(response){
                    vm.movies = response.data.results;
                });
        }

        function fetchAllVideos(resp) {
            var embedUrl = 'https://www.youtube.com/embed/';
            for (var r in resp) {
                if(resp[r].data.results.length > 0) {
                    vm.movies[r].video_url = $sce.trustAsResourceUrl(embedUrl + resp[r].data.results[0].key);
                }
            }
        }

        function getGenres() {
            MovieApiService
                .getGenres()
                .then(function (response){
                    vm.genres = response.data.genres;
                })
        }

        function genreName(id) {
            for (var genre in vm.genres) {
                if (vm.genres[genre].id === id){
                    return vm.genres[genre].name;
                }
            }
        }
    }
})();