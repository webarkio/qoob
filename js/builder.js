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

/*
 * Getting driver page id for iframe
 * @param integer pageId id of the page
 * @returns string URL
 */
Builder.prototype.getIframePageUrl = function(pageId) {
    return this.driver.getIframePageUrl(pageId);
};


/**
 * DEPRECATED
 * Out of the Builder
 */
Builder.prototype.exit = function() {
    var self = this;
    if (jQuery('.checkbox-sb input').prop("checked")) {
        this.layout.viewPort.save(function(err, state) {
            self.storage.driver.exit(self.storage.pageId);
        });
    } else {
        this.storage.driver.exit(this.storage.pageId);
    }
};

/**
 * DEPRECATED
 * Autosave page data for interval
 */
Builder.prototype.autosavePageData = function() {
    var self = this;
    if (jQuery('.checkbox-sb input').prop("checked")) {
        var intervalId = setInterval(function() {
            if (!jQuery('.checkbox-sb input').prop("checked")) {
                clearInterval(intervalId);
            } else {
                self.layout.viewPort.save();
            }
        }, 60000);
    }
};




/**
 * Activate page builder
 */
Builder.prototype.activate = function() {

    var self = this;
    this.loader.add(4);
    //Creating and appending builder layout
    jQuery(window).resize(function() {
        self.layout.resize()
    });
    //Start loading data
    this.storage.loadBuilderTemplates(function(err, builderTemplates) {
        self.loader.sub();
        self.storage.loadBuilderData(function(err, builderData) {
            self.loader.sub();
            self.storage.loadPageData(function(err, pageData) {
                self.loader.sub();


                //If blocks loaded to viewPort
                self.layout.viewPort.once('blocks_loaded', function() {
                    Backbone.history.start({ pushState: false });
                    self.loader.sub();
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
                        self.loader.sub();
                    }

                });

                //Render layout
                jQuery('body').prepend(self.layout.render().el);
                self.layout.resize();

            });
        });
    });
};
