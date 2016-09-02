QUnit.module("QoobMenuBlocksPreviewView");

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html('view');
        return this;
    }
});

var mockTemplateMenuBlocksPreview =
    "<div class=\"preview-blocks\">"+
    "<div id=\"preview-block-header_small_bg\" class=\"preview-block\">"+
        "<img src=\"1.png\">"+
    "</div>"+
"</div>";

var mockStorageMenuBlocksPreview = {
    qoobTemplates: { 'menu-blocks-preview': mockTemplateMenuBlocksPreview },
    qoobData: { 'groups': [] }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menublocks = new QoobMenuBlocksPreviewView({
        model: new Backbone.Model(),
        storage: 1,
        controller: 2,
        group: 3
    });
    assert.equal(menublocks.storage, 1);
    assert.equal(menublocks.controller, 2);
    assert.equal(menublocks.group, 3);
});

QUnit.test("render", function(assert) {
    var menublocks = new QoobMenuBlocksPreviewView({
        model: new Backbone.Model(),
        storage: mockStorageMenuBlocksPreview,
        group: "preview-block-header_small_bg"
    });
    assert.equal(mockTemplateMenuBlocksPreview, menublocks.render().$el.html());
});
