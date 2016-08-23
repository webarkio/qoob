QUnit.module("QoobMenuGroupsView");

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    }
});

var mockTemplateMenuGroups =
    "<ul><li><a href=\"#groups/introduction\"></a></li></ul>";

var mockStorageMenuGroups = {
    qoobTemplates: { 'menu-groups-preview': mockTemplateMenuGroups },
    qoobData: { 'groups': [] }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menugroups = new QoobMenuGroupsView({
        model: new Backbone.Model(),
        storage: 1
    });
    assert.equal(menugroups.storage, 1);
});

QUnit.test("render", function(assert) {
    var menugroups = new QoobMenuGroupsView({
        model: new Backbone.Model(),
        storage: mockStorageMenuGroups
    });
    assert.equal(mockTemplateMenuGroups, menugroups.render().$el.html());
});

