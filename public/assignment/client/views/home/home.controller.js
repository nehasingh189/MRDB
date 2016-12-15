(function () {
    "use strict";
    angular.module("FormBuilderApp")
        .controller("HomeController", HomeController);

    function HomeController(UserService) {

        var vm = this;
        function init() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                });
        }
        return init();
    }
})();
