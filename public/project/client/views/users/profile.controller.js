(function () {
    "use strict";
    angular
        .module("mrdb")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService, $routeParams, $route) {
        var vm = this;
        vm.otherUserId = $routeParams.userId;
        vm.follow = false;
        vm.followOtherUser = followOtherUser;

        function init() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                        if(response.data) {
                            UserService
                                .getProfile()
                                .then(function (response) {
                                    vm.currentUser = response.data;
                                    vm.userProfile = response.data;
                                    getOtherProfile();
                                    setLabels();
                                });
                        }
                        else {
                            getOtherProfile();
                            setLabels();
                        }
                    }
                );
        }

        return init();

        function getOtherProfile(){
            if(vm.otherUserId){
                UserService
                    .getOtherProfile(vm.otherUserId)
                    .then(function (response){
                        vm.userProfile = response.data;
                        vm.isCritic = vm.userProfile.roles.indexOf('critic')> -1;
                        checkToEnableFollows();

                    });
            }
            else
                vm.isCritic = vm.userProfile.roles.indexOf('critic')> -1;
        }

        function followOtherUser() {
            var followDetails = {
                follower: vm.currentUser,
                followee: vm.userProfile
            };
            UserService.follow(followDetails)
                .then(function (response){
                    vm.currentUser = response.data;
                    vm.follow = false;
                    UserService.setCurrentUser(response.data);
                    getOtherProfile();
                });
        }

        function checkToEnableFollows(){
            if(vm.currentUser && (vm.currentUser._id != vm.userProfile._id)) {
                //check if current user already follows the other user
                for(var i = 0; i < vm.currentUser.follows.length; i++) {
                    var follow = vm.currentUser.follows[i];
                    if(follow.userId==vm.userProfile._id) {
                        vm.follow = false;
                        return;
                    }
                }
                vm.follow = true;
            }
        }

        function setLabels() {
            if(vm.currentUser && vm.currentUser._id != vm.userProfile._id)
                vm.userLabel = vm.userProfile.username + "'s";
            else
                vm.userLabel = "My";
        }
    }
})();