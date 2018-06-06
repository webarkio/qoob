/*global QoobSidebarView*/
QUnit.module("QoobSidebarView");

var mockSidebarTemplate = '<div id="qoob-sidebar"></div>';

//============START TEST===============

// QUnit.test("attributes", function(assert) {
//     var toolbar = new QoobToolbarView({});
//     assert.equal(toolbar.el.id, 'qoob-toolbar');
// });

QUnit.test("attributes", function(assert) {
    var sidebar = new QoobSidebarView({});
    assert.equal(sidebar.el.id, 'qoob-sidebar');
});

QUnit.test("initialize", function(assert) {
    var sidebar = new QoobSidebarView({
        storage: 1,
        controller: 2
    });

    assert.equal(sidebar.storage, 1);
    assert.equal(sidebar.controller, 2);
});

// QUnit.test("initialize", function(assert) {
//     var toolbar = new QoobToolbarView({
//         storage: 1,
//         controller: 2
//     });

//     assert.equal(toolbar.storage, 1);
//     assert.equal(toolbar.controller, 2);
// });


// QUnit.test("render", function(assert) {
//     var toolbar = new QoobSidebarView({
//         storage: mockToolbarStorage
//     });

//     assert.equal(toolbar.render().$el.html(), mockToolbarTemplateResult);
// });
