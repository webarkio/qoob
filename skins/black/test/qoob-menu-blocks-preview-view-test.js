/*global QoobMenuBlocksPreviewView*/
QUnit.module("QoobMenuBlocksPreviewView");

var mockTemplateMenuBlocksPreview =
    '<div class="preview-blocks">' +
    '<div id="preview-block-qoob_main" class="preview-block" data-lib="default">' +
    '<img src="qoob/qoob/blocks/qoob_main/preview.png">' +
    '</div>' +
    '</div>';

var mockStorageMenuBlocksPreview = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'menu-blocks-preview') {
            return mockTemplateMenuBlocksPreview;
        }
    },
    getBlocksByGroup: function() {
        []
    }
};

var mockMenuBlockPreviewController = {
    addNewBlock: function() {
        jQuery('body').append(jQuery('<div class="qoob_main"></div>'));
    }
};

//============START TEST===============
QUnit.test("clickPreviewBlock", function(assert) {
    var menuBlocks = new QoobMenuBlocksPreviewView({
        storage: mockStorageMenuBlocksPreview,
        group: {
            id: "main",
            label: "Main",
            libs: [],
            position: "0"
        },
        controller: mockMenuBlockPreviewController
    });

    jQuery('body').append(menuBlocks.render().$el);

    menuBlocks.$el.find('.preview-block').trigger('click');

    menuBlocks.remove();

    assert.equal(jQuery('body').find('.qoob_main').length, 1, 'Add new block');

    jQuery('body').find('.qoob_main').remove();
});

QUnit.test("initialize", function(assert) {
    var menuBlocks = new QoobMenuBlocksPreviewView({
        storage: 1,
        controller: 2,
        group: 3
    });

    assert.equal(menuBlocks.storage, 1);
    assert.equal(menuBlocks.controller, 2);
    assert.equal(menuBlocks.group, 3);
});

QUnit.test("render", function(assert) {
    var menuBlocks = new QoobMenuBlocksPreviewView({
        storage: mockStorageMenuBlocksPreview,
        group: "preview-block-qoob_main",
        controller: 1
    });

    assert.equal(menuBlocks.controller, 1);
    assert.equal(mockTemplateMenuBlocksPreview, menuBlocks.render().$el.html());
});
