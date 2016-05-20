/**
 * Initialize page builder
 *
 * @version 0.0.1
 * @class  Builder
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Builder = Builder;
function Builder(options) {

    this.loader = new BuilderLoader(this);

    this.options = {
        blockTemplateAdapter: 'hbs',
        blockPreviewUrl: "preview.png"
    };
    _.extend(this.options, options);

    this.storage = options.storage;
    this.controller = new BuilderController();

    this.pageModel = new PageModel();

    this.layout = new BuilderLayout({
        "model": this.pageModel,
        "storage": this.storage,
        "controller": this.controller
    });

    this.controller.setLayout(this.layout);
    this.controller.setPageModel(this.pageModel);
    this.controller.setStorage(this.storage);
}

/**
 * Activate page builder
 */
Builder.prototype.activate = function() {

    var self = this;
    this.loader.addStep(4);
    //Creating and appending builder layout
    jQuery(window).resize(function() {
        self.layout.resize();
    });
    //Start loading data
    this.storage.loadBuilderTemplates(function(err, builderTemplates) {
        self.loader.step();
        self.storage.loadBuilderData(function(err, builderData) {
            self.loader.step();
            self.storage.loadPageData(function(err, pageData) {
                self.loader.step();


                //If blocks loaded to viewPort
                self.layout.viewPort.once('blocks_loaded', function() {
                    Backbone.history.start({ pushState: false });
                    self.loader.step();
                });

                //If iframe ready to load blocks
                self.layout.viewPort.once('iframe_loaded', function() {

                    //self.layout.viewPort.createDefaultDroppable();

                    //Start loading blocks
                    if (pageData && pageData.blocks) {
                        self.controller.load(pageData.blocks);
                    } else {
                        Backbone.history.start({ pushState: false });
                        //Skip counter for blocks
                        self.layout.viewPort.blocksCounter = null;
                        self.loader.step();
                        
                        // if first start page
                        self.layout.viewPort.createBlankBlock();
                    }

                });

                //Render layout
                jQuery('body').prepend(self.layout.render().el);
                self.layout.resize();

            });
        });
    });
};