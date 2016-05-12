QUnit.module("BuilderMenuView");

var mockTemplateMenu = "<div id=\"card\">" +
"<div class=\"card-wrap\">" +
"<div class=\"card-main side-0\">"+
"<div id=\"side-0\" class=\"active\"></div>"+
"<div id=\"catalog-groups\" class=\"catalog-list\">"+
"<a href=\"#video\">Video</a></div>"+
"<div id=\"side-90\"></div>"+
"<div id=\"side-180\"></div>"+
"<div id=\"side-270\"></div>"+
"</div></div></div>";

var mockStorageMenu = {
    builderTemplates: {'builder-menu':mockTemplateMenu, 'menu-groups-preview':""},
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
//                                          });
//
//    assert.equal(menu.addView, 1);
//});

QUnit.test("render", function(assert) {
    var menu = new BuilderMenuView({
        model: new Backbone.Model(),
        storage: mockStorageMenu
    });
           
        assert.equal(mockTemplateMenu, menu.render().$el);

});

//draggable

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var menu = new BuilderMenuView({model: new Backbone.Model(),
        storage: mockStorageMenu
                                   
    });
    $('body').append(menu.$el);
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

    $('body').append(menu.$el);
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
        console.log(menu.render().resize('310'));
    assert.equal(menu.resize().top, jQuery(window).height() - 70);
});



