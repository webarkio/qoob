/*global QoobFieldView*/
QUnit.module("QoobFieldView");

//Define Model class
var fieldModel = Backbone.Model.extend();

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var fieldview = new QoobFieldView({
        model: new fieldModel({
            name: "Test",
            label: "Test"
        }),
        storage: 1,
        settings: 2,
        defaults: 3,
        controller: 4
    });

    assert.equal(fieldview.model.get('name'), 'Test', 'Model Ok');
    assert.equal(fieldview.storage, 1, 'Storage Ok');
    assert.equal(fieldview.settings, 2, 'Settings Ok');
    assert.equal(fieldview.defaults, 3, 'Defaults Ok');
    assert.equal(fieldview.controller, 4, 'Controller Ok');
});

QUnit.test("getValue", function(assert) {
    var fieldview = new QoobFieldView({
        model: new fieldModel({
            name: "Test",
            label: "Test"
        }),
        storage: 1,
        settings: { name: "Test" },
        defaults: 3,
        controller: 4
    });

    assert.equal(fieldview.model.get('name'), 'Test', 'Model Ok');
    assert.equal(fieldview.storage, 1, 'Storage Ok');
    assert.equal(fieldview.settings.name, 'Test', 'Settings Ok');
    assert.equal(fieldview.defaults, 3, 'Defaults Ok');
    assert.equal(fieldview.controller, 4, 'Controller Ok');
});
