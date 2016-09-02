QUnit.module("QoobFieldView");

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var fieldview = new QoobFieldView({
        model: new Backbone.Model(),
        storage: 1,
        settings: 2,
        controller: 3
    });
    assert.equal(fieldview.controller, 3);
});


