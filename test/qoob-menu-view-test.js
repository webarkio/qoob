QUnit.module("QoobMenuView");

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    }
});

var mockTemplateMenu =
    "<div id=\"card\">" +
    "<div class=\"card-wrap\">" +
    "<div class=\"card-main side-0\">" +
    "<div id=\"side-0\" class=\"active\"></div>" +
    "<div id=\"side-90\"><div id=\"catalog-templates\" class=\"catalog-templates\"></div></div>" +
    "<div id=\"side-180\"></div>" +
    "<div id=\"side-270\"></div>" +
    "</div>" +
    "</div>" +
    "</div>";

var mockTemplateMenuResalt =
    "<div id=\"card\">" +
    "<div class=\"card-wrap\">" +
    "<div class=\"card-main side-0\">" +
    "<div id=\"side-0\" class=\"active\">" +
    "<ul id=\"catalog-groups\" class=\"catalog-list\"><li><a href=\"#video\"></a></li></ul></div>" +
    "<div id=\"side-90\"><div id=\"catalog-templates\" class=\"catalog-templates\"></div></div>" +
    "<div id=\"side-180\"></div>" +
    "<div id=\"side-270\"></div>" +
    "</div>" +
    "</div>" +
    "</div>";

var mockStorageMenu = {
    qoobTemplates: { 'qoob-menu-preview': mockTemplateMenu, 'menu-groups-preview': "<li><a href=\"#video\"></a></li>", 'menu-settings-preview':'' },
    qoobData: { 'groups': [] },
    getGroups: function() {
        return this.qoobData.groups;
    }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menu = new QoobMenuView({
        model: new Backbone.Model(),
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
        model: new Backbone.Model(),
        storage: mockStorageMenu
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
