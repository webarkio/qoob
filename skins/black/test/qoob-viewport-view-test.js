QUnit.module("QoobViewportView");

var mockTemplate = "<iframe src=\"<%= url %>\" scrolling=\"auto\" name=\"qoob-iframe\" id=\"qoob-iframe\" style=\"height: 488px; width: 768px;\"></iframe>",
    iframeUrl = "iframe.html";

var mockStorageViewport = {
    driver: {
        getIframePageUrl: function(pageId) {
            return iframeUrl;
        }
    },
    getSkinTemplate: function(templateName) {
        if (templateName == 'qoob-viewport-preview') {
            return mockTemplate;       
        }
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

    assert.equal(_.template(mockTemplate)({ "url": iframeUrl }), viewport.render().$el.html());
});


QUnit.test("iframeLoaded", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.ok(true);
        viewport.getWindowIframe();
        viewport.remove();
        done();
    });

    $('body').append(viewport.render().$el);
});


QUnit.test("startEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        //IFRAME CONTENT LOADED
        viewport.startEditBlock(6);
        //Get iframe content
        var iframe = viewport.getWindowIframe();

        assert.ok(iframe.jQuery('#outer-block-6').find('.qoob-overlay').hasClass('active'));
        assert.ok(iframe.jQuery('#outer-block-1').find('.qoob-overlay').hasClass('active') == false);
        viewport.remove();
        done();
    });

    $('body').append(viewport.render().$el);
});

QUnit.test("stopEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        //IFRAME CONTENT LOADED
        viewport.startEditBlock(6);
        //Get iframe content
        var iframe = viewport.getWindowIframe();
        assert.ok(iframe.jQuery('#outer-block-6').find('.qoob-overlay').hasClass('active'));
        viewport.stopEditBlock();
        assert.ok(iframe.jQuery('#outer-block-6').find('.qoob-overlay').hasClass('active') == false);
        viewport.remove();
        done();

    });

    $('body').append(viewport.render().$el);
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

    $('body').append(viewport.render().$el);

});

QUnit.test("setEditMode", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        viewport.setEditMode();
        assert.ok(viewport.getIframeContents().find('#qoob-blocks').hasClass('preview') === false);
        viewport.remove();
        done();

    });

    $('body').append(viewport.render().$el);

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

    $('body').append(viewport.render().$el);

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

    $('body').append(viewport.render().$el);
});
//scrollTo
//getBlockView
//delBlockView
//addBlock


QUnit.test("triggerQoobBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        var iframe = viewport.getWindowIframe();
        assert.ok(iframe.jQuery('#qoob-blocks').trigger('change'));
        viewport.remove();
        done();
    });

    $('body').append(viewport.render().$el);


});

///?
QUnit.test("getIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.deepEqual(viewport.$el.find('#qoob-iframe'), viewport.getIframe());
        viewport.remove();
        done();
    });

    $('body').append(viewport.render().$el);

});

//?
QUnit.test("getIframeContents", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        assert.deepEqual(viewport.getIframe().contents(), viewport.getIframeContents());
        viewport.remove();
        done();

    });

    $('body').append(viewport.render().$el);

});

//?
QUnit.test("getWindowIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function() {
        viewport.getWindowIframe();
        assert.equal(window.frames["qoob-iframe"], viewport.getWindowIframe());
        viewport.remove();
        done();

    });

    $('body').append(viewport.render().$el);

});
//moveUpBlockView
//moveDownBlockView
//createBlankBlock

// QUnit.test("createBlankBlock", function(assert) {
//     var done = assert.async();
//     var viewport = new QoobViewportView({
//         model: new Backbone.Model(),
//         storage: mockStorageViewport
//     });

//     viewport.on('iframe_loaded', function(){

//         viewport.createBlankBlock();
//         var iframe = viewport.getWindowIframe();
//         assert.ok(iframe.jQuery('#qoob-blocks').append(_.template(mockTemplate)()));
//        // assert.equal(_.template(mockTemplate)(), viewport.render().$el.html());
//         viewport.remove();
//         done();
//     });

//     $('body').append(viewport.render().$el);

// });
