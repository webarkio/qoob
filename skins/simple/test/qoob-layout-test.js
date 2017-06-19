/*global QoobLayout, QoobMenuView, QoobToolbarView, QoobEditModeButtonView, QoobViewportView*/
QUnit.module("QoobLayout");

var mockLayoutToolbarTemplate = '<div class="logo">' +
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

var mockLayoutMenuTemplate =
    '<div id="card">' +
    '<div class="card-wrap">' +
    '<div class="card-main">' +
    '<div class="side current-screen"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockLayoutMenuGroupsTemplate = '<ul><li><a href="#groups/introduction"></a></li></ul>';

var mockLayoutMenuBlocksTemplate =
    '<div class="preview-blocks">' +
    '<div id="preview-block-qoob_main" class="preview-block" data-lib="default">' +
    '<img src="qoob/qoob/blocks/qoob_main/preview.png">' +
    '</div>' +
    '</div>';

var mockLayoutMenuSaveTemplate =
    '<div class="backward">' +
    '<a href="#index" class="back"><span>Back</span></a>' +
    '</div>' +
    '<div class="settings-blocks-full">' +
    '<div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>';

var mockLayoutFieldTextTemplate = '<div class="title">Action button text</div><input class="input-text" type="text" name="action_text" value="Action text">';

var mockLayoutImageFieldTemplate = '<div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center">';

var mockLayoutManageLibsTemplate =
    '<div class="backward"><a href="#index"><span>Back</span></a></div>' +
    '<div class="settings-blocks-full">' +
    '<div class="settings-block">' +
    '<div class="settings-item">' +
    '<div class="title">Add url library</div>' +
    '<div class="container-input-add">' +
    '<input class="input-url" type="text" name="url" value="" placeholder="enter url library">' +
    '<div class="add-item add-ibrary"><i class="fa fa-plus"></i></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="settings-block libraries">' +
    '<div class="settings-item">' +
    '<div class="title">Libraries</div>' +
    '<div class="library">' +
    '<div class="name-library">default</div>' +
    '<div class="control-library" data-lib-name="default">' +
    '<a class="remove-library" href="#"><i class="fa fa-trash"></i></a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="settings-item">' +
    '<div class="phrase-reload-page">You need to <a class="reload-page" href="">reload page</a></div>' +
    '</div>' +
    '</div>' +
    '</div>';


var mockLayoutBlocksTemplate = '<div id="outer-block-1"><div class="qoob-overlay"></div></div>' +
    '<div id="outer-block-2"><div class="qoob-overlay"></div></div>';

var iframeUrl = "iframe.html";

var mockLayoutViewportTemplate = '<iframe src="' + iframeUrl + '" scrolling="auto" name="qoob-iframe" id="qoob-iframe" style="height: 488px; width: 768px;"></iframe>';

var mockLayoutTemplateResult = '<div id="qoob-toolbar"><div class="logo"><div class="wrap-qoob"><div class="qoob"><div class="side-0"></div><div class="side-90"></div><div class="side-180"></div><div class="side-270"></div></div></div><div class="text"></div></div><div class="edit-control-bar"><div class="autosave"><label class="checkbox-sb"><input type="checkbox" class="autosave-checkbox"><span></span><em>Autosave</em></label></div><div class="edit-control-button"><button class="save-button"><span class="text">Save</span><span class="clock"><span class="minutes-container"><span class="minutes"></span></span><span class="seconds-container"><span class="seconds"></span></span></span></button><button class="exit-button">Exit</button><div class="dropdown more-button"><button class="btn btn-default dropdown-toggle" type="button" id="more" data-toggle="dropdown">More <i class="fa fa-caret-down" data-unicode="f0d7"></i></button><ul class="dropdown-menu" aria-labelledby="more"><li><a class="save-template" tabindex="-1" href="#more">Save as template</a></li></ul></div><button class="device-mode-button pc active" name="pc"></button><button class="device-mode-button tablet-vertical" name="tablet-vertical"></button><button class="device-mode-button phone-vertical" name="phone-vertical"></button><button class="device-mode-button tablet-horizontal" name="tablet-horizontal"></button><button class="device-mode-button phone-horizontal" name="phone-horizontal"></button><button class="preview-mode-button"></button></div></div></div><button class="edit-mode-button" style="display: none;"></button><div id="qoob-menu"><div id="card"><div class="card-wrap"><div class="card-main"><div class="side current-screen"><div data-side-id="catalog-groups" id="catalog-groups"><ul><li><a href="#groups/introduction"></a></li></ul></div><div data-side-id="group-main" id="group-main" class="catalog-templates menu-block"><div class="preview-blocks"><div id="preview-block-qoob_main" class="preview-block ui-draggable ui-draggable-handle" data-lib="default"><img src="qoob/qoob/blocks/qoob_main/preview.png"></div></div></div><div class="save-template settings" data-side-id="save-template" id="save-template"><div class="backward"><a href="#index" class="back"><span>Back</span></a></div><div class="settings-blocks-full"><div class="settings-block"><div class="settings-item"><div class="title">Action button text</div><input class="input-text" type="text" name="action_text" value="Action text"></div><div class="settings-item"><div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center"></div></div><div class="block-button"><div class="button-save-template create-template">Save template</div></div></div></div><div class="manage-libs settings" data-side-id="manage-libs" id="manage-libs"><div class="backward"><a href="#index"><span>Back</span></a></div><div class="settings-blocks-full"><div class="settings-block"><div class="settings-item"><div class="title">Add url library</div><div class="container-input-add"><input class="input-url" type="text" name="url" value="" placeholder="enter url library"><div class="add-item add-ibrary"><i class="fa fa-plus"></i></div></div></div></div><div class="settings-block libraries"><div class="settings-item"><div class="title">Libraries</div><div class="library"><div class="name-library">default</div><div class="control-library" data-lib-name="default"><a class="remove-library" href="#"><i class="fa fa-trash"></i></a></div></div></div><div class="settings-item"><div class="phrase-reload-page">You need to <a class="reload-page" href="">reload page</a></div></div></div></div></div></div></div></div></div></div><div id="qoob-viewport"><iframe src="iframe.html" scrolling="auto" name="qoob-iframe" id="qoob-iframe" style="height: 488px; width: 768px;"></iframe></div>';

var mockStorageLayout = {
    qoobData: {
        'groups': [{
            id: 'main',
            label: 'Main',
            libs: ['default'],
            position: 0
        }],
        'blocks': [{
            assets: [],
            config: {},
            configUrl: 'qoob/qoob/blocks/qoob_main/config.json',
            defaults: {},
            groups: 'main',
            lib: 'default',
            name: 'qoob_main',
            settings: [],
            template: 'template.hbs',
            url: 'qoob/qoob/blocks/qoob_main/'
        }, {
            assets: [],
            config: {},
            configUrl: 'qoob/qoob/blocks/qoob_main_nobtn/config.json',
            defaults: {},
            groups: 'main',
            lib: 'default',
            name: 'qoob_main_nobtn',
            settings: [],
            template: 'template.hbs',
            url: 'qoob/qoob/blocks/qoob_main_nobtn/'
        }]
    },
    driver: {
        getIframePageUrl: function() {
            return iframeUrl;
        }
    },
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-toolbar-preview') {
            return mockLayoutToolbarTemplate;
        } else if (templateName == 'qoob-menu-preview') {
            return mockLayoutMenuTemplate;
        } else if (templateName == 'menu-groups-preview') {
            return mockLayoutMenuGroupsTemplate;
        } else if (templateName == 'menu-blocks-preview') {
            return mockLayoutMenuBlocksTemplate;
        } else if (templateName == 'menu-more-preview') {
            return mockLayoutMenuSaveTemplate;
        } else if (templateName == 'field-text-preview') {
            return mockLayoutFieldTextTemplate;
        } else if (templateName == 'field-image-preview') {
            return mockLayoutImageFieldTemplate;
        } else if (templateName == 'menu-manage-libs-preview') {
            return mockLayoutManageLibsTemplate;
        } else if (templateName == 'qoob-viewport-preview') {
            return mockLayoutViewportTemplate;
        }
    },
    __: function(s1, s2) {
        return s1 + " " + s2;
    },
    getGroups: function() {
        return this.qoobData.groups;
    },
    getBlocksByGroup: function() {
        return this.qoobData.blocks;
    }
};


//============START TEST===============
QUnit.test("initialize", function(assert) {
    var model = new Backbone.Model({ test: 'test' });
    var layout = new QoobLayout({ storage: 1, controller: 2, model: model });

    assert.equal(layout.storage, 1, 'storage Ok');
    assert.equal(layout.controller, 2, 'controller Ok');
    assert.ok(layout.model, 'Model  Ok');
});

QUnit.test("render", function(assert) {
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 2, model: model });
    assert.equal(layout.render().$el.html(), mockLayoutTemplateResult, 'render Ok');
});

QUnit.test("resize", function(assert) {
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 2, model: model });

    jQuery('body').append(layout.render().$el);

    layout.resize();

    assert.ok(layout.$el.find('#qoob-toolbar').attr('style'), 'attr style toolbar ok');
    assert.ok(layout.$el.find('#qoob-menu').attr('style'), 'attr style menu ok');
    assert.ok(layout.$el.find('#qoob-viewport').attr('style'), 'attr style viewPort ok');

    layout.$el.remove();
});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 2, model: model });

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setPreviewMode();

        _.delay(function() {
            assert.equal(layout.$el.find('#qoob-toolbar').css('display'), 'none');
            assert.equal(layout.$el.find('#qoob-menu').css('display'), 'none');
            assert.ok(layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'));

            layout.$el.remove();
            done();
        }, 400);
    });
});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 2, model: model });
    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setPreviewMode();

        _.delay(function() {
            assert.equal(layout.$el.find('#qoob-toolbar').css('display'), 'none');
            assert.equal(layout.$el.find('#qoob-menu').css('display'), 'none');
            assert.ok(layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'));

            layout.setEditMode();

            _.delay(function() {
                assert.equal(layout.$el.find('#qoob-toolbar').css('display'), 'block');
                assert.equal(layout.$el.find('#qoob-menu').css('display'), 'block');
                assert.ok(!layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'));

                layout.$el.remove();
                done();
            }, 400);
        }, 400);
    });
});

QUnit.test("setDeviceMode", function(assert) {
    var done = assert.async();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({
        storage: mockStorageLayout,
        controller: {
            current: function() {
                assert.ok(true, 'controller current');
                return 'pc';
            }
        },
        model: model
    });
    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setDeviceMode('phone-vertical');

        _.delay(function() {
            assert.equal(layout.$el.find('.device-mode-button[name="phone-vertical"]').hasClass('active'), true);
            layout.$el.remove();
            done();
        }, 550);
    });
});

QUnit.test("startEditBlock", function(assert) {
    var done = assert.async();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 1, model: model });
    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockLayoutBlocksTemplate);
        layout.startEditBlock(1);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        layout.$el.remove();
        done();
    });
});

QUnit.test("stopEditBlock", function(assert) {
    var done = assert.async();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: 1, model: model });
    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockLayoutBlocksTemplate);
        layout.startEditBlock(1);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        layout.stopEditBlock();
        assert.strictEqual(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'), false);
        layout.$el.remove();
        done();
    });
});
