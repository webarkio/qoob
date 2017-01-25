/*global QoobMenuView*/
QUnit.module("QoobMenuView");

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    }
});

var testView = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    },
    dispose: function() {
        this.$el.remove();
        this.off();
    }
});

var mockTemplateInputField = '<div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template">';

var mockTemplateImageField = '<div class="title"><div class="text">Image</div></div><div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center">';

var mockTemplateMenuPreview =
    '<div id="card">' +
    '<div class="card-wrap">' +
    '<div class="card-main">' +
    '<div class="side current-screen"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockTemplateMenuGroup =
    '<div class="form-group lib-select">' +
    '<select class="form-control" id="lib-select">' +
    '<option value="all">All themes</option>' +
    '<option>default</option>' +
    '<option data-divider="true"></option>' +
    '<option value="manage" class="manage-libs">Manage</option>' +
    '</select>' +
    '</div>' +
    '<ul class="catalog-list">' +
    '<li class="default"><a href="#groups/main">Main</a></li>' +
    '</ul>';

var mockTemplateMenuSave =
    '<div class="backward">' +
    '<a href="#index" class="back"><span>Back</span></a>' +
    '</div>' +
    '<div class="settings-blocks-full">' +
    '<div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>';

var mockTemplateMenuBlockPreview =
    '<div class="backward"><a href="#index"><span>Main</span></a></div>' +
    '<div class="preview-blocks">' +
    '<div id="preview-block-qoob_main" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src="qoob/qoob/blocks/qoob_main/preview.png"></div>' +
    '<div id="preview-block-qoob_main_nobtn" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src="qoob/qoob/blocks/qoob_main_nobtn/preview.png"></div>' +
    '</div>';

var mockTemplateManageLibsPreview =
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

var mockTemplateMenuResult =
    '<div id="card">' +
    '<div class="card-wrap">' +
    '<div class="card-main">' +
    '<div class="side current-screen">' +
    '<div data-side-id="catalog-groups" id="catalog-groups">' +
    '<div class="form-group lib-select">' +
    '<div class="btn-group bootstrap-select form-control">' +
    '<button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown" role="button" data-id="lib-select" title="All themes">' +
    '<span class="filter-option pull-left">All themes</span>&nbsp;<span class="bs-caret"><span class="caret"></span></span>' +
    '</button>' +
    '<div class="dropdown-menu open" role="combobox">' +
    '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false">' +
    '<li data-original-index="0" class="selected"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="true">' +
    '<span class="text">All themes</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
    '</li>' +
    '<li data-original-index="1"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false">' +
    '<span class="text">default</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
    '</li>' +
    '<li class="divider" data-original-index="2"></li>' +
    '<li data-original-index="3"><a tabindex="0" class="manage-libs" data-tokens="null" role="option" aria-disabled="false" aria-selected="false">' +
    '<span class="text">Manage</span><span class="glyphicon glyphicon-ok check-mark"></span></a>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '<select class="form-control" id="lib-select" tabindex="-98">' +
    '<option value="all">All themes</option>' +
    '<option>default</option>' +
    '<option data-divider="true"></option>' +
    '<option value="manage" class="manage-libs">Manage</option>' +
    '</select>' +
    '</div>' +
    '</div>' +
    '<ul class="catalog-list">' +
    '<li class="default"><a href="#groups/main">Main</a></li>' +
    '</ul>' +
    '</div>' +
    '<div data-side-id="group-main" id="group-main" class="catalog-templates menu-block">' +
    '<div class="backward"><a href="#index"><span>Main</span></a></div>' +
    '<div class="preview-blocks">' +
    '<div id="preview-block-qoob_main" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src="qoob/qoob/blocks/qoob_main/preview.png"></div>' +
    '<div id="preview-block-qoob_main_nobtn" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src="qoob/qoob/blocks/qoob_main_nobtn/preview.png"></div>' +
    '</div>' +
    '</div>' +
    '<div class="save-template settings" data-side-id="save-template" id="save-template">' +
    '<div class="backward"><a href="#index" class="back"><span>Back</span></a></div>' +
    '<div class="settings-blocks-full">' +
    '<div class="settings-block">' +
    '<div class="settings-item">' +
    '<div class="title">Title</div>' +
    '<input class="input-text" type="text" name="title" value="" placeholder="Enter name template">' +
    '</div>' +
    '<div class="settings-item">' +
    '<div class="title">' +
    '<div class="text">Image</div>' +
    '</div>' +
    '<div class="edit-image empty"><img src=""></div>' +
    '<input name="image" class="btn-upload btn-builder" type="button" value="Media Center">' +
    '</div>' +
    '</div>' +
    '<div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="manage-libs settings" data-side-id="manage-libs" id="manage-libs">' +
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
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockStorageMenu = {
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
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-menu-preview') {
            return mockTemplateMenuPreview;
        } else if (templateName == 'menu-groups-preview') {
            return mockTemplateMenuGroup;
        } else if (templateName == 'menu-blocks-preview') {
            return mockTemplateMenuBlockPreview;
        } else if (templateName == 'menu-more-preview') {
            return mockTemplateMenuSave;
        } else if (templateName == 'field-text-preview') {
            return mockTemplateInputField;
        } else if (templateName == 'field-image-preview') {
            return mockTemplateImageField;
        } else if (templateName == 'menu-manage-libs-preview') {
            return mockTemplateManageLibsPreview;
        }
    },
    __: function(s1, s2) {
        return s1 + ' ' + s2;
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

    var menu = new QoobMenuView({
        storage: 1,
        controller: 2
    });
    assert.equal(menu.storage, 1);
    assert.equal(menu.controller, 2);
});

QUnit.test("addSettings", function(assert) {
    var view = new View({
        id: 'test-id',
        model: new Backbone.Model({
            id: 28,
            lib: 'default'
        })
    });

    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    jQuery('body').append(menu.render().$el);

    menu.addView(view);

    for (var i = 0; i < menu.menuViews.length; i++) {
        if (menu.menuViews[i].model && menu.menuViews[i].model.id == view.model.id) {
            assert.ok(menu.menuViews[i].model.id);
        }
    }
    menu.$el.remove();
});

QUnit.test("render", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    assert.equal(mockTemplateMenuResult, menu.render().$el.html());
});

QUnit.test("draggable", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });

    jQuery('body').append(menu.render().$el);
    var previewBlock = jQuery('<div></div>').addClass('preview-block');
    menu.$el.append(previewBlock);
    menu.$el.find('.preview-block').draggable();
    assert.ok(menu.$el.find('.preview-block').hasClass('ui-draggable'));
    menu.$el.remove();
});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu

    });
    jQuery('body').append(menu.render().$el);
    assert.equal(menu.$el.css('display'), 'block');
    menu.setPreviewMode();
    _.delay(function() {
        assert.equal(menu.$el.css('display'), 'none');
        menu.$el.remove();
        done();
    }, 500);
});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });

    jQuery('body').append(menu.render().$el);
    assert.equal(menu.$el.css('display'), 'block');
    menu.setPreviewMode();
    _.delay(function() {
        assert.equal(menu.$el.css('display'), 'none');
        menu.setEditMode();
        _.delay(function() {
            assert.equal(menu.$el.css('display'), 'block');
            menu.$el.remove();
            done();
        }, 500);
    }, 500);
});

QUnit.test("showGroup", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });
    jQuery('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#group-main').is(':visible'));
    var view = new View({
        id: 'group-main',
        'data-side-id': 'group-main'
    });
    menu.addView(view);
    menu.showGroup('main');
    assert.ok(menu.$el.find('#group-main').is(':visible'));
    menu.$el.remove();
});

QUnit.test("showIndex", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });
    jQuery('body').append(menu.render().$el);
    var view = new View({
        id: 'group-main',
        'data-side-id': 'group-main'
    });
    menu.addView(view);
    menu.showGroup('main');
    assert.ok(menu.$el.find('#group-main').is(':visible'), 'Visible current group main');
    menu.showIndex();
    assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Visible list groups');
    menu.$el.remove();
});

QUnit.test("startEditBlock", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });
    jQuery('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#settings-block-1').is(':visible'), "Block setting isn't visible");
    var view = new View({
        id: 'settings-block-1'
    });
    menu.addView(view);
    menu.startEditBlock(1);
    assert.ok(menu.$el.find('#settings-block-1').is(':visible'), "Block setting is visible");
    menu.$el.remove();
});

QUnit.test("resize", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });
    var h = jQuery(window).height() - 70;
    menu.render().resize();
    assert.equal(menu.$el.css('height'), (h + 'px'));
    assert.equal(menu.$el.css('top'), '70px');
});

QUnit.test("addView", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    var view = new View({
        id: 'your-id'
    });
    assert.equal(menu.$el.find('#side-90').find('#your-id').length, 0);
    menu.addView(view, '90');
    assert.ok(menu.$el.find('#side-90').find('#your-id'));
});

QUnit.test("rotate", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu
    });
    jQuery('body').append(menu.render().$el);
    menu.rotate('group-main', 'forward-screen', 90);
    assert.ok(menu.$el.find('#group-main').is(':visible'), 'Rotate forward to group main');
    menu.rotate('group-main', 'backward-screen', -90);
    assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Rotate backward to groups list');
    menu.$el.remove();
});

QUnit.test("rotateForward", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu
    });
    jQuery('body').append(menu.render().$el);
    assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Show catalog-groups');
    menu.rotateForward('group-main');
    _.delay(function() {
        assert.ok(menu.$el.find('#group-main').is(':visible'), 'Show group-main');

        menu.$el.remove();
    }, 250);
});

QUnit.test("rotateBackward", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu
    });
    jQuery('body').append(menu.render().$el);
    assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Show catalog-groups');

    menu.rotateForward('group-main');

    _.delay(function() {
        assert.ok(menu.$el.find('#group-main').is(':visible'), 'Show group-main');

        menu.rotateBackward('catalog-groups');
        _.delay(function() {
            assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Show catalog-groups');
            menu.$el.remove();
        }, 250);
    }, 250);
});

QUnit.test("onEditStart", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    jQuery('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#settings-block-1').is(':visible'), "Edit block isn't visible");
    var view = new View({
        id: 'settings-block-1'
    });
    menu.addView(view);
    menu.onEditStart(1);
    assert.ok(menu.$el.find('#settings-block-1').is(':visible'), "Start edit block");
    menu.$el.remove();
});

QUnit.test("onEditStop", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });
    jQuery('body').append(menu.render().$el);
    var view = new View({
        id: 'settings-block-1'
    });
    menu.addView(view);
    menu.onEditStart(1);
    assert.ok(menu.$el.find('#settings-block-1').is(':visible'), 'Start edit block');
    menu.onEditStop();
    assert.ok(menu.$el.find('#catalog-groups').is(':visible'), 'Stop edit block');
    menu.$el.remove();
});

QUnit.test("onEditMode", function(assert) {
    var done = assert.async();
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    jQuery('body').append(menu.render().$el);
    assert.equal(menu.$el.css('display'), 'block');
    menu.onEditMode();
    _.delay(function() {
        assert.equal(menu.$el.css('display'), 'block');
        menu.onEditMode();
        _.delay(function() {
            assert.equal(menu.$el.css('display'), 'block');
            menu.$el.remove();
            done();
        }, 500);
    }, 500);
});

QUnit.test("delView", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    var view = new testView({
        id: 'settings-block-media'
    });

    jQuery('body').append(menu.render().$el);

    assert.equal(menu.$el.find('#settings-block-media').length, 0, "The view isn't found");
    menu.addView(view);
    menu.settingsViewStorage['settings-block-media'] = view;
    assert.equal(menu.$el.find('#settings-block-media').length, 1, 'The view is found');
    menu.delView('settings-block-media');
    assert.equal(menu.$el.find('#settings-block-media').length, 0, "The view isn't found");
    menu.$el.remove();
});

QUnit.test("deleteSettings", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {
            stopEditBlock: function() {
                assert.ok(true, 'stopEditBlock');
            }
        }
    });
    // FIXME: error dispose
    var testView = Backbone.View.extend({
        tag: 'div',
        render: function() {
            this.$el.html('view');
            return this;
        },
        dispose: function() {
            this.$el.remove();
            this.off();
        }
    });

    var view = new testView({
        id: 'settings-block-test',
        model: new Backbone.Model({
            id: 28,
            lib: 'default'
        })
    });

    jQuery('body').append(menu.render().$el);

    assert.equal(menu.$el.find('#settings-block-test').length, 0, "The view isn't found");
    menu.addView(view);
    assert.equal(menu.$el.find('#settings-block-test').length, 1, 'The view is found');
    menu.deleteSettings(view.model);
    assert.equal(menu.$el.find('#settings-block-test').length, 0, "The view isn't found");
    menu.$el.remove();
});

QUnit.test("hideLibsExcept", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    jQuery('body').append(menu.render().$el);

    menu.hideLibsExcept('test');
    assert.ok(!menu.$el.find('#catalog-groups .catalog-list li').first().is(':visible'), "Hide lib blocks");
    menu.hideLibsExcept('default');
    assert.ok(menu.$el.find('#catalog-groups .catalog-list li').first().is(':visible'), "Show lib blocks");
    menu.$el.remove();
});

QUnit.test("changeLib", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {
            changeLib: function() {
                assert.ok(true, 'change lib');
            }
        }
    });

    jQuery('body').append(menu.render().$el);

    menu.changeLib();
    menu.$el.remove();
});

QUnit.test("showOverlay", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    jQuery('body').append(menu.render().$el);

    menu.showOverlay();
    assert.equal(menu.$el.find('.overlay-menu').length, 1, 'show overlay menu');
    menu.$el.remove();
});

QUnit.test("hideOverlay", function(assert) {
    var menu = new QoobMenuView({
        storage: mockStorageMenu,
        controller: {}
    });

    jQuery('body').append(menu.render().$el);

    menu.hideOverlay();
    assert.equal(menu.$el.find('.overlay-menu').length, 0, 'hide overlay menu');
    menu.$el.remove();
});
