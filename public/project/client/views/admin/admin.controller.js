(function () {
    "use strict";
    angular
        .module("mrdb")
        .controller("AdminController", AdminController);

    function AdminController(UserService, CriticService) {
        var vm = this;
        vm.accept = accept;
        vm.reject = reject;
        vm.getCritics = getCritics;

        function init() {
            UserService
                .getProfile()
                .then(function (response) {
                    vm.currentUser = response.data;
                });
            getCritics();
        }
        return init();

        function getCritics(){
            CriticService
                .getAllCritics()
                .then(function(response){
                    vm.critics = response.data;
                });
        }

        function accept(critic) {

            //remove from critic table
            CriticService
                .deleteCritic(critic._id)
                .then(function(response){
                    vm.critics = response.data;
                });
            // add critic role to critic.userId
            UserService
                .addRole(critic.userId, {"role":"critic"})
                .then(function (response) {
                });
            getCritics();
        }

        function reject(critic) {
            //remove from critic table
            CriticService
                .deleteCritic(critic._id)
                .then(function(response){
                    vm.critics = response.data;
                });
            getCritics();
        }
    }
})();