QUnit.module("BuilderViewportView");

var mockTemplateViewport ="<iframe src='/?page_id=400&qoob=true' scrolling=\"auto\" name=\"builder-iframe\" id=\"builder-iframe\"></iframe>";


var mockStorageViewport = {
    builderTemplates: { 'builder-viewport-preview': mockTemplateViewport, 'url': '/?page_id=400&qoob=true'},
    driver: { 'pageId': 400 }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var viewport = new BuilderMenuView({
        model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });
    assert.equal(viewport.storage, 1);
    assert.equal(viewport.controller, 2);
});

QUnit.test("render", function(assert) {
    var viewport = new BuilderViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });
    console.log('-----');
    console.log(viewport.$el);
    assert.equal(mockTemplateViewport, viewport.render().$el.html());
});

// QUnit.test("iframeLoadedr", function(assert) {
//     var viewport = new BuilderMenuView({
//         model: new Backbone.Model(),
//         storage: mockStorageViewport
//     });
//     console.log('-----');
//     console.log(viewport.$el.html());
//     assert.equal(mockTemplateViewport, viewport.render().$el.html());
// });
