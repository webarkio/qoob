QUnit.module("QoobMenuSettingsView");

var mockTemplateMenuSettings =
    "<div class=\"backward\">"+
    "<a href=\"#\" class=\back\"><span>Back</span></a></div>"+
"<div class=\"settings-blocks\">"+
    "<div class=\"block-button\">"+
        "<div class=\"delete-button-small delete-block\"></div>"+
        "<div class=\"button-movedown movedown\"><span>Move</span></div>"+
        "<div class=\"button-moveup moveup\"><span>Move</span></div>"+
    "</div>"+
"</div>";


var mockStorageMenuSettings = {
    qoobTemplates: { 'menu-settings-preview': mockTemplateMenuSettings, '.settings-blocks': "<div class=\"settings-item\"><div class=\"title\">Header</div></div>" }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menusettings = new QoobMenuSettingsView({
        model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });
    assert.equal(menusettings.storage, 1);
    assert.equal(menusettings.controller, 2);
});

QUnit.test("render", function(assert) {
    var menusettings = new QoobMenuSettingsView({
        model: new Backbone.Model(),
        storage: 1,
        settings: null,
        defaults: null,
        controller: 2
    });
    assert.equal(mockTemplateMenuSettings, menusettings.render().$el.html());
});
