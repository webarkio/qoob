/*global QoobToolbarView*/
QUnit.module("QoobToolbarView");

var mockToolbarTemplate = '<div class="logo">' +
    '<div class="wrap-qoob">' +
    '<div class="qoob">' +
    '<div class="side-0"></div>' +
    '<div class="side-90"></div>' +
    '<div class="side-180"></div>' +
    '<div class="side-270"></div>' +
    '</div>' +
    '</div>' +
    '<div class="text"></div>' +
    '</div>' +
    '<div class="edit-control-bar">' +
    '<div class="autosave">' +
    '<label class="checkbox-sb"><input type="checkbox" class="autosave-checkbox"><span></span><em>Autosave</em></label>' +
    '</div>' +
    '<div class="edit-control-button">' +
    '<button class="save-button">' +
    '<span class="text">Save</span>' +
    '<span class="clock"><span class="minutes-container"><span class="minutes"></span></span><span class="seconds-container"><span class="seconds"></span></span></span>' +
    '</button>' +
    '<button class="exit-button">Exit</button>' +
    '<div class="dropdown more-button">' +
    '<button class="btn btn-default dropdown-toggle" type="button" id="more" data-toggle="dropdown">More <i class="fa fa-caret-down" data-unicode="f0d7"></i></button>' +
    '<ul class="dropdown-menu" aria-labelledby="more">' +
    '<li><a class="save-template" tabindex="-1" href="#more">Save as template</a></li>' +
    '</ul>' +
    '</div>' +
    '<button class="device-mode-button pc active" name="pc"></button><button class="device-mode-button tablet-vertical" name="tablet-vertical"></button>' +
    '<button class="device-mode-button phone-vertical" name="phone-vertical"></button>' +
    '<button class="device-mode-button tablet-horizontal" name="tablet-horizontal"></button>' +
    '<button class="device-mode-button phone-horizontal" name="phone-horizontal"></button>' +
    '<button class="preview-mode-button"></button>' +
    '</div>' +
    '</div>';

var mockToolbarStorage = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-toolbar-preview') {
            return mockToolbarTemplate;
        }
    },
    __: function(s1, s2) {
        return s1 + " " + s2;
    }
};

//============START TEST===============
QUnit.test("attributes", function(assert) {
    var toolbar = new QoobToolbarView({});
    assert.equal(toolbar.el.id, 'qoob-toolbar');
});

QUnit.test("initialize", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: 1,
        controller: 2
    });

    assert.equal(toolbar.storage, 1);
    assert.equal(toolbar.controller, 2);
});

QUnit.test("render", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    assert.equal(mockToolbarTemplate, toolbar.render().$el.html());
});

QUnit.test("resize", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    assert.equal(toolbar.render().resize().$el.width(), window.innerWidth);
});

QUnit.test("logoRotation", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    toolbar.render().logoRotation('side-180');
    assert.ok(toolbar.$el.find('.logo').hasClass('side-180'));
    toolbar.logoRotation('side-270');
    assert.ok(!toolbar.$el.find('.logo').hasClass('side-180'));

});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    jQuery('body').append(toolbar.render().$el);
    assert.equal(toolbar.$el.css('display'), 'block');
    toolbar.setPreviewMode();
    _.delay(function() {
        assert.equal(toolbar.$el.css('display'), 'none');
        toolbar.$el.remove();
        done();
    }, 300);

});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    jQuery('body').append(toolbar.render().$el);
    assert.equal(toolbar.$el.css('display'), 'block');
    toolbar.setPreviewMode();
    _.delay(function() {
        assert.equal(toolbar.$el.css('display'), 'none');
        toolbar.setEditMode();
        _.delay(function() {
            assert.equal(toolbar.$el.css('display'), 'block');
            toolbar.$el.remove();
            done();
        }, 300);
    }, 300);

});

QUnit.test("setDeviceMode", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });
    jQuery('body').append(toolbar.render().$el);
    toolbar.setDeviceMode('pc');
    assert.ok(toolbar.$el.find('.device-mode-button[name=pc]').hasClass('active'));
    toolbar.setDeviceMode('tablet-horisontal');
    assert.ok(!toolbar.$el.find('.device-mode-button[name=pc]').hasClass('active'));
    toolbar.$el.remove();
});

QUnit.test("startEditBlock", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });

    assert.ok(!toolbar.$el.find('.logo').hasClass('side-270'));
    toolbar.render().startEditBlock();
    assert.ok(toolbar.$el.find('.logo').hasClass('side-270'));
});

QUnit.test("showSaveLoader", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });
    assert.equal(toolbar.$el.find('.save-button .clock').css('display'), undefined);
    toolbar.render().showSaveLoader();
    assert.equal(toolbar.$el.find('.save-button .clock').css('display'), 'block');
});

QUnit.test("hideSaveLoader", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage
    });
    assert.equal(toolbar.$el.find('.save-button .clock').css('display'), undefined);
    toolbar.render().hideSaveLoader();
    assert.equal(toolbar.$el.find('.save-button .clock').css('display'), '');
});

QUnit.test("clickPreviewMode", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage,
        controller: {
            setPreviewMode: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.preview-mode-button').trigger('click');
});

QUnit.test("clickDeviceMode", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage,
        controller: {
            setDeviceMode: function(name) {
                assert.equal(name, 'phone-vertical');
            }
        }
    });

    toolbar.render().$el.find('.device-mode-button[name=phone-vertical]').trigger('click');
});

QUnit.test("clickSave", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage,
        controller: {
            save: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.save-button').trigger('click');
});

QUnit.test("clickExit", function(assert) {
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage,
        controller: {
            exit: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.exit-button').trigger('click');
});

QUnit.test("clickAutosave", function(assert) {
    var check = true;
    var toolbar = new QoobToolbarView({
        storage: mockToolbarStorage,
        controller: {
            setAutoSave: function(checked) {
                assert.ok(checked);
                checked = !check;
            }
        }
    });

    toolbar.render().$el.find('.autosave-checkbox').trigger('click');
});
