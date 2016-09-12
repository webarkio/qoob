/**
 * Initialize page qoob
 *
 * @version 0.0.1
 * @class  Qoob
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Qoob = Qoob;
function Qoob(options) {

    this.loader = new QoobLoader(this);

    this.options = {
        blockTemplateAdapter: 'hbs',
        blockPreviewUrl: "preview.png"
    };
    _.extend(this.options, options);

    this.storage = options.storage;
    this.controller = new QoobController();

    this.pageModel = new PageModel();

    this.layout = new QoobLayout({
        "model": this.pageModel,
        "storage": this.storage,
        "controller": this.controller
    });

    this.controller.setLayout(this.layout);
    this.controller.setPageModel(this.pageModel);
    this.controller.setStorage(this.storage);
}

/**
 * Activate page qoob
 */
Qoob.prototype.activate = function() {

    var self = this;
    this.loader.addStep(4);
    //Creating and appending qoob layout
    jQuery(window).resize(function() {
        self.layout.resize();
    });
    //Start loading data
    this.storage.loadQoobTemplates(function(err, qoobTemplates) {
        self.loader.step();
        self.storage.driver.loadLibsInfo(function(err, qoobLibs) {
            self.loader.step();
            self.storage.joinLibs(qoobLibs.libs, function (err, qoobLibs) {
                self.storage.loadPageData(function(err, pageData) {
                    self.loader.step();

                    //If blocks loaded to viewPort
                    self.layout.viewPort.once('blocks_loaded', function() {
                        self.controller.triggerIframe();
                        Backbone.history.start({ pushState: false });
                        self.loader.step();
                    });

                    //If iframe ready to load blocks
                    self.layout.viewPort.once('iframe_loaded', function() {
                        self.layout.viewPort.getWindowIframe().onbeforeunload = function(){return false;};
                        //Start loading blocks
                        if (pageData && pageData.blocks.length > 0) {
                            self.controller.load(pageData.blocks);
                        } else {
                            Backbone.history.start({ pushState: false });
                            //Skip counter for blocks
                            self.layout.viewPort.blocksCounter = null;
                            self.loader.step();
                            
                            // if first start page
                            self.layout.viewPort.createBlankBlock();
                        }
                        jQuery('#lib-select').selectpicker();

                    });

                    //Render layout
                    jQuery('body').prepend(self.layout.render().el);
                    self.layout.resize();

                }); 
            });
        });
    });
};