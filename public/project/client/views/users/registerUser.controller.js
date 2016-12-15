(function () {
    "use strict";
    angular
        .module("mrdb")
        .controller("RegisterUserController", RegisterUserController);

    function RegisterUserController($location, UserService) {
        var vm = this;
        vm.message = null;
        vm.register = register;

        function register() {
            vm.message = null;
            if (vm.user == null) {
                vm.message = "Please fill in the required fields";
                return;
            }
            if (!vm.user.username) {
                vm.message = "Please provide a username";
                return;
            }
            if (!vm.user.password || !vm.user.password2) {
                vm.message = "Please provide a password";
                return;
            }
            if (vm.user.password !== vm.user.password2) {
                vm.message = "Passwords must match";
                return;
            }
            if (!vm.user.email) {
                vm.message = "Please provide a valid email";
                return;
            }
            vm.user.roles = ["user"];
            vm.user.follows = [];
            UserService
                .register(vm.user)
                .then(
                    function(response) {
                        var user = response.data;
                        if(user != null) {
                            UserService.setCurrentUser(user);
                            $location.url("/profile");
                        }
                        else
                            vm.message = "Username already exists.";
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }
})();