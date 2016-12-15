(function() {
    angular
        .module("mrdb")
        .factory("CriticService", CriticService);

    function CriticService($http, $q) {

        var api = {
            saveReview: saveReview,
            getAllCritics: getAllCritics,
            getCritic: getCritic,
            deleteCritic: deleteCritic
        };
        return api;

        function saveReview(userId, username,title, review) {
            return $http.post("/api/project/critic/" + userId + "/userName/" + username + "/movie/" + title, review);
        }

        function getAllCritics(){
            return $http.get("/api/project/critic");
        }

        function getCritic(userId){
            return $http.get("/api/project/critic/"+userId);
        }

        function deleteCritic(id){
            return $http.delete("/api/project/critic/"+id);
        }
    }
})();