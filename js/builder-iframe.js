/**
 * The class for work with iframe
 *  
 * @version 0.0.1
 * @class  BuilderIframe
 * @param {Object}
 */
function BuilderIframe(builder) {
    this.builder = builder;
}

/**
 * Get iframe
 * @returns {DOMElement}
 */
BuilderIframe.prototype.getIframe = function () {
    return jQuery('#builder-iframe');
}

/**
 * Get iframe contents
 * @returns {DOMElement}
 */
BuilderIframe.prototype.getIframeContents = function () {
    return jQuery('#builder-iframe').contents();
}

/**
 * Get iframe documnet
 * @returns {DOMElement}
 */
BuilderIframe.prototype.getWindowIframe = function () {
    return window.frames["builder-iframe"];
}

/**
 * Resize iframe
 */
BuilderIframe.prototype.resize = function () {
    // Set size iframe
    var hideBuilder = (jQuery('.hide-builder').hasClass('active') ? 0 : 70);

    var height = jQuery(window).height() - hideBuilder,
            width;

    width = jQuery('#builder-viewport').hasClass('pc') ? '100%' : jQuery('#builder-iframe').width();

    jQuery('#builder-iframe').height(height).width(width);
};

/**
 * Get iframe data
 * @returns {Object} data object and html
 */
BuilderIframe.prototype.getIframePageData = function () {
    var self = this;
    var iframe = this.getIframeContents(),
            blocks = iframe.find('.content-block');

    var blocks_html = '',
            blocks_data = [],
            blocks_items = [];


    blocks.each(function (i, v) {
        if (v) {
//            var index = jQuery(v).index();
            blocks_html += jQuery(blocks[i]).find('.content-block-inner').html();

            var model = _.findWhere(self.builder.pageData, {id: jQuery(v).data('model-id')});
//            model.set({"position": index});
            blocks_items.push(model);

        }
    });

    // global settings
    var global_settings = iframe.find('#builder-blocks style');
    var model_global_settings = this.builder.builderSettingsData;
    
    blocks_data = {
        'global_settings': model_global_settings,
        'blocks': blocks_items
    };

    var result = {
        'html': (blocks_html ? blocks_html : ''),
        'data': (Object.keys(blocks_data).length > 0 ? JSON.parse(JSON.stringify(blocks_data)) : ''),
        'settings': global_settings.html()
    };

    return result;
};

/**
 * Change devices display
 */
BuilderIframe.prototype.visibilityBlocks = function (blockId, devices) {
    var iframe = this.getIframeContents();

    var block = iframe.find("[data-model-id='" + blockId + "']");

    block.removeClass(function (index, classes) {
        var regex = /^visible-/;
        return classes.split(/\s+/).filter(function (c) {
            return regex.test(c);
        }).join(' ');
    });

    for (var i = 0; i < devices.length; i++) {
        block.addClass('visible-' + devices[i]);
    }
};