(function(){
    angular
        .module("mrdb")
        .controller("MovieController", MovieController);

    function MovieController($routeParams, $sce, MovieApiService, UserService, MovieService) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.isReadonly = true;
        vm.reviewMsg = "Login to write a review";
        vm.released = false;
        vm.hoveringOver = hoveringOver;
        vm.addRating = addRating;
        vm.addReview = addReview;

        function init() {
            setCurrentUser();
            getMovieDetails();
        }

        return init();

        function setCurrentUser() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                    if(vm.currentUser) {
                        vm.isReadonly = false;
                        vm.reviewMsg = "Write a Review";
                        vm.isCritic = vm.currentUser.roles.indexOf('critic')> -1;
                    }
                });
        }


        function populateCriticReviews() {
            vm.movie.userReviews = [];
            if(vm.movie.tempUserReviews) {
                for(var i = 0; i < vm.movie.tempUserReviews.length; i++) {
                    if (vm.movie.tempUserReviews[i].isCritic) {
                        var review = {
                            "author" : vm.movie.tempUserReviews[i].username,
                            "content" : vm.movie.tempUserReviews[i].text,
                            "userId" : vm.movie.tempUserReviews[i].userId
                        };
                        vm.movie.reviews.results.unshift(review);
                    }
                    else
                        vm.movie.userReviews.push(vm.movie.tempUserReviews[i]);
                }
            }
        }

        function hoveringOver(value) {
            vm.overStar = value;
            vm.percent = 100 * (value /5);
        }


        function addReview() {
            vm.review = {
                "movie" : vm.movie,
                "isCritic" : vm.isCritic,
                "text" : vm.movie.reviewContent
            };
            MovieService
                .addReview(vm.currentUser._id,vm.currentUser.username, vm.movie.id, vm.review)
                .then(function (response) {
                    vm.movie.tempUserReviews = response.data.reviews;
                    vm.movie.reviewedByUsers = response.data.reviewedByUsers;
                    vm.movie.reviewContent = null;
                    populateCriticReviews();
                });
        }


        function addRating() {
            if(!vm.isReadonly && vm.movie.ratedByUsers.indexOf(vm.currentUser._id) < 0){
                MovieService
                    .addRating(vm.currentUser._id, vm.currentUser.username, vm.movie.id, vm.movie.usersRating,vm.movie)
                    .then(function (response) {
                        vm.movie.usersRating = parseFloat(response.data.totalRatings);
                        vm.movie.ratings = response.data.ratings;
                        vm.movie.ratedByUsers = response.data.ratedByUsers;
                    });
            }
        }

        function getMovieDetails() {
            MovieApiService.findMovieByID(vm.id,
                function (response) {
                    if (response.videos.results.length > 0) {
                        var embedUrl = 'https://www.youtube.com/embed/';
                        response.video_path = $sce.trustAsResourceUrl(embedUrl + response.videos.results[0].key);
                        response.untrusted_video_url = embedUrl + response.videos.results[0].key;
                    }
                    response.credits.cast.splice(8, response.credits.cast.length - 8);
                    vm.movie = response;
                    vm.movie.criticsRating = response.vote_average / 2;
                    vm.movie.ratedByUsers = [];
                    vm.movie.reviewedByUsers = [];
                    var now = new Date();
                    var releaseDate = new Date(response.release_date);
                    if(now > releaseDate) {
                        vm.released = true;
                    }
                    MovieService
                        .getMovieDetails(vm.movie.id)
                        .then(function (response) {
                            if (response.data) {
                                vm.movie.usersRating = parseFloat(response.data.totalRatings);
                                vm.movie.tempUserReviews = response.data.reviews;
                                vm.movie.ratings = response.data.ratings;
                                vm.movie.ratedByUsers = response.data.ratedByUsers;
                                vm.movie.reviewedByUsers = response.data.reviewedByUsers;
                                populateCriticReviews();
                            }
                        })
                });
        }

    }
})();