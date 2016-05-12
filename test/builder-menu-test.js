QUnit.module("BuilderMenuView");

var mockTemplateMenu =
"<div id=\"card\">" +
    "<div class=\"card-wrap\">" +
        "<div class=\"card-main side-0\">"+
            "<div id=\"side-0\" class=\"active\"></div>"+
            "<div id=\"side-90\"></div>"+
            "<div id=\"side-180\"></div>"+
            "<div id=\"side-270\"></div>"+
        "</div>"+
    "</div>"+
"</div>";

var mockTemplateMenuResalt =
"<div id=\"card\">" +
    "<div class=\"card-wrap\">" +
        "<div class=\"card-main side-0\">"+
            "<div id=\"side-0\" class=\"active\">"+
                "<ul id=\"catalog-groups\" class=\"catalog-list\"><li><a href=\"#video\"></a></li></ul></div>"+
            "<div id=\"side-90\"></div>"+
            "<div id=\"side-180\"></div>"+
            "<div id=\"side-270\"></div>"+
        "</div>"+
    "</div>"+
"</div>";

var mockStorageMenu = {
    builderTemplates: {'builder-menu-preview':mockTemplateMenu, 'menu-groups-preview':"<li><a href=\"#video\"></a></li>"},
    builderData: {'groups': []}
};

//============START TEST===============
QUnit.test("initialize", function(assert) {
        
    var menu = new BuilderMenuView({model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });
    
    assert.equal(menu.storage, 1);
    assert.equal(menu.controller, 2);
});

//addSettings

//QUnit.test("addSettings", function(assert) {
//
//    var menu = new BuilderMenuView({model: new Backbone.Model(),
//        storage: mockStorageMenu
//    });
//
//    assert.equal(menu.addSettings(), 1);
//});

QUnit.test("render", function(assert) {
    var menu = new BuilderMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
 
        assert.equal(mockTemplateMenuResalt, menu.render().$el.html());

});

//draggable
//QUnit.test("draggable", function(assert) {
//    var menu = new BuilderMenuView({model: new Backbone.Model(),
//        storage: mockStorageMenu
//    });
//    menu.render().draggable();
//    console.log(menu.$el.find('.preview-block'));
//
//});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var menu = new BuilderMenuView({model: new Backbone.Model(),
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
    var menu = new BuilderMenuView({model: new Backbone.Model(),
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

//showGroup

//showIndex

//startEditBlock

QUnit.test("resize", function(assert) {
    var menu = new BuilderMenuView({model: new Backbone.Model(),
        storage: mockStorageMenu
    });
           var h = jQuery(window).height() - 70;
           menu.render().resize();
           assert.equal(menu.$el.css('height'),(h+'px'));
           assert.equal(menu.$el.css('top'), '70px');
});

//QUnit.test("addView", function(assert) {
//    var menu = new BuilderMenuView({model: new Backbone.Model(),
//        storage: mockStorageMenu
//    });
//           
//           menu.render().addView('<div>view</div>','90');
//           assert.ok(menu.$el.find('.#side-90').hasClass('active'));
//           
//});

QUnit.test("rotate", function(assert) {
           var menu = new BuilderMenuView({model: new Backbone.Model(),
                storage: mockStorageMenu
            });
           menu.render().rotate('side-0');
           assert.equal(menu.id,'builder-menu');
           assert.ok(menu.$el.find('.card-main').hasClass('side-0'));
           menu.rotate('side-90');
           assert.ok(!menu.$el.find('.card-main').hasClass('side-0'));
           
           });

//onEditStart

//onEditStop

QUnit.test("onEditMode", function(assert) {
           var done = assert.async();
           var menu = new BuilderMenuView({model: new Backbone.Model(),
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
           var menu = new BuilderMenuView({model: new Backbone.Model(),
                                          storage: mockStorageMenu
                                          });
           menu.render().rotate('side-270');
           assert.ok(menu.$el.find('.card-main').hasClass('side-270'));
           menu.back();
           assert.ok(menu.$el.find('.card-main'));
           });
//delView

