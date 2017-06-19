/*global QoobMenuSaveTemplateView*/
QUnit.module("QoobMenuSaveTemplateView");

var mockMenuSaveTemplate =
    '<div class="backward">' +
    '<a href="#index" class="back"><span>Back</span></a>' +
    '</div>' +
    '<div class="settings-blocks-full">' +
    '<div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>';

var mockMenuSaveTemplateResult = '<div class="backward"><a href="#index" class="back"><span>Back</span></a></div><div class="settings-blocks-full"><div class="settings-block"><div class="settings-item"><div class="title">Action button text</div><input class="input-text" type="text" name="action_text" value="Action text"></div><div class="settings-item"><div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center"></div></div><div class="block-button"><div class="button-save-template create-template">Save template</div></div></div>';

var mockMenuSaveFieldTextTemplate = '<div class="title">Action button text</div><input class="input-text" type="text" name="action_text" value="Action text">';

var mockMenuSaveImageFieldTemplate = '<div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center">';

var mockStorageSaveTemplate = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'menu-more-preview') {
            return mockMenuSaveTemplate;
        } else if (templateName == 'field-text-preview') {
            return mockMenuSaveFieldTextTemplate;
        } else if (templateName == 'field-image-preview') {
            return mockMenuSaveImageFieldTemplate;
        }
    },
    __: function(s1, s2) {
        return s1 + " " + s2;
    },
    defaultTemplatesCollection: new Backbone.Collection()
};

//============START TEST===============
QUnit.test("attributes", function(assert) {
    var menuSaveTemplate = new QoobMenuSaveTemplateView({
        storage: {},
        controller: {}
    });
    assert.equal(menuSaveTemplate.attributes()['data-side-id'], 'save-template');
    assert.equal(menuSaveTemplate.attributes()['class'], 'save-template settings');
});

QUnit.test("initialize", function(assert) {
    var menuSaveTemplate = new QoobMenuSaveTemplateView({
        storage: 1,
        controller: 2
    });

    assert.deepEqual(menuSaveTemplate.storage, 1, 'Storage Ok');
    assert.deepEqual(menuSaveTemplate.controller, 2, 'Controller Ok');
});

QUnit.test("clickCreateTemplate", function(assert) {
    var menuSaveTemplate = new QoobMenuSaveTemplateView({
        storage: mockStorageSaveTemplate,
        controller: {
            createTemplate: function() {
                assert.ok(true, 'createTemplate Ok');
            }
        }
    });

    menuSaveTemplate.storage.defaultTemplatesCollection.add(new Backbone.Model({title: 'test'}))

    jQuery('body').append(menuSaveTemplate.render().$el);

    menuSaveTemplate.settingsModel.set({'title': 'test'});

    menuSaveTemplate.$el.find('.create-template').trigger('click');
    menuSaveTemplate.$el.remove();
});

QUnit.test("render", function(assert) {
    var menuSaveTemplate = new QoobMenuSaveTemplateView({
        storage: mockStorageSaveTemplate,
        controller: 2
    });

    jQuery('body').append(menuSaveTemplate.render().$el);
    assert.equal(menuSaveTemplate.render().$el.html(), mockMenuSaveTemplateResult);
    menuSaveTemplate.$el.remove();
});
