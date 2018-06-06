/* global QoobLayout, QoobMenuSettingsView, QoobController, Hammer, Simulator, View */
QUnit.module("QoobLayout");

var templates = [];

templates['qoob-toolbar-preview'] = '<div class="qoob-dropdown pages-dropdown"><div class="qoob-dropdown-toggle"><div class="pages-dropdown__page">index</div></div><ul class="qoob-dropdown-content pages-dropdown__list"><li class="pages-dropdown__backward"><div class="pages-dropdown__backward-button"><div class="pages-dropdown__backward-button-text">Pages</div></div></li></ul></div><div class="control-buttons clearfix"><button class="control-buttons__button control-buttons__button-save" title="Save"><span class="save-clock"><span class="minutes-container"><span class="minutes"></span></span><span class="seconds-container"><span class="seconds"></span></span></span></button><button class="control-buttons__button control-buttons__button-preview" title="Preview"></button><div class="control-buttons__button control-buttons__button-preview-list"><select class="qoob-select-item"><option value="pc" data-icon="fa fa-desktop">Desktop</option><option value="tablet" data-icon="fa fa-tablet">Tablet</option><option value="phone" data-icon="fa fa-mobile">Phone</option></select></div><div class="qoob-dropdown qoob-dropdown-more control-buttons-dropdown"><button class="qoob-dropdown-toggle" type="button"><div class="dot"><span></span><span></span><span></span></div></button><ul class="qoob-dropdown-content"><li><div class="autosave clearfix"><div class="autosave-item-name">Autosave</div><label class="autosave-item-switch"><input type="checkbox" class="autosave-checkbox"><span class="slider"></span></label></div></li><li><a data-id="import-export" href="#import-export">Import/export</a></li><li><a data-id="empty-page" href="#empty-page">Empty page</a></li><li><a  href="#save-template">Save as template</a></li><li><a data-id="show-frontend" href="#show-frontend">Show on frontend</a></li></ul></div></div>';

templates['qoob-menu-preview'] = '<div class="qoob-menu-forward-side"></div><div class="qoob-menu-main-side"></div><div class="qoob-menu-backward-side"></div><div class="qoob-menu-right-side"></div>';

templates['menu-groups-preview'] = '<ul class="group-list"><li class="group-list__item" data-lib="Default"><a href="#groups-main" class="group-list__link" data-group-id="main">Main</a></li></ul>';

templates['menu-blocks-preview'] =
    '<div class="preview-blocks"><div id="preview-block-qoob_main" class="preview-block" data-lib="Default"><div class="shield"></div><img src="/qoob/blocks/qoob_main/preview.png"></div><div id="preview-block-qoob_main_nobtn" class="preview-block" data-lib="Default"><div class="shield"></div><img src="/qoob/blocks/qoob_main_nobtn/preview.png"></div></div>';

templates['menu-save-template-preview'] = '<div class="backward-button"><div class="backward-button__text">Back</div></div><div class="settings-blocks-full save-template-settings"><div class="button-save-template create-template"><span class="save"><i class="fa fa-floppy-o save-icon"></i>Save template</span><span class="save-loading"><i class="fa fa-floppy-o save-icon"></i>Saving...</span></div><div class="notice-block blue">Your template has been saved successfully!</div><div class="error-block error-block-empty-page">You can\'t save empty template</div><div class="error-block error-block-empty-title">The name of the template must be at least 1 character</div></div>';

templates['block-import-export-preview'] = '<div class="modal-content"><i class="fa fa-times close" aria-hidden="true" title="Close"></i><div class="modal-header"><h4 class="modal-title" id="Page data">Page data</h4><i class="fa fa-times close" aria-hidden="true" title="Close"></i></div><div class="modal-body"><textarea class="form-control qoob-import-export-textarea">{"blocks":[],"version":"3.0.1"}</textarea></div><div class="modal-footer"><button class="btn btn-cancel close">Cancel</button><button class="btn btn-save-changes save-changes">Save changes</button></div></div>';

templates['field-text-preview'] = '<label class="input-label field-label">Title</label><input class="input-text" type="text" name="title" value="" placeholder="Enter name template">';

templates['field-image-preview'] = '<div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center">';

templates['qoob-viewport-preview'] = '<div id="droppable-default" class="droppable-zone-full ui-droppable"><div class="dropp-block"><i class="fa fa-plus plus"></i><span>Drop here to create a new block</span></div></div><iframe src="layout.html" scrolling="auto" name="qoob-iframe" id="qoob-iframe"></iframe>';

templates['menu-settings-preview'] = '<div class="backward-button"><div class="backward-button__text">Back</div></div><div class="settings-buttons"><div class="settings-buttons__moveup control-buttons__moveup"><i class="settings-buttons__icon-moveup fa fa-arrow-circle-up"></i><span>Move</span></div><div class="settings-buttons__movedown control-buttons__movedown"><i class="settings-buttons__icon-movedown fa fa-arrow-circle-down"></i><span>Move</span></div><div class="settings-buttons__delete" title="Delete"><i class="fa fa-trash-o"></i></div></div><div class="settings-blocks"></div><div class="overlay-settings"></div>';

templates['block-pleasewait-preview'] = '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div><div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div>';

templates['block-default-templates'] = '';

var mockLayoutBlocksTemplate = '<div id="outer-block-1"><div class="qoob-overlay"></div></div>' +
    '<div id="outer-block-2"><div class="qoob-overlay"></div></div>';

var mockLayoutTemplateResult = '<div id="qoob-sidebar"><div id="qoob-menu"><div class="qoob-menu-forward-side"></div><div class="qoob-menu-main-side"><div data-side-id="catalog-groups" id="catalog-groups" class="catalog-groups"><div id="qoob-toolbar"><div class="qoob-dropdown pages-dropdown"><div class="qoob-dropdown-toggle"><div class="pages-dropdown__page">index</div></div><ul class="qoob-dropdown-content pages-dropdown__list"><li class="pages-dropdown__backward"><div class="pages-dropdown__backward-button"><div class="pages-dropdown__backward-button-text">Pages</div></div></li></ul></div><div class="control-buttons clearfix"><button class="control-buttons__button control-buttons__button-save" title="Save"><span class="save-clock"><span class="minutes-container"><span class="minutes"></span></span><span class="seconds-container"><span class="seconds"></span></span></span></button><button class="control-buttons__button control-buttons__button-preview" title="Preview"></button><div class="control-buttons__button control-buttons__button-preview-list"><div class="qoob-select"><div class="qoob-selected-value" data-value="pc" title="Desktop" tabindex="0"><i class="fa fa-desktop"></i></div><ul class="qoob-select-dropdown"><li data-value="pc" title="Desktop"><i class="fa fa-desktop"></i></li><li data-value="tablet" title="Tablet"><i class="fa fa-tablet"></i></li><li data-value="phone" title="Phone"><i class="fa fa-mobile"></i></li></ul><select class="qoob-select-item"><option value="pc" data-icon="fa fa-desktop">Desktop</option><option value="tablet" data-icon="fa fa-tablet">Tablet</option><option value="phone" data-icon="fa fa-mobile">Phone</option></select></div></div><div class="qoob-dropdown qoob-dropdown-more control-buttons-dropdown"><button class="qoob-dropdown-toggle" type="button"><div class="dot"><span></span><span></span><span></span></div></button><ul class="qoob-dropdown-content"><li><div class="autosave clearfix"><div class="autosave-item-name">Autosave</div><label class="autosave-item-switch"><input type="checkbox" class="autosave-checkbox"><span class="slider"></span></label></div></li><li><a data-id="import-export" href="#import-export">Import/export</a></li><li><a data-id="empty-page" href="#empty-page">Empty page</a></li><li><a href="#save-template">Save as template</a></li><li><a data-id="show-frontend" href="#show-frontend">Show on frontend</a></li></ul></div></div></div><ul class="group-list"><li class="group-list__item" data-lib="Default"><a href="#groups-main" class="group-list__link" data-group-id="main">Main</a></li></ul></div><div data-side-id="save-template" class="save-template settings" id="save-template"><div class="backward-button"><div class="backward-button__text">Back</div></div><div class="settings-blocks-full save-template-settings"><div class="field-text field-group"><label class="input-label field-label">Title</label><input class="input-text" type="text" name="title" value="" placeholder="Enter name template"></div><div class="button-save-template create-template"><span class="save"><i class="fa fa-floppy-o save-icon"></i>Save template</span><span class="save-loading"><i class="fa fa-floppy-o save-icon"></i>Saving...</span></div><div class="notice-block blue">Your template has been saved successfully!</div><div class="error-block error-block-empty-page">You can\'t save empty template</div><div class="error-block error-block-empty-title">The name of the template must be at least 1 character</div></div></div></div><div class="qoob-menu-backward-side"></div><div class="qoob-menu-right-side"><div data-side-id="main" id="main" class="preview-block-wrap"><div class="preview-blocks"><div id="preview-block-qoob_main" class="preview-block ui-draggable ui-draggable-handle" data-lib="Default"><div class="shield"></div><img src="/qoob/blocks/qoob_main/preview.png"></div><div id="preview-block-qoob_main_nobtn" class="preview-block ui-draggable ui-draggable-handle" data-lib="Default"><div class="shield"></div><img src="/qoob/blocks/qoob_main_nobtn/preview.png"></div></div></div></div></div></div><div id="qoob-viewport" style="touch-action: manipulation; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><div id="droppable-default" class="droppable-zone-full ui-droppable"><div class="dropp-block"><i class="fa fa-plus plus"></i><span>Drop here to create a new block</span></div></div><iframe src="layout.html" scrolling="auto" name="qoob-iframe" id="qoob-iframe"></iframe></div><div id="qoob-import-export"><div class="modal-content"><i class="fa fa-times close" aria-hidden="true" title="Close"></i><div class="modal-header"><h4 class="modal-title" id="Page data">Page data</h4><i class="fa fa-times close" aria-hidden="true" title="Close"></i></div><div class="modal-body"><textarea class="form-control qoob-import-export-textarea">{"blocks":[],"version":"3.0.1"}</textarea></div><div class="modal-footer"><button class="btn btn-cancel close">Cancel</button><button class="btn btn-save-changes save-changes">Save changes</button></div></div></div><div class="edit-mode-button"></div>';


var iframeUrl = "layout.html";

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
        if (templates[templateName]) {
            return templates[templateName];
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
    },
    getBlockConfig: function() {
        return {
            name: "qoob_text",
            groups: "text",
            template: "template.hbs",
            settings: [{ name: "text", label: "Text", type: "text" }],
            defaults: { text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscin</p>" },
            lib: "Default"
        }
    },
    getBlockTemplate: function() {
        return "<div>{{#if text}}{{{text}}}{{/if}}</div>";
    },
    pageTemplatesCollection: []
};

//============START TEST===============
QUnit.test("initialize", function(assert) {
    assert.expect(3);
    var model = new Backbone.Model({ test: 'test' });
    var layout = new QoobLayout({ storage: 1, controller: 2, model: model });

    assert.equal(layout.storage, 1, 'storage Ok');
    assert.equal(layout.controller, 2, 'controller Ok');
    assert.ok(layout.model, 'Model  Ok');
});

QUnit.test("navigate", function(assert) {
    assert.expect(2);
    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    layout.menu.menuViews.push(new Backbone.View({
        "id": 'edit-1',
        "name": 'edit-1',
        "model": model,
    }), 'main');

    layout.menu.menuViews.push(new Backbone.View({
        "id": 'save-template',
        "name": 'save-template',
        "model": model,
    }), 'main');

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockLayoutBlocksTemplate);
        layout.startEditBlock(1, false);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'), 'Start edit block');

        layout.navigate("save-template", null, false);

        assert.ok(jQuery('#save-template').hasClass('side-item-show'), 'show save template');

        layout.$el.remove();
        done();
    });
});

QUnit.test("initeSwipeHorizontal", function(assert) {
    assert.expect(1);
    var done = assert.async();

    var hammer = new Hammer(document.body, { recognizers: [] });
    hammer.add(new Hammer.Swipe());
    hammer.on('swiperight swipeleft', function() {
        assert.ok(true);
    });

    Simulator.gestures.swipe(document.body, { pos: [300, 300], deltaY: 0, deltaX: -200 }, function() {
        done();
    });
});

QUnit.test("backward", function(assert) {
    assert.expect(2);
    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    layout.menu.menuViews.push(new Backbone.View({
        "id": 'save-template',
        "name": 'save-template',
        "model": model,
    }), 'main');

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.navigate("index", null, false);

        layout.navigate("save-template", null, true);

        assert.ok(jQuery('#save-template').hasClass('side-item-show'), 'Show save template');

        layout.backward('index');

        assert.ok(jQuery('#catalog-groups').hasClass('side-item-show'), 'Backward to group list');

        layout.$el.remove();
        done();
    });
});

QUnit.test("scrollTo", function(assert) {
    assert.expect(2);
    var model = new Backbone.Model({ test: 'test' });
    var layout = new QoobLayout({ storage: 1, controller: 2, model: model });

    layout.viewPort.scrollTo = function(modelId, position) {
        assert.equal(modelId, 1)
        assert.equal(position, 2);
    }

    layout.scrollTo(1, 2);
});

QUnit.test("render", function(assert) {
    assert.expect(1);
    var controller = new QoobController();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    assert.equal(layout.render().$el.html(), mockLayoutTemplateResult, 'render layout');
});

QUnit.test("resize", function(assert) {
    assert.expect(1);
    var controller = new QoobController();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.resize();

    assert.ok(layout.$el.find('#qoob-viewport').attr('style'), 'attr style viewPort ok');

    layout.$el.remove();
});

QUnit.test("setPreviewMode", function(assert) {
    assert.expect(3);
    var done = assert.async();
    var controller = new QoobController();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setPreviewMode();

        // emulated transition end 
        layout.sidebar.$el.trigger('transitionend');

        assert.ok(layout.sidebar.$el.hasClass('hide-sidebar'), 'hide sidebar');
        assert.ok(layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'), 'add class preview to viewPort');
        assert.ok(layout.editModeButton.$el.hasClass('edit-mode-button-show'), 'show button preview mode');
        layout.$el.remove();
        done();
    });
});

QUnit.test("setEditMode", function(assert) {
    assert.expect(6);
    var done = assert.async();
    var controller = new QoobController();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setPreviewMode();

        assert.ok(layout.sidebar.$el.hasClass('hide-sidebar'), 'hide sidebar');
        assert.ok(layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'), 'add class preview to viewPort');
        assert.ok(layout.editModeButton.$el.hasClass('edit-mode-button'), 'show button preview mode');

        layout.setEditMode();

        // emulated transition end 
        layout.editModeButton.$el.trigger('transitionend');

        setTimeout(function() {
            assert.notOk(layout.sidebar.$el.hasClass('hide-sidebar'), 'show sidebar');
            assert.notOk(layout.viewPort.getIframeContents().find('#qoob-blocks').hasClass('preview'), 'remove class preview to viewPort');
            assert.notOk(layout.editModeButton.$el.hasClass('edit-mode-button-show'), 'hide button preview mode');

            layout.$el.remove();
            done();
        }, 300);
    });
});

QUnit.test("setDeviceMode", function(assert) {
    assert.expect(2);
    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        layout.setDeviceMode('phone');

        jQuery(layout.viewPort.getWindowIframe()).on('resize', _.debounce(function() {
            assert.equal(layout.viewPort.deviceMode, 'phone', 'Change devide mode');
            assert.equal(layout.viewPort.getIframe().width(), 375, 'Change width');
            layout.$el.remove();
            done();
        }, 500));
    });
});

QUnit.test("startEditBlock", function(assert) {
    assert.expect(1);
    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    layout.menu.menuViews.push(new Backbone.View({
        "id": 'edit-1',
        "name": 'edit-1',
        "model": model,
    }), 'main');

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockLayoutBlocksTemplate);
        layout.startEditBlock(1, false);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        layout.$el.remove();
        done();
    });
});

QUnit.test("stopEditBlock", function(assert) {
    assert.expect(3);
    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    layout.menu.menuViews.push(new Backbone.View({
        "id": 'edit-1',
        "name": 'edit-1',
        "model": model,
    }), 'main');

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockLayoutBlocksTemplate);
        layout.startEditBlock(1, false);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        layout.stopEditBlock();
        assert.strictEqual(iframe.jQuery('.qoob-overlay').hasClass('active'), false);
        assert.strictEqual(iframe.jQuery('.qoob-overlay').hasClass('no-active'), false);
        layout.$el.remove();
        done();
    });
});


QUnit.test("showSaveLoader", function(assert) {
    assert.expect(1);

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.showSaveLoader();

    assert.equal(layout.toolbar.$el.find('.control-buttons__button-save .save-clock').css('display'), 'block');
    layout.$el.remove();
});


QUnit.test("hideSaveLoader", function(assert) {
    assert.expect(1);

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.hideSaveLoader();

    assert.equal(layout.toolbar.$el.find('.control-buttons__button-save .save-clock').css('display'), 'none');
    layout.$el.remove();
});

QUnit.test("getBlockView", function(assert) {
    assert.expect(1);

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    var ViewTest = new View({
        model: new Backbone.Model({
            id: 2
        })
    });

    layout.viewPort.blockViews.push(ViewTest);

    assert.equal(layout.getBlockView(2), ViewTest);
});

QUnit.test("addBlock", function(assert) {
    assert.expect(1);

    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 1, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = layout.viewPort.getWindowIframe();

        var blockModel = new Backbone.Model({
            id: 1
        });

        layout.addBlock(blockModel);

        assert.ok(iframe.jQuery('#qoob-blocks').children('#outer-block-1').length);

        layout.$el.remove();
        done();
    });
});


QUnit.test("deleteBlock", function(assert) {
    assert.expect(1);

    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model({ id: 2, test: 'test' });

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var blockModel = new Backbone.Model({
            id: 100
        });

        layout.menu.addView(new QoobMenuSettingsView({
            "id": 'edit-100',
            "name": 'edit-100',
            "model": blockModel,
            "settings": [{ name: "text", label: "Text", type: "text" }],
            "defaults": { text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscin</p>" },
            "storage": mockStorageLayout
        }));

        layout.addBlock(blockModel);

        var TestView = layout.viewPort.getBlockView(100);
        layout.deleteBlock(blockModel);

        assert.ok(TestView.$el.hasClass('content-hide'));

        layout.$el.remove();
        done();
    });
});


QUnit.test("triggerIframe", function(assert) {
    assert.expect(1);

    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model();

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    var iframe = layout.viewPort.getWindowIframe();

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {

        layout.triggerIframe();

        iframe.jQuery('#qoob-blocks').on('change', function() {

            assert.ok(true, 'changed');

            layout.$el.remove();
            done();
        });

        iframe.jQuery('#qoob-blocks').trigger('change');
    });
});

QUnit.test("changeDefaultPage", function(assert) {
    assert.expect(2);

    var done = assert.async();

    var controller = new QoobController();
    var model = new Backbone.Model();

    var layout = new QoobLayout({ storage: mockStorageLayout, controller: controller, model: model });

    controller.setLayout(layout);
    controller.setPageModel(model);
    controller.setStorage(mockStorageLayout);

    jQuery('body').append(layout.render().$el);

    var iframe = layout.viewPort.getWindowIframe();

    layout.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var qoobBlocks = iframe.jQuery('#qoob-blocks');

        layout.viewPort.createBlankPage();

        // layout.changeDefaultPage('hide');
        // assert.equal(qoobBlocks.find('.qoob-templates').css('display'), 'none');

        // layout.changeDefaultPage('show');
        // assert.equal(qoobBlocks.find('.qoob-templates').css('display'), 'block');

        layout.$el.remove();
        done();
    });
});