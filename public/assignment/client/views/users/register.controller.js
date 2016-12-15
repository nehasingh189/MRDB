(function () {
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;
        vm.message = null;
        vm.register = register;

        function register(user) {
            vm.message = null;
            if (user == null) {
                vm.message = "Please fill in the required fields";
                return;
            }
            if (!user.username) {
                vm.message = "Please provide a username";
                return;
            }
            if (!user.password || !user.password2) {
                vm.message = "Please provide a password";
                return;
            }
            if (user.password !== user.password2) {
                vm.message = "Passwords must match";
                return;
            }
            if (!user.email) {
                vm.message = "Please provide a valid email";
                return;
            }
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