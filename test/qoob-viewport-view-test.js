QUnit.module("QoobViewportView");

var mockTemplate = "<iframe src=\"<%= url %>\" scrolling=\"auto\" name=\"qoob-iframe\" id=\"qoob-iframe\"></iframe>";
var iframeUrl ="iframe.html";

var mockStorageViewport = {
    qoobTemplates: { 'qoob-viewport-preview': mockTemplate},
    driver: { getIframePageUrl:function(pageId){return iframeUrl;} }
};

//============START TEST===============
QUnit.test("initialize", function(assert) {

    var viewport = new QoobMenuView({
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

    viewport.on('iframe_loaded', function(){
        assert.ok(true);
        viewport.remove();
        done();

    })

    $('body').append(viewport.render().$el);
});


QUnit.test("startEditBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function(){
        //IFRAME CONTENT LOADED
        viewport.startEditBlock(6);
        //Get iframe content
        var iframe = viewport.getWindowIframe();

        assert.ok(iframe.jQuery('#outer-block-6').find('.overlay').hasClass('active'));
        assert.ok(iframe.jQuery('#outer-block-1').find('.overlay').hasClass('active')==false);
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

    viewport.on('iframe_loaded', function(){
        //IFRAME CONTENT LOADED
        viewport.startEditBlock(6);
        //Get iframe content
        var iframe = viewport.getWindowIframe();
        assert.ok(iframe.jQuery('#outer-block-6').find('.overlay').hasClass('active'));
        viewport.stopEditBlock();
        assert.ok(iframe.jQuery('#outer-block-6').find('.overlay').hasClass('active')==false);
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

    viewport.on('iframe_loaded', function(){
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

    viewport.on('iframe_loaded', function(){
        viewport.setEditMode();
        assert.ok(viewport.getIframeContents().find('#qoob-blocks').hasClass('preview')==false);
        viewport.remove();
        done();

    });
    
    $('body').append(viewport.render().$el);

});

QUnit.test("setDeviceMode", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function(){
        
        viewport.setDeviceMode('phone-vertical');
        assert.equal(viewport.getIframe().width(), '375px' );
        
        viewport.remove();
        done();

    });
    
    $('body').append(viewport.render().$el);

});

QUnit.test("triggerQoobBlock", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function(){
        
        viewport.triggerQoobBlock();
        var iframe = viewport.getWindowIframe();
        assert.ok(iframe.jQuery('#qoob-blocks').trigger('change'));
        viewport.remove();
        done();

    });
    
    $('body').append(viewport.render().$el);


});

QUnit.test("getIframe", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function(){
        viewport.getIframe();
        assert.ok(viewport.$el.find('#qoob-iframe'));
        viewport.remove();
        done();

    });
    
    $('body').append(viewport.render().$el);

});

QUnit.test("getIframeContents", function(assert) {
    var done = assert.async();
    var viewport = new QoobViewportView({
        model: new Backbone.Model(),
        storage: mockStorageViewport
    });

    viewport.on('iframe_loaded', function(){
        viewport.getIframeContents();
        assert.ok(viewport.getIframe());
        viewport.remove();
        done();

    });
    
    $('body').append(viewport.render().$el);

});


