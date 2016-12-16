(function (){
    "use strict";
    angular
        .module("mrdb")
        .controller("UserSearchController", UserSearchController);

    function UserSearchController(UserService, $routeParams, $sce,$location) {
        var vm = this;
        vm.getUserByUsername = getUserByUsername;
        vm.userquery = $routeParams.userquery;


        function init() {
            if (vm.userquery) {
                getCurrentUser();
                getUserByUsername(vm.userquery);
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

        function getUserByUsername(userquery) {
            var promise = UserService
                .getUserByUsername(userquery);

            promise
                .success(function(user){
                    $location.url("/profile/"+user._id);




            })
                 .error(function (err) {
                vm.error = "The user you are looking for does not exist. Please check the username again!!!";
                $location.url("/home")
            });

        }


    }
})();