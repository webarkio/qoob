QUnit.module("BuilderViewportView");

var mockTemplateViewport ="<iframe src=\"<%= url %>\" scrolling=\"auto\" name=\"builder-iframe\" id=\"builder-iframe\"></iframe>";

// var mockTemplateMenuResalt =
//     "<div id=\"card\">" +
//     "<div class=\"card-wrap\">" +
//     "<div class=\"card-main side-0\">" +
//     "<div id=\"side-0\" class=\"active\">" +
//     "<ul id=\"catalog-groups\" class=\"catalog-list\"><li><a href=\"#video\"></a></li></ul></div>" +
//     "<div id=\"side-90\"></div>" +
//     "<div id=\"side-180\"></div>" +
//     "<div id=\"side-270\"></div>" +
//     "</div>" +
//     "</div>" +
//     "</div>";

var mockStorageViewport = {
    builderTemplates: { 'builder-viewport-preview': mockTemplateViewport, 'url': ''}
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

// QUnit.test("render", function(assert) {
//     var viewport = new BuilderMenuView({
//         model: new Backbone.Model(),
//         storage: mockStorageViewport
//     });
//     console.log('-----');
//     console.log(viewport.render().$el.html());
//     assert.equal(mockTemplateViewport, viewport.render().$el.html());
// });
