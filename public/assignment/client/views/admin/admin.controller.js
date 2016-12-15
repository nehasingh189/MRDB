(function () {
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController(UserService) {
        var vm = this;
        vm.predicate = 'username';
        vm.reverse = false;
        vm.order = order;
        vm.addUser = addUser;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.updateUser = updateUser;
        vm.findAllUsers = findAllUsers;
        function init() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                    findAllUsers();
                });
        }
        return init();

        function order(predicate) {
            vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
            vm.predicate = predicate;
        }

        function findAllUsers(){
            UserService
                .findAllUsers()
                .then(function (resp) {
                    vm.users = resp.data;
                    console.log(vm.users);
                })
        }

        function selectUser(user) {
            vm.selectedIndex = vm.users.indexOf(user);
            vm.user={
                _id: user._id,
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phones: user.phones,
                roles: user.roles
            };
        }

        function addUser(user) {
            if (user && user.username && user.password && !user._id) {
                UserService
                    .createUser(user)
                    .then(function () {
                        vm.user = {};
                        findAllUsers();
                    })
            }
            else
                vm.user = {};
        }

        function updateUser(user) {
            if (user && user._id && user.username && user.password) {
                UserService
                    .adminUpdateUser(user._id, user)
                    .then(function () {
                        vm.user = {};
                        findAllUsers();
                    })
            }
            else
                vm.user = {};
        }

        function deleteUser(user) {
            UserService
                .deleteUserById(user._id)
                .then(function (response) {
                    if (vm.user && vm.user._id && user._id === vm.user._id) {
                        vm.user = {};
                        vm.selectedIndex = {};
                    }
                    findAllUsers();
                })
        }
    }
})();