(function (){
    "use strict";
    angular
        .module("mrdb")
        .controller("HeaderController", HeaderController);

    function HeaderController($scope, $location,UserService) {
        $scope.$location = $location;
        $scope.query = '';
        $scope.userquery = '';
        $scope.genrequery='';
        $scope.submitmoviegenre = submitmoviegenre;
        $scope.submit = submit;
        $scope.submitusername = submitusername;
        $scope.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function () {
                    UserService.setCurrentUser(null);
                    $location.url("/home");
                });
        }


        function submit() {
            if ($scope.query) {
                $location.url("/search/" + $scope.query);
                $scope.query = '';
            }
        }

        function submitusername() {
            if ($scope.userquery) {
                $location.url("/userseach/" + $scope.userquery);
                $scope.userquery = '';
            }
        }


            function submitmoviegenre(){

            if($scope.genrequery){
                $location.url("/searchByGenre/" + $scope.genrequery);
                $scope.query = '';
            }
        }



        $scope.Genre =[
            {id:28,name:'Action'},
            {id:12, name:'Adventure'},
            {id:35, name:'Comedy'},
            {id:99,name:'Documentary'},
            {id:80,name:'Crime'},
            {id:18,name:'Drama'},
            {id:10751,name:'Family'},
            {id:14,name:'Fantasy'},
            {id:36,name:'History'},
            {id:27,name:'Horror'},
            {id:10402,name:'Music'},
            {id:9648,name:'Mystery'},
            {id:10749,name:'Romance'},
            {id:878,name:'Sci-Fi'},
            {id:53,name:'Thriller'},
            {id:10752,name:'War'},
            {id:37,name:'Western'}
        ]
    }


})();