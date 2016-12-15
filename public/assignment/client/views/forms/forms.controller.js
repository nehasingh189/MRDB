(function () {
    "use strict";
    angular.module("FormBuilderApp")
        .controller("FormController", FormController);

    function FormController(FormService, UserService) {

        var vm = this;
        //event handlers declaration
        vm.addForm = addForm;
        vm.updateForm = updateForm;
        vm.deleteForm = deleteForm;
        vm.selectForm = selectForm;
        function init() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                    updateUserFormsList();
                });
        }

        function updateUserFormsList() {
            FormService
                .findAllFormsForUser(vm.currentUser._id)
                .then(function (response) {
                    vm.forms = response.data;
            });
        }

        return init();

        function addForm(form) {
            if (form && form.title && !form._id) {
                FormService
                    .createFormForUser(vm.currentUser._id, form)
                    .then(function () {
                    vm.form = {};
                    updateUserFormsList();
                })
            }
        }

        function updateForm(form) {
            if (form && form._id) {
                FormService
                    .updateFormById(form._id, form)
                    .then(function () {
                    vm.form = {};
                    updateUserFormsList();
                })
            }
        }

        function deleteForm(index) {
            FormService
                .deleteFormById(vm.forms[index]._id)
                .then(function () {
                if (vm.form._id && vm.forms[index]._id === vm.form._id) {
                    vm.form = {};
                }
                updateUserFormsList();
            })
        }

        function selectForm(index) {
            vm.form = {
                _id: vm.forms[index]._id,
                title: vm.forms[index].title,
                userId: vm.forms[index].userId,
                fields: vm.forms[index].fields,
                created: vm.forms[index].created,
                updated: vm.forms[index].updated
            };
        }
    }
})();