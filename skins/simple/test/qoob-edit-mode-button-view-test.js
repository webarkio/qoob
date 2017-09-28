/*global QoobEditModeButtonView*/
QUnit.module("QoobEditModeButtonView");

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    assert.equal(editModeButton.storage, 1, 'Storage Ok');
    assert.equal(editModeButton.controller, 2, 'Controller Ok');
});

QUnit.test("clickEditMode", function(assert) {
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: {
            setEditMode: function() {
                assert.ok(true, 'conroller setEditMode');
            }
        }
    });

    jQuery('body').append(editModeButton.render().el);

    editModeButton.$el.trigger('click');

    editModeButton.remove();
});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    jQuery('body').append(editModeButton.render().el);

    editModeButton.setPreviewMode();

    _.delay(function() {
        assert.equal(editModeButton.$el.css('display'), 'inline-block', 'setPreviewMode Ok');
        editModeButton.remove();
        done();
    }, 300);
});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    jQuery('body').append(editModeButton.render().el);

    editModeButton.setEditMode();

    _.delay(function() {
        assert.equal(editModeButton.$el.css('display'), 'none', 'setEditMode Ok');
        editModeButton.remove();
        done();
    }, 300);
});


QUnit.test("show", function(assert) {
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    jQuery('body').append(editModeButton.render().el);
    editModeButton.$el.hide();
    editModeButton.show();
    assert.equal(editModeButton.$el.css('display'), 'inline-block', 'show Ok');
    editModeButton.remove();
});

QUnit.test("hide", function(assert) {
    var editModeButton = new QoobEditModeButtonView({
        storage: 1,
        controller: 2
    });

    jQuery('body').append(editModeButton.render().el);
    editModeButton.hide();
    assert.equal(editModeButton.$el.css('display'), 'none', 'hide Ok');
    editModeButton.remove();
});