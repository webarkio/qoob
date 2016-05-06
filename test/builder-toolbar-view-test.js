var testTemplate = "TOOLBAR HTML TEMPLATE <a href=\"#\" class=\"save-button\">save</a><a href=\"#\" class=\"exit-button\">exit</a>";

var mockStorage = {
    getBuilderTemplate: function(templateName) {
        if (templateName == 'builder-toolbar') {
            return testTemplate;
        }
    }
};

QUnit.module("BuilderToolbarView");
// , {
//     beforeEach: function(assert) {
//         //assert.ok( true, "one extra assert per test" );
//         //toolbar = new BuilderToolbarView();
//     }
// });

QUnit.test("attributes", function(assert) {
    var toolbar = new BuilderToolbarView({});
    assert.equal(toolbar.el.id, 'builder-toolbar');
});

QUnit.test("render", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage
    });

    assert.equal(testTemplate, toolbar.render().$el.html());

});

QUnit.test("clickSave", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            save: function() {
                assert.ok(true);
            }
        }
    });
    toolbar.render().$el.find('.save-button').trigger('click');
});

QUnit.test("clickExit", function(assert) {
    var toolbar = new BuilderToolbarView({
        storage: mockStorage,
        controller: {
            exit: function() {
                assert.ok(true);
            }
        }
    });
    toolbar.render().$el.find('.exit-button').trigger('click');
});