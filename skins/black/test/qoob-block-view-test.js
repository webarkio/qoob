/*global QoobBlockView, QoobViewportView*/
QUnit.module("QoobBlockView");

var mockTemplateIframe = "<iframe src=\"iframe.html\" scrolling=\"auto\" name=\"qoob-iframe\" id=\"qoob-iframe\" style=\"height: 488px; width: 768px;\"></iframe>",
    iframeUrl = "iframe.html";

var mockBlockViewTemplateErrorResult = '<div class="empty-block"><div class="empty-block-text">The block qoob_main is not found in the library default</div></div>';

var mockBlockViewStorage = {
    driver: {
        getIframePageUrl: function() {
            return iframeUrl;
        }
    },
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-viewport-preview') {
            return mockTemplateIframe;
        }
    },
    getBlockTemplate: function(lib, block, cb) {
        cb('blockNotFound');
    }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var innerBlock = new QoobBlockView({
        storage: 1,
        controller: 2
    });

    assert.equal(innerBlock.storage, 1, 'Storage Ok');
    assert.equal(innerBlock.controller, 2, 'Controller Ok');
});

QUnit.test("render", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockViewStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var innerBlock = new QoobBlockView({
            storage: mockBlockViewStorage,
            controller: {
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    }
                },
                triggerIframe: function() {
                    assert.ok(true, 'triggerIframe');
                }
            },
            model: new Backbone.Model({ lib: 'default', block: 'qoob_main' })
        });

        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(innerBlock.render().$el.html());
        assert.equal(innerBlock.$el.html(), mockBlockViewTemplateErrorResult);
        viewport.remove();
        done();
    });
});


QUnit.test("dispose", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockBlockViewStorage
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var innerBlock = new QoobBlockView({
            storage: mockBlockViewStorage,
            controller: {
                layout: {
                    viewPort: {
                        getWindowIframe: function() {
                            return window.frames["qoob-iframe"];
                        }
                    }
                },
                triggerIframe: function() {}
            },
            model: new Backbone.Model({ lib: 'default', block: 'qoob_main' })
        });

        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(innerBlock.render().$el);
        innerBlock.dispose();
        assert.equal(iframe.jQuery('#qoob-blocks').find('.empty-block').length, 0);
        viewport.remove();
        done();
    });
});
