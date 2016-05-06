var testTemplate = "TOOLBAR HTML TEMPLATE";

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

    toolbar.render();
    assert.equal(testTemplate, toolbar.$el.html());

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
    toolbar.clickSave();
});
