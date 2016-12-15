module.exports = function(app, formModel) {

    app.post("/api/assignment/user/:userId/form", createFormForUser);
    app.get("/api/assignment/user/:userId/form", getFormsForUser);
    app.get("/api/assignment/form/:formId", getFormById);
    app.put("/api/assignment/form/:formId", updateForm);
    app.put("/api/assignment/form/:formId/field/", sortFields);
    app.delete("/api/assignment/form/:formId", deleteForm);

    function createFormForUser (req, res) {
        var form = req.body;
        var userId = req.params.userId;
        formModel.createFormForUser(userId, form)
            .then(
                function (form) {
                    res.json(form);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function getFormsForUser (req, res) {
        var userId = req.params.userId;
        formModel.findAllFormsForUser(userId)
            .then(function (forms) {
                res.json(forms);
            },
            function(err) {
                res.status(400).send(err);
            });
    }

    function getFormById (req, res) {
        var formId = req.params.formId;
        formModel.findFormById(formId)
            .then(function(form) {
                    res.json(form);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function updateForm (req, res) {
        var formId = req.params.formId;
        var form = req.body;
        formModel.updateForm(formId, form)
            .then(
                function(doc) {
                    res.json(doc);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function deleteForm (req, res) {
        var formId = req.params.formId;
        formModel.deleteForm(formId)
            .then(
                function() {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function sortFields(req,res){
        var formId = req.params.formId;
        var fields = req.body;
        formModel.sortFields(formId, fields)
            .then(
                function(form) {
                    res.json(form);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

};