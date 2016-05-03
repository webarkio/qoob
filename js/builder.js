/**
 * Initialize page builder
 *
 * @version 0.0.1
 * @class  Builder
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Builder = Builder;
function Builder(options) {
    //Apply events to treggier
    _.extend(this, Backbone.Events);
    this.options = {
        blockTemplateAdapter: 'hbs',
        blockPreviewUrl: "preview.png"
    };
    _.extend(this.options, options);
    delete this.options.storage;
    this.storage = options.storage;
    this.loader = new BuilderLoader(this);
    this.pageModel = new PageModel();

    this.controller = new BuilderController();

    this.builderLayout = new BuilderLayout({
        "model": this.pageModel,
        "storage": this.storage,
        "controller": this.controller
    });

    this.controller.setLayout(this.builderLayout);

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
 * Out of the Builder
 */
Builder.prototype.exit = function() {
    var self = this;
    if (jQuery('.checkbox-sb input').prop("checked")) {
        this.builderLayout.viewPort.save(function(err, state) {
            self.storage.driver.exit(self.storage.pageId);
        });
    } else {
        this.storage.driver.exit(this.storage.pageId);
    }
};

/**
 * Autosave page data for interval
 */
Builder.prototype.autosavePageData = function() {
    var self = this;
    if (jQuery('.checkbox-sb input').prop("checked")) {
        var intervalId = setInterval(function() {
            if (!jQuery('.checkbox-sb input').prop("checked")) {
                clearInterval(intervalId);
            } else {
                self.builderLayout.viewPort.save();
            }
        }, 60000);
    }
};


Builder.prototype.addNewBlock = function(templateId, afterId) {
    var values = this.builderLayout.viewPort.getDefaultSettings(templateId, afterId);
    this.addBlock(values, afterId);
};

Builder.prototype.addBlock = function(values, afterId) {
    var model = BuilderUtils.createModel(values);
    this.pageModel.addBlock(model, afterId);
};

/**
 * Activate page builder
 */
Builder.prototype.activate = function() {
	console.log(1);
    var self = this;
    this.loader.add(1);
    //Creating and appending builder layout
    jQuery(window).resize(function() {
        self.builderLayout.resize()
    });
console.log(2);
    this.storage.loadBuilderTemplates(function(err, builderTemplates) {
    	console.log(3);
        self.storage.loadBuilderData(function(err, builderData) {
        	console.log(4);
            self.storage.loadPageData(function(err, pageData) {
                console.log("render");
                self.builderLayout.render();
                jQuery('body').prepend(self.builderLayout.el);
                self.builderLayout.resize();
                

                self.builderLayout.viewPort.onLoad(function() {
                	console.log("viewportloaded");
                	self.loader.sub();
                	return;
                    //                    if (pageData.length > 0) {
                    //                        self.loader.add(pageData.length);
                    //                    }

                    // Create groups/previews
                    self.builderLayout.menu.create();

                    // Create default droppable zone
                    self.builderLayout.viewPort.createDefaultDroppable();

                    self.pageModel.load();

                    // Autosave
                    self.autosavePageData();

                    // self.builderLayout.viewPort.create(pageData);

                    self.loader.sub();

                });
            });
        });
    });
};
