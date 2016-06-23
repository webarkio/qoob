QUnit.module("QoobMenuSettingsView");

var mockTemplateMenuSettings =
    "<div id=\"settings-block-22\" class=\"setting menu-block\">"
"<div class=\"backward\">" +
"<a href=\"#\" class=\"back\"><span>Back</span></a>" +
"</div>" +
"<div class=\"settings-blocks\">" +
"<div class=\"block-button\">" +
"<div class=\"delete-button-small delete-block\"></div>" +
"<div class=\"button-movedown movedown\"><span>Move</span></div>" +
"<div class=\"button-moveup moveup\"><span>Move</span></div>" +
"</div>" +
"</div>" +
"</div>";


var mockStorageMenuSettings = {
    qoobTemplates: { 'menu-settings-preview': mockTemplateMenuSettings }
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
