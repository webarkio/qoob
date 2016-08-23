QUnit.module("QoobFieldsView");

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var fieldsview = new QoobFieldsView({
        model: new Backbone.Model(),
        storage: 1,
        parentId: 123
    });
    assert.equal(fieldsview.parentId, 123);
});
