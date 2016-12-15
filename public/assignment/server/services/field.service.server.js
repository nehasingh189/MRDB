module.exports = function(app, formModel, fieldModel) {

    app.post("/api/assignment/form/:formId/field", createFieldForForm);
    app.get("/api/assignment/form/:formId/field", getFieldsForForm);
    app.get("/api/assignment/form/:formId/field/:fieldId", getFieldById);
    app.put("/api/assignment/form/:formId/field/:fieldId", updateField);
    app.delete("/api/assignment/form/:formId/field/:fieldId", deleteField);

    function createFieldForForm(req, res) {
        var field = req.body;
        var formId = req.params.formId;
        formModel.findFormById(formId)
            .then(
                function(form) {
                    fieldModel.createField(field)
                        .then(
                            function (field) {
                                form.fields.push(field);
                                form.save();
                                res.json(form.fields);
                            },
                            function(err) {
                                res.status(400).send(err);
                            });
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function getFieldsForForm (req, res) {
        var formId = req.params.formId;
        formModel.findFormById(formId)
            .then(
                function(form) {
                    res.json(form.fields);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function getFieldById (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        fieldModel.findFieldById(fieldId)
            .then(
                function(field) {
                    res.json(field);
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function updateField (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var newField = req.body;
        formModel.findFormById(formId)
            .then(
                function(form) {
                    fieldModel.updateField(fieldId, newField)
                        .then(
                            function (field) {
                                form.fields.id(fieldId).remove();
                                form.fields.push(field);
                                form.save();
                                res.json(form.fields);
                            },
                            function(err) {
                                res.status(400).send(err);
                            });
                },
                function(err) {
                    res.status(400).send(err);
                });
    }

    function deleteField (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        formModel.findFormById(formId)
            .then(
                function(form) {
                    fieldModel.deleteField(fieldId)
                        .then(
                            function (doc) {
                                form.fields.id(fieldId).remove();
                                form.save();
                                res.json(form.fields);
                            },
                            function (err) {
                                res.status(400).send(err);
                            });
                },
                function(err) {
                    res.status(400).send(err);
                });
    }
};