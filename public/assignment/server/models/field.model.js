var q = require("q");
module.exports = function(db, mongoose) {

    var FieldSchema = require("./field.schema.server.js")(mongoose);
    var FieldModel = mongoose.model('FieldModel', FieldSchema);

    var api = {
        findFieldById: findFieldById,
        createField: createField,
        deleteField: deleteField,
        updateField: updateField
    };
    return api;

    function findFieldById(fieldId) {
        var deferred = q.defer();
        FieldModel.findById(fieldId,
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

    function createField(field) {
        var deferred = q.defer();
        FieldModel.create(field,
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

    function deleteField(fieldId) {
        var deferred = q.defer();
        FieldModel.remove({_id: fieldId}, function(err, doc){
            if(err) {
                deferred.reject(err);
            }
            else {
                FieldModel.findById(fieldId,
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

    function updateField(fieldId, field) {
        //forms[index].fields[i] = JSON.parse(JSON.stringify(field));
        var deferred = q.defer();
        // create new field without an _id field
        var newField = {
            label: field.label,
            type: field.type,
            placeholder: field.placeholder,
            options: field.options
        };
        FieldModel.update(
            {_id: fieldId},
            {$set: newField},
            function(err, doc) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    FieldModel.findById(fieldId,
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