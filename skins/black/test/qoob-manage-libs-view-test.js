/*global QoobManageLibsView*/
QUnit.module("QoobManageLibsView");

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    assert.equal(editModeButton.storage, 1, 'Storage Ok');
    assert.equal(editModeButton.controller, 2, 'Controller Ok');
});