/*global QoobBlockWrapperView, QoobBlockView, QoobViewportView*/
QUnit.module("QoobBlockWrapperView");

var iframeUrl = "iframe.html";

var mockBlockWrapperTemplateResult = '<div id="droppable-1" class="droppable ui-droppable"><div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div></div><div class="qoob-overlay"></div><div class="content-block-inner"><div class="empty-block"><div class="empty-block-text">The block qoob_main is not found in the library default</div></div></div>';

var mockTemplateBlockPleaseWaitPreview = '<div class="wait-block">' +
    '<div class="clock">' +
    '<div class="minutes-container">' +
    '<div class="minutes"></div>' +
    '</div>' +
    '<div class="seconds-container">' +
    '<div class="seconds"></div>' +
    '</div>' +
    '</div><span></span>' +
    '</div>';

var mockBlockWrapperStorage = {
    driver: {
        getIframePageUrl: function() {
            return iframeUrl;
        }
    },
    getSkinTemplate: function(templateName) {
        if (templateName == 'block-droppable-preview') {
            return '<div id="droppable-1" class="droppable ui-droppable"><div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div></div>';
        } else if (templateName == 'block-overlay-preview') {
            return '<div class="qoob-overlay"></div>';
        } else if (templateName == 'block-pleasewait-preview') {
            return mockTemplateBlockPleaseWaitPreview;
        } else if (templateName == 'qoob-viewport-preview') {
            return '<iframe src="iframe.html" scrolling="auto" name="qoob-iframe" id="qoob-iframe" style="height: 488px; width: 768px;"></iframe>';
        }
    },
    __: function(s1, s2) {
        return s1 + ' ' + s2;
    },
    getBlockTemplate: function(lib, block, cb) {
        cb('blockNotFound');
    }
};

var WrapperModel = new Backbone.Model({ id: 1 });

//============START TEST===============
QUnit.test("attributes", function(assert) {
    var blockWrapper = new QoobBlockWrapperView({
        storage: 1,
        controller: 2,
        innerBlock: 3,
        model: WrapperModel
    });

    assert.equal(blockWrapper.attributes()['id'], 'outer-block-' + blockWrapper.model.id);
});

QUnit.test("initialize", function(assert) {
    var blockWrapper = new QoobBlockWrapperView({
        storage: 1,
        controller: 2,
        innerBlock: new QoobBlockView({ model: WrapperModel, storage: 1, controller: 2 }),
        model: WrapperModel
    });

    assert.equal(blockWrapper.storage, 1, 'Storage Ok');
    assert.equal(blockWrapper.controller, 2, 'Controller Ok');
    assert.ok(blockWrapper.innerBlock, 'innerBlock Ok');
});

QUnit.test("render", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockWrapperStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {

        var blockWrapper = new QoobBlockWrapperView({
            storage: mockBlockWrapperStorage,
            controller: {
                triggerIframe: function() {
                    assert.ok(true, 'triggerIframe');
                },
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    }
                }
            },
            innerBlock: new QoobBlockView({ model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' }), storage: 1, controller: 2 }),
            model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' })
        });

        assert.equal(blockWrapper.render().$el.html(), mockBlockWrapperTemplateResult, 'render Ok');
        viewport.remove();
        done();
    });
});

QUnit.test("clickStartEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockWrapperStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {

        var blockWrapper = new QoobBlockWrapperView({
            storage: mockBlockWrapperStorage,
            controller: {
                triggerIframe: function() {},
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    },
                    menu: {
                        getSettingsView: function() {
                            assert.ok(true, 'getSettingsView');
                        }
                    }
                }
            },
            innerBlock: new QoobBlockView({ model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' }), storage: 1, controller: 2 }),
            model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' })
        });

        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(blockWrapper.render().$el.html());

        blockWrapper.$el.find('.qoob-overlay').trigger('click');

        viewport.remove();
        done();
    });
});

QUnit.test("droppable", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockWrapperStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {

        var blockWrapper = new QoobBlockWrapperView({
            storage: mockBlockWrapperStorage,
            controller: {
                triggerIframe: function() {},
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    }
                }
            },
            innerBlock: new QoobBlockView({ model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' }), storage: 1, controller: 2 }),
            model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' })
        });

        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(blockWrapper.render().$el.html());

        blockWrapper.droppable();

        //FIXME: droppable test doesn't work right
        assert.ok(true, "droppable test doesn't work right");

        viewport.remove();
        done();
    });
});

QUnit.test("dispose", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockWrapperStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {

        var blockWrapper = new QoobBlockWrapperView({
            storage: mockBlockWrapperStorage,
            controller: {
                triggerIframe: function() {},
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    }
                }
            },
            innerBlock: new QoobBlockView({ model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' }), storage: 1, controller: 2 }),
            model: new Backbone.Model({ id: 1, lib: 'default', block: 'qoob_main' })
        });

        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(blockWrapper.render().$el);

        blockWrapper.dispose();

        _.delay(function() {
            assert.equal(iframe.jQuery('#outer-block-1').css('display'), undefined);
            viewport.remove();
            done();
        }, 740); //css delay .7sec

    });
});
