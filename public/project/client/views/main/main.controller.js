(function (){
    "use strict";
    angular
        .module("mrdb")
        .controller("MainController", MainController);

    function MainController($scope, $location){
        $scope.$location = $location;
    }
})();