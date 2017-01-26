/*global QoobDefaultTemplatesView*/
QUnit.module("QoobDefaultTemplatesView");

var mockBlockDefaultTemplates = '<div class="block-blank full-page">' +
    '<div class="block-blank-inner">' +
    '<div class="block-blank-inner-text">' +
    '<i class="fa fa-reply"></i>' +
    '<div class="blank-text">This is blank page, you can click on block preview to add block</div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockBlockDefaultTemplate = '<div class="templates"><div class="template" data-id="1"><div class="image-bg"><img src="/qoob/qoob/skins/black/img/default_template.png" alt="test"></div><div class="title">test</div><a class="remove" data-id="1" href="#"></a></div></div>';

var defaultTemplatesRenderResult = '<div class="block-blank full-page"><div class="block-blank-inner"><div class="block-blank-inner-text"><i class="fa fa-reply"></i><div class="blank-text">This is blank page, you can click on block preview to add block</div></div></div></div>';

var mockStorageDefaultTemplatesView = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'block-default-templates') {
            return mockBlockDefaultTemplates;
        }
    },
    __: function(s1, s2) {
        return s1 + ' ' + s2;
    },
    defaultTemplatesCollection: new Backbone.Collection([{ blocks: [], id: 1, image: "/qoob/qoob/skins/black/img/default_template.png", title: "test" }]),
};

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var defaultTemplates = new QoobDefaultTemplatesView({
        storage: 1,
        controller: 2
    });

    assert.equal(defaultTemplates.storage, 1, 'Storage Ok');
    assert.equal(defaultTemplates.controller, 2, 'Controller Ok');
});

QUnit.test("render", function(assert) {
    var defaultTemplates = new QoobDefaultTemplatesView({
        storage: mockStorageDefaultTemplatesView,
        controller: 2
    });

    assert.equal(defaultTemplates.render().$el.html(), defaultTemplatesRenderResult, 'Render Ok');
});

QUnit.test("clickChoiceTemplateBlock", function(assert) {
    var defaultTemplates = new QoobDefaultTemplatesView({
        storage: mockStorageDefaultTemplatesView,
        controller: {
            load: function() {
                assert.ok(true, 'controller load');
            }
        }
    });

    jQuery('body').append(defaultTemplates.render().$el);
    defaultTemplates.$el.append(mockBlockDefaultTemplate);
    defaultTemplates.$el.find('.title').trigger('click');
});

QUnit.test("clickRemoveTemplateBlock", function(assert) {
    var defaultTemplates = new QoobDefaultTemplatesView({
        storage: mockStorageDefaultTemplatesView,
        controller: {
            removeTemplateBlock: function() {
                assert.ok(true, 'controller removeTemplateBlock');
            }
        }
    });

    jQuery('body').append(defaultTemplates.render().$el);
    defaultTemplates.$el.append(mockBlockDefaultTemplate);
    defaultTemplates.$el.find('.remove').trigger('click');
});

