var q = require("q");
module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var FormModel = mongoose.model('FormModel', FormSchema);

    var api = {
        createFormForUser: createFormForUser,
        findAllForms: findAllForms,
        findAllFormsForUser: findAllFormsForUser,
        findFormById: findFormById,
        updateForm: updateForm,
        deleteForm: deleteForm,
        findFormByTitle: findFormByTitle,
        sortFields: sortFields
    };
    return api;

    function createFormForUser(userId, form) {
        var deferred = q.defer();
        form.userId = userId;
        form.fields = [];
        FormModel.create(form,
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function findAllForms() {
        var deferred = q.defer();
        FormModel.find(
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function findAllFormsForUser(userId) {
        var deferred = q.defer();
        FormModel.find({ userId: userId },
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function findFormById(formId) {
        var deferred = q.defer();
        FormModel.findById(formId,
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function updateForm(formId, form) {
        var deferred = q.defer();
        // create new form without an _id field
        var newForm = {
            userId: form.userId,
            title: form.title,
            fields: form.fields,
            created: form.created,
            updated: form.updated
        };
        FormModel.update(
            {_id: formId},
            {$set: newForm},
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function deleteForm(formId) {
        var deferred = q.defer();
        FormModel.remove({_id: formId}, function(err, doc){
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findFormByTitle(title) {
        var deferred = q.defer();
        FormModel.find({ title: title },
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function sortFields(formId,fields){
        var deferred = q.defer();
        FormModel.update(
            {_id: formId},
            {$set: {fields: fields}},
            function(err, status) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    FormModel.findById(formId,
                        function(err, doc) {
                            if(err) {
                                deferred.reject(err);
                            }
                            else {
                                deferred.resolve(doc);
                            }
                        });
                }
            });
        return deferred.promise;
    }
};