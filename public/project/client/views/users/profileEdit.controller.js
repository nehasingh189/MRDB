(function () {
    "use strict";
    angular
        .module("mrdb")
        .controller("ProfileEditController", ProfileEditController);

    function ProfileEditController($location, UserService) {
        var vm = this;
        vm.error = null;
        vm.message = null;
        vm.update = update;

        function init() {
            UserService
                .getProfile()
                .then(function (response) {
                    vm.currentUser = response.data;
                });
        }

        return init();

        function update (user) {
            vm.error = null;
            vm.message = null;

            if (user === null) {
                vm.error = "Please fill in the required fields";
                return;
            }
            if (!user.username) {
                vm.error = "Please provide a username";
                return;
            }
            if (!user.password) {
                vm.error = "Please provide a password";
                return;
            }
            if (!user.email) {
                vm.error = "Please provide a valid email";
                return;
            }
            UserService
                .updateUser(user._id, user)
                .then(function (response) {
                    if(response.data) {
                        vm.message = "User updated successfully";
                        UserService.setCurrentUser(response.data);
                        $location.url("/profile");
                    }
                    else
                        vm.error = "Unable to update the user";
                });
        }
    }
})();