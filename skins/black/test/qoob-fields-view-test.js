/*global QoobFieldsView*/
QUnit.module("QoobFieldsView");

var mockTemplateInputField = '<div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template">';

var renderResult = '<div class="settings-item"><div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template"></div>';

//Define Model class
var fieldModel = Backbone.Model.extend();

var mockStorage = {
    getSkinTemplate: function(templateName) {
         if (templateName == 'field-text-preview') {
            return mockTemplateInputField;
        }
    }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {
	var fieldsview = new QoobFieldsView({
		model: new fieldModel({
			name: "Test",
			label: "Test"
		}),
		storage: 1,
		settings: 2,
		defaults: 3,
		controller: 4,
		parentId: 5
	});

	assert.equal(fieldsview.model.get('name'), 'Test', 'Model Ok');
	assert.equal(fieldsview.storage, 1, 'Storage Ok');
	assert.equal(fieldsview.settings, 2, 'Settings Ok');
	assert.equal(fieldsview.defaults, 3, 'Defaults Ok');
	assert.equal(fieldsview.controller, 4, 'Controller Ok');
	assert.equal(fieldsview.parentId, 5, 'ParentID Ok');
});

QUnit.test("render", function(assert) {
	var testSettings = [{
		label: "Title",
		name: "title",
		placeholder: "Enter name template",
		type: "text"
	}];

	var fieldsview = new QoobFieldsView({
		model: new fieldModel({
			name: "Test",
			label: "Test"
		}),
		storage: mockStorage,
		settings: testSettings,
		defaults: 1,
		controller: 2,
		parentId: 3
	});

	assert.equal(fieldsview.model.get('name'), 'Test', 'Model Ok');
	assert.equal(fieldsview.storage, mockStorage, 'Storage Ok');
	assert.equal(fieldsview.settings, testSettings, 'Settings Ok');
	assert.equal(fieldsview.defaults, 1, 'Defaults Ok');
	assert.equal(fieldsview.controller, 2, 'Controller Ok');
	assert.equal(fieldsview.parentId, 3, 'ParentID Ok');

	assert.equal(renderResult, fieldsview.render().$el.html(), 'Render Ok');
});