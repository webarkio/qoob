QUnit.module("QoobMenuSettingsView");

var mockTemplateMenuSettings =
    "<div class=\"backward\">"+
    "<a href=\"#\" class=\"back\"><span>Back</span></a></div>"+
"<div class=\"settings-blocks\">"+
    "<div class=\"block-button\">"+
        "<div class=\"delete-button-small delete-block\"></div>"+
        "<div class=\"button-movedown movedown\"><span>Move</span></div>"+
        "<div class=\"button-moveup moveup\"><span>Move</span></div>"+
    "</div>"+
"</div>";

var mockSettingsWithField = "<div class=\"backward\">"+
    "<a href=\"#\" class=\"back\"><span>Back</span></a></div>"+
"<div class=\"settings-blocks\">"+
    "<div class=\"settings-block\">"+
        "<div class=\"settings-item\">"+
            "<div class=\"title\">Action button text</div>"+
            "<input class=\"input-text\" type=\"text\" name=\"action_text\" value=\"Action text\">"+
        "</div>"+
    "</div>" +
    "<div class=\"block-button\">"+
        "<div class=\"delete-button-small delete-block\"></div>"+
        "<div class=\"button-movedown movedown\"><span>Move</span></div>"+
        "<div class=\"button-moveup moveup\"><span>Move</span></div>"+
    "</div>"+
"</div>";

var testSettings = [{
    label: "Action button text",
    name: "action_text",
    type: "text"
}];

var testDefaults = {
    action_text: 'Action text'
};

var mockStorageMenuSettings = {
    qoobTemplates: { 
        'menu-settings-preview': mockTemplateMenuSettings,
        '.settings-blocks': "<div class=\"settings-item\"><div class=\"title\">Header</div></div>", 
        'field-text-preview': '<div class="title"><%= label %></div><input class="input-text" type="text" name="<%= name %>" value="<%= value %>">'
    }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });
    assert.equal(menuSettings.storage, 1);
    assert.equal(menuSettings.controller, 2);
});

QUnit.test("render", function(assert) {
    var menuSettings = new QoobMenuSettingsView({
        model: new Backbone.Model(),
        storage: mockStorageMenuSettings,
        config: {
            settings: testSettings,
            defaults: testDefaults
        },
        settings: null,
        defaults: null,
        controller: 2
    });
    assert.equal(menuSettings.render().$el.html(), mockSettingsWithField);
});
