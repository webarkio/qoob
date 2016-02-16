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
 * Get url iframe
 * 
 * @returns {String}
 */
BuilderIframe.prototype.getPageUrl = function () {
    return '/?page_id=' + jQuery('#post_ID').val() + '&qoob=true';
};

/**
 * Get iframe data
 * @returns {Object} data object and html
 */
BuilderIframe.prototype.getIframePageData = function () {
    var self = this;
    var iframe = jQuery('#builder-iframe').contents(),
            blocks = iframe.find('.content-block');

    var blocks_html = '';
    var blocks_data = [];

    blocks.each(function (i, v) {
        if (v) {
            var index = jQuery(v).index();
            blocks_html += jQuery(blocks[i]).find('.content-block-inner').html();

            var model = _.findWhere(self.builder.pageData, {id: jQuery(v).data('model-id')});
//            model.set({"position": index});
            blocks_data.push(JSON.parse(JSON.stringify(model)));
        }
    });

    var result = {
        'html': (blocks_html ? blocks_html : ''),
        'data': (blocks_data.length > 0 ? blocks_data : '')
    };

    return result;
};