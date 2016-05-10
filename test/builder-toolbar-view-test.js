QUnit.module("BuilderToolbarView");

var mockTemplate = "<div class=\"logo\"></div>TOOLBAR HTML TEMPLATE" +
    "<a href=\"#\" class=\"save-button\">save</a>" +
    "<a href=\"#\" class=\"exit-button\">exit</a>" +
    "<a href=\"#\" class=\"preview-mode-button\">Preview</a>" +
    "<a href=\"#\" class=\"device-mode-button\" name=\"pc\">PC device mode</a>"+
    "<input type=\"checkbox\" class=\"autosave-checkbox\">";


var mockStorage = {
    getBuilderTemplate: function(templateName) {
        if (templateName == 'builder-toolbar') {
            return mockTemplate;
        }
    }

};

//============START TEST===============
QUnit.test("attributes", function(assert) {
    var toolbar = new BuilderToolbarView({});
    assert.equal(toolbar.el.id, 'builder-toolbar');
});

QUnit.test("initialize", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: 1,
        controller: 2
    });
    
    assert.equal(toolbar.storage, 1);
    assert.equal(toolbar.controller, 2);
});

QUnit.test("render", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    assert.equal(mockTemplate, toolbar.render().$el.html());
});

QUnit.test("resize", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    assert.equal(toolbar.render().resize().$el.width(), window.innerWidth);
});

QUnit.test("logoRotation", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    toolbar.render().logoRotation('side-180');
    assert.ok(toolbar.$el.find('.logo').hasClass('side-180'));
    toolbar.logoRotation('side-270');
    assert.ok(!toolbar.$el.find('.logo').hasClass('side-180'));

});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    $('body').append(toolbar.render().$el);
    assert.equal(toolbar.$el.css('display'), 'block');
    toolbar.setPreviewMode();
    _.delay(function() {
        assert.equal(toolbar.$el.css('display'), 'none');
        toolbar.$el.remove();
        done();
    }, 500);

});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    $('body').append(toolbar.render().$el);
    assert.equal(toolbar.$el.css('display'), 'block');
    toolbar.setPreviewMode();
    _.delay(function() {
        assert.equal(toolbar.$el.css('display'), 'none');
        toolbar.setEditMode();
        _.delay(function() {
            assert.equal(toolbar.$el.css('display'), 'block');
            toolbar.$el.remove();
            done();
        }, 500);
    }, 500);

});

QUnit.test("setDeviceMode", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    toolbar.render().setDeviceMode('pc');
    assert.ok(toolbar.$el.find('.device-mode-button[name=pc]').hasClass('active'));
    toolbar.setDeviceMode('tablet-horisontal');
    assert.ok(!toolbar.$el.find('.device-mode-button[name=pc]').hasClass('active'));

});

QUnit.test("startEditBlock", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    assert.ok(!toolbar.$el.find('.logo').hasClass('side-270'));
    toolbar.render().startEditBlock();
    assert.ok(toolbar.$el.find('.logo').hasClass('side-270'));

});

QUnit.test("clickPreviewMode", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            setPreviewMode: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.preview-mode-button').trigger('click');
});

QUnit.test("clickDeviceMode", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            setDeviceMode: function(mode) {
                assert.equal(mode, 'pc');
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.device-mode-button').trigger('click');
});

QUnit.test("clickSave", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            save: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.save-button').trigger('click');
});

QUnit.test("clickExit", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            exit: function() {
                assert.ok(true);
            }
        }
    });

    toolbar.render().$el.find('.exit-button').trigger('click');
});

QUnit.test("clickAutosave", function(assert) {
	var checked = true;
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            setAutoSave: function(checked) {
                assert.ok(checked);
                checked=!checked;
            }
        }
    });

    toolbar.render().$el.find('.autosave-checkbox').trigger('click');
    toolbar.render().$el.find('.autosave-checkbox').trigger('click');
    toolbar.render().$el.find('.autosave-checkbox').trigger('click');
});

