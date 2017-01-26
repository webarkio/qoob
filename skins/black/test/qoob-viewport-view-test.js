/*global QoobViewportView*/
QUnit.module("QoobViewportView");


var mockTemplateIframe = "<iframe src=\"<%= url %>\" scrolling=\"auto\" name=\"qoob-iframe\" id=\"qoob-iframe\" style=\"height: 488px; width: 768px;\"></iframe>",
    iframeUrl = "iframe.html";

var mockViewportBlocksTemplate = '<div id="outer-block-1"><div class="qoob-overlay"></div></div>' +
    '<div id="outer-block-2"><div class="qoob-overlay"></div></div>';

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

var mockBlockDefaultTemplates = '<div class="block-blank full-page">' +
    '<div class="block-blank-inner">' +
    '<div class="block-blank-inner-text">' +
    '<i class="fa fa-reply"></i>' +
    '<div class="blank-text">This is blank page, you can click on block preview to add block</div>' +
    '</div>' +
    '</div>' +
    '</div>';

var mockStorageViewport = {
    driver: {
        getIframePageUrl: function() {
            return iframeUrl;
        }
    },
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-viewport-preview') {
            return mockTemplateIframe;
        } else if (templateName == 'block-pleasewait-preview') {
            return mockTemplateBlockPleaseWaitPreview;
        } else if (templateName == 'block-default-templates') {
            return mockBlockDefaultTemplates;
        }
    },
    __: function(s1, s2) {
        return s1 + ' ' + s2;
    },
    getBlockTemplate: function() {

    },
    defaultTemplatesCollection: new Backbone.Collection([{ name: "test" }]),
    loadTemplates: function(cb) {
        cb(null, []);
    },
    pageId: 1
};

var mockController = {
    current: function() {
        return {
            route: false,
            fragment: false,
            params: false
        };
    }
};

var View = Backbone.View.extend({
    tag: 'div',
    render: function() {
        this.$el.html(mockViewportBlocksTemplate);
        return this;
    },
    dispose: function() {
        return this;
    }
});

//============START TEST===============
QUnit.test("initialize", function(assert) {
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: 1,
        controller: 2
    });

    assert.equal(viewport.storage, 1);
    assert.equal(viewport.controller, 2);
});

QUnit.test("render", function(assert) {
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    assert.equal(_.template(mockTemplateIframe)({ "url": iframeUrl }), viewport.render().$el.html());
});

QUnit.test("iframeLoaded", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        assert.ok(true);
        viewport.getWindowIframe();
        viewport.remove();
        done();
    });
});

QUnit.test("startEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        //Get iframe content
        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockViewportBlocksTemplate);
        viewport.startEditBlock(1);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        assert.strictEqual(iframe.jQuery('#outer-block-2').find('.qoob-overlay').hasClass('active'), false);
        viewport.remove();
        done();
    });
});

QUnit.test("stopEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        //Get iframe content
        var iframe = viewport.getWindowIframe();
        iframe.jQuery('#qoob-blocks').append(mockViewportBlocksTemplate);
        viewport.startEditBlock(1);
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'));
        viewport.stopEditBlock();
        assert.strictEqual(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active'), false);
        viewport.remove();
        done();
    });
});

QUnit.test("setPreviewMode", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        viewport.setPreviewMode();
        assert.ok(viewport.getIframeContents().find('#qoob-blocks').hasClass('preview'));
        viewport.remove();
        done();
    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        viewport.setEditMode();
        assert.strictEqual(viewport.getIframeContents().find('#qoob-blocks').hasClass('preview'), false);
        viewport.remove();
        done();

    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("setDeviceMode", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: mockController
    });

    viewport.on('iframe_loaded', function() {

        assert.equal(viewport.getIframe().width(), '768');
        assert.equal(viewport.deviceMode, 'pc');
        viewport.setDeviceMode('tablet-horizontal');
        viewport.resize();
        assert.equal(viewport.deviceMode, 'tablet-horizontal');
        viewport.remove();
        done();
    });

    jQuery('body').append(viewport.render().$el);

});

QUnit.test("resize", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        var size = {
            'height': (viewport.previewMode ? 0 : 70),
            'width': (viewport.previewMode ? 0 : 258)
        };
        assert.equal(viewport.getIframe().height(), '488');
        viewport.resize();
        assert.notEqual(viewport.getIframe().height(), '488');
        assert.equal(viewport.getIframe().height(), jQuery(window).height() - size.height);
        viewport.remove();
        done();
    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("scrollTo", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {}
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = viewport.getWindowIframe();

        var ViewTest = new View({
            model: new Backbone.Model({
                id: 2
            })
        });

        viewport.blockViews.push(ViewTest);

        iframe.jQuery('#qoob-blocks').append(ViewTest.render().$el);
        var viewTop = ViewTest.$el.offset().top = 100;
        viewport.scrollTo(2);
        assert.equal(!viewTop, !ViewTest.$el.offset().top);
        viewport.remove();
        done();
    });
});

QUnit.test("getBlockView", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {}
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var ViewTest = new View({
            model: new Backbone.Model({
                id: 20
            })
        });

        viewport.blockViews.push(ViewTest);
        assert.deepEqual(ViewTest, viewport.getBlockView(20));
        viewport.remove();
        done();
    });
});

QUnit.test("delBlockView", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            changeDefaultPage: function() {
                assert.ok(true, 'controller changeDefaultPage');
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var Model = new Backbone.Model({
            id: 103
        });

        viewport.blockViews.length = 0;

        var ViewTest = new View({
            model: Model
        });

        viewport.blockViews.push(ViewTest);
        viewport.delBlockView(Model);
        assert.equal(viewport.blockViews.length, 0);
        viewport.remove();
        done();
    });
});

QUnit.test("addBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            changeDefaultPage: function() {},
            layout: {
                viewPort: {
                    getWindowIframe: function() {
                        return window.frames["qoob-iframe"];
                    }
                }
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var Model = new Backbone.Model({
            id: 102
        });

        viewport.addBlock(Model);
        var iframe = viewport.getWindowIframe();
        assert.ok(iframe.jQuery('#outer-block-102').length);

        viewport.remove();
        done();
    });
});

QUnit.test("triggerIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        var iframe = viewport.getWindowIframe();
        viewport.triggerIframe();

        iframe.jQuery('#qoob-blocks').on('change', function() {
            assert.ok(true);
            viewport.remove();
            done();
        });

    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("getIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.ok(viewport.getIframe().length);
        viewport.remove();
        done();
    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("getIframeContents", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.ok(viewport.getIframeContents().length);
        viewport.remove();
        done();

    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("getWindowIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.ok(viewport.getWindowIframe().document);
        viewport.remove();
        done();
    });

    jQuery('body').append(viewport.render().$el);
});

QUnit.test("moveUpBlockView", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            changeDefaultPage: function() {},
            layout: {
                viewPort: {
                    getWindowIframe: function() {
                        return window.frames["qoob-iframe"];
                    }
                }
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = viewport.getWindowIframe();

        var FirstModel = new Backbone.Model({
            id: 102
        });
        var SecondModel = new Backbone.Model({
            id: 103
        });

        viewport.addBlock(FirstModel);
        viewport.addBlock(SecondModel);

        viewport.moveUpBlockView(103);
        assert.equal(iframe.jQuery('#qoob-blocks').find('#outer-block-103').index(), 0);

        viewport.remove();
        done();
    });
});

QUnit.test("moveDownBlockView", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            changeDefaultPage: function() {},
            layout: {
                viewPort: {
                    getWindowIframe: function() {
                        return window.frames["qoob-iframe"];
                    }
                }
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = viewport.getWindowIframe();

        var FirstModel = new Backbone.Model({
            id: 107
        });
        var SecondModel = new Backbone.Model({
            id: 108
        });

        viewport.addBlock(FirstModel);
        viewport.addBlock(SecondModel);

        viewport.moveDownBlockView(108);
        assert.equal(iframe.jQuery('#qoob-blocks').find('#outer-block-108').index(), 1);

        viewport.remove();
        done();
    });
});

QUnit.test("createBlankBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            layout: {
                viewPort: {
                    getWindowIframe: function() {
                        return window.frames["qoob-iframe"];
                    }
                }
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = viewport.getWindowIframe();
        viewport.createBlankPage();
        assert.equal(iframe.jQuery('#qoob-blocks').find('.qoob-templates').length, 1);
        viewport.remove();
        done();
    });
});

QUnit.test("changeDefaultPage", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport,
        controller: {
            layout: {
                viewPort: {
                    getWindowIframe: function() {
                        return window.frames["qoob-iframe"];
                    }
                }
            }
        }
    });

    jQuery('body').append(viewport.render().$el);

    viewport.$el.find('#qoob-iframe').on('libraries_loaded', function() {
        var iframe = viewport.getWindowIframe();
        viewport.createBlankPage();
        viewport.changeDefaultPage('hide');
        assert.equal(iframe.jQuery('#qoob-blocks').find('.qoob-templates').css('display'), 'none', 'hide');
        viewport.changeDefaultPage('show');
        assert.equal(iframe.jQuery('#qoob-blocks').find('.qoob-templates').css('display'), 'block', 'show');
        viewport.remove();
        done();
    });
});
