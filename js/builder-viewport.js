/**
 * Class responsible for visual display Builder
 * 
 * @version 0.0.1
 * @class  BuilderViewPort 
 * @param {Object} builder
 */
function BuilderViewPort(builder) {
    this.builder = builder;
}

/**
 * @callback createBlockCallback
 * @param {Object} view block.
 */

/**
 * Create view block
 * 
 * @param {Object} model
 * @param {String} template html block
 * @param {createBlockCallback} cb - A callback to run.
 */
BuilderViewPort.prototype.createBlock = function (model, template, cb) {
    var block = new BlockView({
        model: model
    });

    block.template = Handlebars.compile(template);
    cb(null, block);
};

/**
 * Devices settings
 * @returns object field devices
 */
BuilderViewPort.prototype.devicesSettings = function () {
    return {
        "name": "devices",
        "label": "Visibile Devices",
        "type": "devices",
        "settings": [{
                "name": "desktop",
                "label": "Desktop"
            }, {
                "name": "tablet",
                "label": "Tablet"
            }, {
                "name": "mobile",
                "label": "Mobile"
            }],
        "default": ""
    }
};

/**
 * @callback createSettingsCallback
 * @param {Object} DOMElement
 */

/**
 * Create settings view
 * 
 * @param {Object} model
 * @param {createSettingsCallback} cb - A callback to run.
 */
BuilderViewPort.prototype.createSettings = function (model, cb) {
    self = this;
    this.builder.getSettings(model.get('template'), function (err, config) {
        var settingsBlock = new SettingsView({
            model: model,
            className: 'settings-block settings-scroll'
        });

        // Add devices field
        config.push(self.devicesSettings());

        settingsBlock.config = config;

        var container = jQuery('<div class="settings menu-block" id="settings-block-' + model.id + '"><div class="backward"><a href="#" onclick="builder.menu.showGroups();return false;">Back</a></div></div>');
        container.append(settingsBlock.render().el);
        cb(null, container);
    });
};

/**
 * Add block
 * 
 * @param {Object} block
 * @param {integer} afterBlockId
 */
BuilderViewPort.prototype.addBlock = function (block, afterBlockId) {
    var self = this;
    var iframe = this.builder.iframe.getIframeContents();

//    var isFlipped = '';
//    if (jQuery('#card').hasClass('flipped')) {
//        isFlipped = 'hidden-button';
//    }

    var controlButtons = '<div class="control-block-button">' +
            '<a onclick="parent.builder.editBlock(' + block.model.id + '); return false;" class="edit" href="#"></a>' +
            '<a onclick="parent.builder.viewPort.removeBlock(' + block.model.id + '); return false;"  class="remove" href="#"></a>' +
            '</div>';
    var droppable = '<div id="droppable-' + block.model.id + '" class="droppable">' +
            '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
            '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
            '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';

    var fullBlock = [jQuery(controlButtons), block.render().el, jQuery(droppable)];

    if (afterBlockId && afterBlockId > 0) {
        for (var i = 0; i < self.builder.pageData.length; i++) {
            if (self.builder.pageData[i].id == afterBlockId) {
                self.builder.pageData.splice(i + 1, 0, block.model);
                break;
            }
        }

        //Add controll buttons
        iframe.find('.content-block[data-model-id="' + afterBlockId + '"]').after('<div class="content-block content-fade" data-model-id="' + block.model.id + '"></div>');
        iframe.find('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);
    } else {
        self.builder.pageData.push(block.model);
//            jQuery("#builder-viewport").append(fullBlock);

        if (afterBlockId == 0) {
            iframe.find('#builder-blocks').prepend('<div class="content-block content-fade" data-model-id="' + block.model.id + '"></div>');
            iframe.find('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);
        } else {
            iframe.find('#builder-blocks').append('<div class="content-block" data-model-id="' + block.model.id + '"></div>');
            iframe.find('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);
        }
    }

    // create droppable event
    this.droppable(block.model.id);
    
    // default visible block
    if (block.model.get('devices')) {
        builder.iframe.visibilityBlocks(block.model.id, block.model.get('devices').split(','));
    }

    // setting block height
    this.builder.menu.resize();

    // Trigger change
    this.triggerBuilderBlock();

    // when added block hide loader
    this.builder.loader.hideWaitBlock();
};

/**
 * Create event change for iframe
 * @returns {Event} change
 */
BuilderViewPort.prototype.triggerBuilderBlock = function () {
    // Trigger change builder blocks for theme
    var iframe = builder.iframe.getIframeContents();
    var elem = iframe.find('#builder-blocks');
    var ev = builder.iframe.getIframe()[0].contentWindow.document.createEvent('UIEvents');
    ev.initUIEvent('change', true, true, window, 1);
    elem[0].dispatchEvent(ev);
};

/**
 * Remove block by id
 * 
 * @param {Integer} blockId
 */
BuilderViewPort.prototype.removeBlock = function (blockId) {
    var alert = confirm("Are you sure you want to delete the block?");
    if (!alert) {
        return false;
    }

    var self = this;
    var iframe = this.builder.iframe.getIframeContents();

    // remove DOM on iframe
    iframe.find('div[data-model-id="' + blockId + '"]').remove();

    // remove model
    for (var i = 0; i < self.builder.pageData.length; i++) {
        if (self.builder.pageData[i].id == blockId) {
            self.builder.pageData.splice(i, 1);
            break;
        }
    }

    // if settings is open
    if (jQuery('#settings-block-' + blockId).css('display') != 'none') {
        // logo rotation
        this.builder.toolbar.logoRotation(-90);
        //menu rotation
        this.builder.menu.menuRotation(90);
    }

    // remove DOM
    jQuery('#settings-block-' + blockId).remove();
};

/**
 * Create droppable event by id
 * 
 * @param {integer} blockId
 */
BuilderViewPort.prototype.droppable = function (blockId) {
    var self = this;
    var iframe = this.builder.iframe.getIframeContents();

    iframe.find('#droppable-' + blockId).droppable({
        activeClass: "ui-droppable-active",
        hoverClass: "ui-droppable-hover",
        tolerance: "pointer",
        drop: function (event, ui) {
            var dropElement = jQuery(this);
            //get template id
//            console.log("Add");

            jQuery(event.target).addClass('active-wait');

            var templateId = ui.draggable.attr("id").replace("preview-block-", "");
            self.builder.getTemplate(templateId, function (err, template) {
                self.builder.getDefaultSettings(templateId, function (err, settings) {
                    var model = self.builder.createModel(settings);
                    self.createBlock(model, template, function (err, block) {
                        self.createSettings(block.model, function (err, container) {
                            jQuery('#builder-menu .blocks-settings').append(container);
                            var afterBlockId = dropElement.attr("id").replace("droppable-", "");
                            self.addBlock(block, afterBlockId);
                        });
                    });
                });
            });
        }
    });
};

/**
 * Create default droppable in iframe
 */
BuilderViewPort.prototype.createDefaultDroppable = function () {
    var iframe = this.builder.iframe.getIframeContents();
    var droppable = '<div id="droppable-0" class="droppable">' +
            '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
            '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
            '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
    iframe.find('#builder-blocks').before(jQuery(droppable));
    this.droppable('0');
}

/**
 * Create blocks
 * 
 * @param {Array} data
 */
BuilderViewPort.prototype.create = function (data) {
    var self = this;

    self.createDefaultDroppable();
    if (data) {
        function loop(i) {
            if (i < data.length) {
//                console.log('DONE');
//            } else {
                this.builder.getTemplate(data[i].template, function (err, template) {
                    var model = self.builder.createModel(data[i]);
                    self.createBlock(model, template, function (err, block) {
                        self.createSettings(block.model, function (err, container) {
                            jQuery('#builder-menu .blocks-settings').append(container);
                            self.addBlock(block);
                            self.builder.loader.sub();
                            loop(i + 1);
                        });
                    });
                });
            }
        }

        // Start create
        loop(0);
    }
};

/**
 * Resize builder content
 */
BuilderViewPort.prototype.resize = function () {
    var hideBuilder = {
        'height': (jQuery('.hide-builder').hasClass('active') ? 0 : 70),
        'width': (jQuery('.hide-builder').hasClass('active') ? 0 : 258)
    };

    jQuery('#builder-content').stop().animate({
        height: jQuery(window).height() - hideBuilder.height,
        top: hideBuilder.height,
        width: jQuery(window).width() - hideBuilder.width,
        left: hideBuilder.width
    });
};