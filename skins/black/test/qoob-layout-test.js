/*global QoobMenuView, QoobToolbarView, QoobEditModeButtonView, QoobViewportView*/
QUnit.module("QoobLayout");

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var storage = 1,
        controller = 2,
        model = Backbone.Model({test: 'test'});

    var menu = new QoobMenuView({
        "model": model,
        "storage": storage,
        "controller": controller
    });
    var toolbar = new QoobToolbarView({
        "model": model,
        "storage": storage,
        "controller": controller
    });
    var editModeButton = new QoobEditModeButtonView({
        "model": model,
        "storage": storage,
        "controller": controller
    });
    var viewPort = new QoobViewportView({
        "model": model,
        "storage": storage,
        "controller": controller
    });

    var testModel = new Backbone.Model({test: 'test'});

    assert.equal(menu.storage, 1, 'Storage menu Ok');
    assert.equal(menu.controller, 2, 'Controller menu Ok');
    assert.equal(menu.model, testModel, 'Model menu Ok');
});
