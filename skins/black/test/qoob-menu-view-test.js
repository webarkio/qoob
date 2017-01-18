QUnit.module("QoobMenuView");

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    }
});

// var mockTemplateMenuResalt =
//     "<div id=\"card\">" +
//     "<div class=\"card-wrap\">" +
//     "<div class=\"card-main side-0\">" +
//     "<div id=\"side-0\" class=\"active\">" +
//     "<ul id=\"catalog-groups\" class=\"catalog-list\"><li><a href=\"#video\"></a></li></ul></div>" +
//     "<div id=\"side-90\"><div id=\"catalog-templates\" class=\"catalog-templates\"></div></div>" +
//     "<div id=\"side-180\"></div>" +
//     "<div id=\"side-270\"></div>" +
//     "</div>" +
//     "</div>" +
//     "</div>";

var mockTemplateInputField = '<div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template">';

var mockTemplateImageField = '<div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template">';

var mockTemplateMenu =
'<div id="card">' +
    '<div class="card-wrap">' +
        '<div class="card-main">' +
            '<div class="side current-screen"></div>' +
        '</div>' +
    '</div>' +
'</div>';

var mockTemplateMenuGroup = 
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
    '</ul>';

var mockTemplateMenuSave = 
    '<div class="backward">' +
        '<a href="#index" class="back"><span>Back</span></a>' +
    '</div>' +
    '<div class="settings-blocks-full">'+
    '<div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>';




var mockTemplateMenuResalt =
    '<div id="card">' +
    '<div class="card-wrap">' +
    '<div class="card-main">' +
    '<div class="side current-screen">' +
    '<div data-side-id="catalog-groups" id="catalog-groups">' +
    '<div class=" form-group lib-select">' +
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
    '<div id="preview-block-qoob_main" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src=""></div>' +
    '<div id="preview-block-qoob_main_nobtn" class="preview-block default ui-draggable ui-draggable-handle" data-lib="default"><img src=""></div>' +
    '</div>' +
    '</div>' +
    '<div class="save-template settings" data-side-id="save-template" id="save-template">' +
    '<div class="backward"><a href="#index" class="back"><span>Back</span></a></div>' +
    '<div class="settings-blocks-full">' +
    '<div class="settings-block">' +
    '<div class="settings-item">' +
    '<div class="title">Title</div><input class="input-text" type="text" name="title" value="" placeholder="Enter name template"></div>' +
    '<div class="settings-item"><div class="title"><div class="text">Image</div></div>' +
    '<div class="edit-image empty"><img src=""></div><input name="image" class="btn-upload btn-builder" type="button" value="Media Center"></div>' +
    '</div><div class="block-button">' +
    '<div class="button-save-template create-template">Save template</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="manage-libs settings" data-side-id="manage-libs" id="manage-libs">' +
    '<div class="backward"><a href="#index"><span>Back</span></a></div>' +
    '<div class="settings-blocks-full">' +
    '<div class="settings-block"><div class="settings-item"><div class="title">Add url library</div>' +
    '<div class="container-input-add"><input class="input-url" type="text" name="url" value="" placeholder="enter url library">' +
    '<div class="add-item add-ibrary"><i class="fa fa-plus"></i></div></div></div></div><div class="settings-block libraries">' +
    '<div class="settings-item"><div class="title">Libraries</div><div class="library"><div class="name-library">default</div>' +
    '<div class="control-library" data-lib-name="default"><a class="remove-library" href="#"><i class="fa fa-trash"></i></a></div></div>' +
    '<div class="library"><div class="name-library">test_theme</div>' +
    '<div class="control-library" data-lib-name="test_theme"><a class="update-library" href="#"><i class="fa fa-refresh"></i></a>' +
    '<a class="remove-library" href="#"><i class="fa fa-trash"></i></a></div></div></div>' +
    '<div class="settings-item"><div class="phrase-reload-page">You need to <a class="reload-page" href="">reload page</a></div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockStorageMenu = {
    // qoobTemplates: { 'menu-groups-preview': "<li><a href=\"#video\"></a></li>", 'menu-settings-preview':'' },
    qoobData: { 'groups': [] },
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-menu-preview') {
            return mockTemplateMenu;
        } else if(templateName == 'menu-groups-preview') {
            return mockTemplateMenuGroup;
        } else if (templateName == 'menu-more-preview') {
            return mockTemplateMenuSave;
        } else if (templateName == 'field-text-preview') {
            return mockTemplateInputField;
        }
    },
    __: function(s1, s2) {
        return s1;
    },
    getGroups: function() {
        return this.qoobData.groups;
    }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menu = new QoobMenuView({
        // model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });
    assert.equal(menu.storage, 1);
    assert.equal(menu.controller, 2);
});

//addSettings
// QUnit.test("addSettings", function(assert) {
//     var menu = new QoobMenuView({
//         model: new Backbone.Model({
//             tagName: "div",
//             className: "settings menu-block"
//         }),
//         storage: mockStorageMenu
//     });
//     console.log(menu.render().$el);
//     assert.ok(menu.addSettings());
// });

QUnit.test("render", function(assert) {
    var menu = new QoobMenuView({
        // model: new Backbone.Model(),
        storage: mockStorageMenu,
        controller: {}
    });

    assert.equal(mockTemplateMenuResalt, menu.render().$el.html());
});

QUnit.test("draggable", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });

    $('body').append(menu.render().$el);
    $previewBlock=$('<div></div>').addClass('preview-block');
    menu.$el.append($previewBlock);
    menu.$el.find('.preview-block').draggable();
    assert.ok(menu.$el.find('.preview-block').hasClass('ui-draggable'));
});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu

    });
    $('body').append(menu.render().$el);
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

    $('body').append(menu.render().$el);
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
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    $('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#side-90').hasClass('active'));
    var view = new View({ id: 'group-video' });
    menu.addView(view, 90);
    menu.showGroup('video');
    assert.ok(menu.$el.find('#side-90').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("showIndex", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    $('body').append(menu.render().$el);
    var view = new View({ id: 'group-video' });
    menu.addView(view, 90);
    menu.showGroup('video');
    assert.ok(menu.$el.find('#side-90').hasClass('active'));
    menu.showIndex();
    assert.ok(menu.$el.find('#side-0').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("startEditBlock", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    $('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#side-270').hasClass('active'));
    var view = new View({ id: 'settings-block-2' });
    menu.addView(view, 270);
    menu.startEditBlock(2);
    assert.ok(menu.$el.find('#side-270').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("resize", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
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
    var view = new View({ id: 'your-id' });
    assert.equal(menu.$el.find('#side-90').find('#your-id').length, 0);
    menu.render().addView(view, '90');
    assert.ok(menu.$el.find('#side-90').find('#your-id'));
});
//getSettingsView

QUnit.test("rotate", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    menu.render().rotate('catalog-groups');
    assert.ok(menu.$el.find('#side-0').hasClass('active'));
    assert.ok(!menu.$el.find('#side-90').hasClass('active'));
    assert.ok(!menu.$el.find('#side-180').hasClass('active'));
    assert.ok(!menu.$el.find('#side-270').hasClass('active'));
});

QUnit.test("onEditStart", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    $('body').append(menu.render().$el);
    assert.ok(!menu.$el.find('#side-270').hasClass('active'));
    var view = new View({ id: 'settings-block-10' });
    menu.addView(view, 270);
    menu.onEditStart(10);
    assert.ok(menu.$el.find('#side-270').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("onEditStop", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    $('body').append(menu.render().$el);
    var view = new View({ id: 'settings-block-1' });
    menu.addView(view, 270);
    menu.onEditStart(1);
    assert.ok(menu.$el.find('#side-270').hasClass('active'));
    menu.onEditStop();
    assert.ok(menu.$el.find('#side-0').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("onEditMode", function(assert) {
    var done = assert.async();
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });

    $('body').append(menu.render().$el);
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

QUnit.test("back", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    // assert.ok(menu.$el.find('.card-main').hasClass('side-0'));
    // menu.render().back();
    $('body').append(menu.render().$el);
    var view = new View({ id: 'settings-block-5' });
    menu.addView(view, 270);
    menu.onEditStart(5);
    assert.ok(menu.$el.find('#side-270').hasClass('active'));
    menu.render().back();
    assert.ok(menu.$el.find('#side-0').hasClass('active'));
    menu.$el.remove();
});

QUnit.test("delView", function(assert) {
    var menu = new QoobMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
    var view = new View({ id: 'your-id' });
    assert.equal(menu.$el.find('#side-90').find('#your-id').length, 0);
    menu.render().addView(view, '90');
    assert.equal(menu.$el.find('#side-90').find('#your-id').length, 1);
    menu.render().delView('your-id');
    assert.equal(menu.$el.find('#side-90').find('#your-id').length, 0);
});
//deleteSettings
