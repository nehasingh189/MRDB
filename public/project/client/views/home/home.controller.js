(function (){
    "use strict";
    angular
        .module("mrdb")
        .controller("HomeController", HomeController);

    function HomeController(UserService, MovieApiService, $sce) {
        var vm = this;
        vm.genreName = genreName;

        function init() {
            getCurrentUser();
            getGenres();
            getTopRatedMovies();
            getNowplayingMovies();
        }

        return init();

        function getNowplayingMovies() {
            MovieApiService
                .getNowPlaying()
                .then(function(response){
                    vm.nowPlaying = response.data.results;

                });
        }

        function getGenres() {
            MovieApiService
                .getGenres()
                .then(function (response){
                    vm.genres = response.data.genres;
                })
        }


        function fetchAllUpComingVideos(resp) {
            var embedUrl = 'https://www.youtube.com/embed/';
            for (var r in resp) {
                if (resp[r].data.results.length > 0) {
                    vm.upcoming[r].video_url = $sce.trustAsResourceUrl(embedUrl + resp[r].data.results[0].key);
                }
            }
        }

        function getTopRatedMovies() {
            MovieApiService
                .getTopRatedMovies()
                .then(function(response){
                    vm.upcoming = response.data.results;
                });
        }

        function genreName(id) {
            for (var genre in vm.genres) {
                if (vm.genres[genre].id === id){
                    return vm.genres[genre].name;
                }
            }
        }

        function getCurrentUser() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                })
        }
    }
})();