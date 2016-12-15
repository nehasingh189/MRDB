module.exports = function(app, criticModel) {
    app.post("/api/project/critic/:userId/userName/:username/movie/:title", saveReview);
    app.get("/api/project/critic", findAllCritics);
    app.get("/api/project/critic/:userId", findCritic);
    app.delete("/api/project/critic/:id", deleteCritic);

    function saveReview(req, res) {
        var userId = req.params.userId;
        var username = req.params.username;
        var title = req.params.title;
        var review = req.body.review;
        criticModel
            .saveReview(userId, username, title, review)
            .then(
                function (doc) {
                    res.json(doc);
                },
                function (err) {
                    res.status(400).send(err);

                }
            );
    }

    function findAllCritics(req, res) {
        criticModel
            .findAllCritics()
            .then(
                function (critics) {
                    res.json(critics);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findCritic(req, res) {
        var userId = req.params.userId;
        criticModel
            .findCritic(userId)
            .then(
                function (doc) {
                    res.json(doc);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function deleteCritic(req, res) {
        var id = req.params.id;
        criticModel
            .deleteCritic(id)
            .then(
                function (doc) {
                    res.json(doc);
                },
                function (err) {
                    res.status(400).send(err);
                });

    }
};