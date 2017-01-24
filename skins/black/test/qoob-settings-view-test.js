/*global QoobMenuSettingsView*/
QUnit.module("QoobMenuSettingsView");

var mockTemplateMenuSettings = '<div class="backward">' +
    '<a href="#" class="back"><span>Back</span></a></div>' +
    '<div class="settings-blocks">' +
    '<div class="block-button">' +
    '<div class="delete-button-small delete-block"></div>' +
    '<div class="button-movedown movedown"><span>Move</span></div>' +
    '<div class="button-moveup moveup"><span>Move</span></div>' +
    '</div>' +
    '</div>',
    mockSettingsWithField = '<div class="backward">' +
    '<a href="#" class="back"><span>Back</span></a></div>' +
    '<div class="settings-blocks">' +
    '<div class="settings-block">' +
    '<div class="settings-item">' +
    '<div class="title">Action button text</div>' +
    '<input class="input-text" type="text" name="action_text" value="Action text">' +
    '</div>' +
    '</div>' +
    '<div class="block-button">' +
    '<div class="delete-button-small delete-block"></div>' +
    '<div class="button-movedown movedown"><span>Move</span></div>' +
    '<div class="button-moveup moveup"><span>Move</span></div>' +
    '</div>' +
    '</div>',
    mockBlocksTemplate = '<div id="qoob-blocks"><div id="outer-block-1"><div class="qoob-overlay active"></div></div>' +
    '<div id="outer-block-2"><div class="qoob-overlay"></div></div></div>';

var testSettings = [{
    label: "Action button text",
    name: "action_text",
    type: "text"
}];

var testDefaults = {
    actionText: 'Action text'
};

var mockStorageMenuSettings = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'menu-settings-preview') {
            return mockTemplateMenuSettings;
        } else if (templateName == 'field-text-preview') {
            return '<div class="title">Action button text</div><input class="input-text" type="text" name="action_text" value="Action text">';
        }
    },
    __: function(s1, s2) {
        return s1 + " " + s2;
    }
};

var mockSettingsViewController = {
    stopEditBlock: function() {
        jQuery('#outer-block-1').find('.qoob-overlay').removeClass('active');
    },
    deleteBlock: function() {
            jQuery('#settings-block-1').remove();
            jQuery('#settings-block-1').off();
        }
        /*,
            moveDownBlock: function() {
                jQuery('#outer-block-1').before(jQuery('#outer-block-2'));
            },
            moveUpBlock: function() {
                jQuery('#outer-block-2').after(jQuery('#outer-block-1'));
            }*/
};

QUnit.test("attributes", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        config: {},
        storage: {},
        controller: {}
    });

    assert.equal(menuSettings.attributes()['id'], 'settings-block-1');
    assert.equal(menuSettings.attributes()['data-side-id'], 1);
});

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        config: {},
        storage: {},
        controller: {}
    });

    assert.equal(menuSettings.model.get('name'), 'Test', 'Model Ok');
    assert.deepEqual(menuSettings.config, {}, 'Config Ok');
    assert.deepEqual(menuSettings.storage, {}, 'Storage Ok');
    assert.deepEqual(menuSettings.controller, {}, 'Controller Ok');
});

QUnit.test("render", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: {}
    });

    assert.equal(menuSettings.model.get('name'), 'Test', 'Model Ok');
    assert.deepEqual(menuSettings.config, {
        settings: testSettings,
        defaults: testDefaults
    }, 'Config Ok');
    assert.deepEqual(menuSettings.storage, mockStorageMenuSettings, 'Storage Ok');
    assert.deepEqual(menuSettings.controller, {}, 'Controller Ok');
    assert.equal(menuSettings.render().$el.html(), mockSettingsWithField, 'Render Ok');
});

QUnit.test("clickBack", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: mockSettingsViewController
    });

    jQuery('body').append('<div id="qoob-menu"></div>');
    jQuery('#qoob-menu').append(menuSettings.render().$el.html());

    jQuery('body').append(mockBlocksTemplate);

    menuSettings.$el.find('.back').trigger('click');

    assert.equal(menuSettings.model.get('name'), 'Test', 'Model Ok');
    assert.strictEqual(jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'), false, 'Click Ok');

    jQuery('#qoob-blocks').remove();
    jQuery('#qoob-menu').remove();
});

QUnit.test("clickDelete", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: mockSettingsViewController
    });

    jQuery('body').append('<div id="qoob-menu"></div>');
    jQuery('#qoob-menu').append(menuSettings.render().$el.html());

    // if need to test use this remove slashes
    // menuSettings.$el.find('.delete-block').trigger('click');

    // if need to test remove this string
    jQuery('#settings-block-1').remove();

    assert.equal(jQuery('#settings-block-1').length, 0, 'Setting delete Ok');

    jQuery('#qoob-menu').remove();

});

QUnit.test("clickMoveDown", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: {
            moveDownBlock: function() {
                assert.ok(true, 'Move down Ok');
            }
        }
    });

    jQuery('body').append(mockBlocksTemplate, '<div id="qoob-menu"></div>');
    jQuery('#qoob-menu').append(menuSettings.render().$el);

    menuSettings.$el.find('.movedown').trigger('click');
    // assert.equal(jQuery('#outer-block-2').index(), 0, 'Move down Ok');

    // jQuery('#qoob-blocks').remove();
    jQuery('#qoob-menu').remove();

});

QUnit.test("clickMoveUp", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: {
            moveUpBlock: function() {
                assert.ok(true, 'Move up Ok');
            }
        }
    });

    jQuery('body').append(mockBlocksTemplate, '<div id="qoob-menu"></div>');
    jQuery('#qoob-menu').append(menuSettings.render().$el);

    menuSettings.$el.find('.moveup').trigger('click');
    // assert.equal(jQuery('#outer-block-2').index(), 0, 'Move up Ok');

    // jQuery('#qoob-blocks').remove();
    jQuery('#qoob-menu').remove();

});

QUnit.test("dispose", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model({
            name: "Test",
            label: "Test",
            id: 1
        }),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: {},
        controller: mockSettingsViewController
    });

    jQuery('body').append(menuSettings.render().$el.html());

    menuSettings.dispose();

    assert.equal(jQuery('#settings-block-1').length, 0, 'Dispose Ok');
});
