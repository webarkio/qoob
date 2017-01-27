/*global QoobManageLibsView*/
QUnit.module("QoobManageLibsView");

var mockTemplateManageLibs = '<div class="backward"><a href="#index"><span>Back</span></a></div><div class="settings-blocks-full"><div class="settings-block"><div class="settings-item"><div class="title">Add url library</div><div class="container-input-add"><input class="input-url" type="text" name="url" value="" placeholder="enter url library"><div class="add-item add-ibrary"><i class="fa fa-plus"></i></div></div></div></div><div class="settings-block libraries"><div class="settings-item"><div class="title">Libraries</div><div class="library"><div class="name-library">default</div><div class="control-library" data-lib-name="default"><a class="update-library" href="#"><i class="fa fa-refresh"></i></a><a class="remove-library" href="#"><i class="fa fa-trash"></i></a></div></div></div><div class="settings-item"><div class="phrase-reload-page">You need to <a class="reload-page" href="">reload page</a></div></div></div></div>';

var mockTemplateManageLibsResult = '<div class="backward"><a href="#index"><span>Back</span></a></div><div class="settings-blocks-full"><div class="settings-block"><div class="settings-item"><div class="title">Add url library</div><div class="container-input-add"><input class="input-url" type="text" name="url" value="" placeholder="enter url library"><div class="add-item add-ibrary"><i class="fa fa-plus"></i></div></div></div></div><div class="settings-block libraries"><div class="settings-item"><div class="title">Libraries</div><div class="library"><div class="name-library">default</div><div class="control-library" data-lib-name="default"><a class="update-library" href="#"><i class="fa fa-refresh"></i></a><a class="remove-library" href="#"><i class="fa fa-trash"></i></a></div></div></div><div class="settings-item"><div class="phrase-reload-page">You need to <a class="reload-page" href="">reload page</a></div></div></div></div>';

var mockStorageManageLibs = {
    getSkinTemplate: function(templateName) {
        if (templateName == 'menu-manage-libs-preview') {
            return mockTemplateManageLibs;
        }
    },
    __: function(s1, s2) {
        return s1 + " " + s2;
    },
    librariesData: [{
        name: 'default'
    }]
};


//============START TEST===============
QUnit.test("attributes", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: {},
        controller: {}
    });

    assert.equal(manageLibs.attributes()['class'], 'manage-libs settings');
    assert.equal(manageLibs.attributes()['data-side-id'], 'manage-libs');
});

QUnit.test("initialize", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: 1,
        controller: 2
    });

    assert.equal(manageLibs.storage, 1, 'Storage Ok');
    assert.equal(manageLibs.controller, 2, 'Controller Ok');
});

QUnit.test("clickAddLibrary", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {
            showMenuOverlay: function() {
                assert.ok(true, 'controller showMenuOverlay Ok');
            },
            addLibrary: function() {
                assert.ok(true, 'controller addLibrary Ok');
            }
        }
    });

    jQuery('body').append(manageLibs.render().$el);
    manageLibs.$el.find('input[name="url"]').val('test-url');
    manageLibs.$el.find('.add-ibrary').trigger('click');
    manageLibs.remove();
});

QUnit.test("clickUpdateLibrary", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {
            updateLibrary: function() {
                assert.ok(true, 'controller updateLibrary Ok');
            },
            showMenuOverlay: function() {
                assert.ok(true, 'controller showMenuOverlay Ok');
            },
            hideMenuOverlay: function() {
                assert.ok(true, 'controller hideMenuOverlay Ok');
            }
        }
    });

    jQuery('body').append(manageLibs.render().$el);
    manageLibs.$el.find('.update-library').trigger('click');
    manageLibs.remove();
});

QUnit.test("clickRemoveLibrary", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {
            removeLibrary: function() {
                assert.ok(true, 'controller removeLibrary Ok');
            },
            showMenuOverlay: function() {
                assert.ok(true, 'controller showMenuOverlay Ok');
            },
            hideMenuOverlay: function() {
                assert.ok(true, 'controller hideMenuOverlay Ok');

            }
        }
    });

    jQuery('body').append(manageLibs.render().$el);
    manageLibs.$el.find('.remove-library').trigger('click');
    manageLibs.remove();
});

QUnit.test("showPhraseReload", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {}
    });

    jQuery('body').append(manageLibs.render().$el);
    manageLibs.$el.find('.phrase-reload-page').show();
    assert.equal(manageLibs.$el.find('.phrase-reload-page').css('display'), 'block', 'showPhraseReload Ok');
    manageLibs.remove();
});

QUnit.test("clickReloadPage", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {}
    });

    jQuery('body').append(manageLibs.render().$el);
    manageLibs.$el.find('.reload-page').click();

    try {
        window.stop();
    } catch (exception) {
        document.execCommand('Stop');
    }

    (function() {
        assert.ok(true, 'clickReloadPage Ok');
    })(window.location);

    manageLibs.remove();
});

QUnit.test("render", function(assert) {
    var manageLibs = new QoobManageLibsView({
        storage: mockStorageManageLibs,
        controller: {}
    });

    jQuery('body').append(manageLibs.render().$el);
    assert.equal(mockTemplateManageLibsResult, manageLibs.render().$el.html());
    manageLibs.remove();
});
