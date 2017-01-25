/*global QoobMenuGroupsView*/
QUnit.module("QoobMenuGroupsView");

var mockTemplateMenuGroups =
    '<ul><li><a href="#groups/introduction"></a></li></ul>';

var mockStorageMenuGroups = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'menu-groups-preview') {
            return mockTemplateMenuGroups;
        }
    },
    __: function(s1, s2) {
        return s1 + ' ' + s2;
    }
};

//============START TEST===============
QUnit.test("attributes", function(assert) {
    var menugroups = new QoobMenuGroupsView({});
    assert.equal(menugroups.attributes()['data-side-id'], 'catalog-groups');
});

QUnit.test("initialize", function(assert) {
    var menugroups = new QoobMenuGroupsView({
        storage: {},
        groups: [],
        controller: {}
    });

    assert.deepEqual(menugroups.storage, {}, 'Storage Ok');
    assert.deepEqual(menugroups.groups, [], 'Groups Ok');
    assert.deepEqual(menugroups.controller, {}, 'Controller Ok');
});

QUnit.test("render", function(assert) {
    var menugroups = new QoobMenuGroupsView({
        storage: mockStorageMenuGroups,
        groups: [],
        controller: {}
    });

    assert.equal(mockTemplateMenuGroups, menugroups.render().$el.html());
    assert.deepEqual(menugroups.groups, [], 'Groups Ok');
    assert.deepEqual(menugroups.controller, {}, 'Controller Ok');
});
