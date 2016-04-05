/**
 * Initialize builder toolbar
 *  
 * @version 0.0.1
 * @class  BuilderToolbar
 */
function BuilderToolbar() {
    this.sideClassName = '';
}

/**
 * Resize toolbar
 */
BuilderToolbar.prototype.resize = function () {
    jQuery('#builder-toolbar').css({width: jQuery(window).width()});
};

/**
 * Show toolbar
 */
BuilderToolbar.prototype.show = function () {
    jQuery('#builder-toolbar').show();
};

/**
 * Hide toolbar
 */
BuilderToolbar.prototype.hide = function () {
    jQuery('#builder-toolbar').hide();
};

/**
 * If visible toolbar
 */
BuilderToolbar.prototype.isVisible = function () {
    return jQuery('#builder-toolbar').is(":visible");
};

/**
 * Logo rotation
 * @param {Integer} rot
 */
BuilderToolbar.prototype.logoRotation = function (rot) {
    if (this.sideClassName != '') {
        jQuery('#builder-toolbar .logo .text').removeClass(this.sideClassName);
    }

    if (rot == '-90') {
        this.sideClassName = 'step-one';
    } else if (rot == '-180') {
        this.sideClassName = 'step-two';
    } else if (rot == '-270') {
        this.sideClassName = 'step-three';
    } else if (rot == '0' || rot == '-360') {
        this.sideClassName = 'step-four';
    }

    jQuery('#builder-toolbar .logo .text').addClass(this.sideClassName);
    jQuery('#builder-toolbar .logo .cube').css("transform", "rotateY(" + rot + "deg)");
};

/**
 * Buttons screen size
 */
BuilderToolbar.prototype.screenSize = function (elem) {
    jQuery('.screen-size').removeClass('active');
    jQuery(elem).addClass('active');

    var classes = jQuery(elem).attr('class').split(' '),
            current = classes[1],
            size = {};

    switch (current) {
        case 'pc':
            size = {'width': '100%'};
            break;
        case 'tablet-vertical':
            size = {'width': '768px'};
            break;
        case 'phone-vertical':
            size = {'width': '375px'};
            break;
        case 'tablet-horizontal':
            size = {'width': '1024px'};
            break;
        case 'phone-horizontal':
            size = {'width': '667px'};
            break;
    }

    jQuery('#builder-viewport iframe').stop().animate({
        width: size.width
    });

    var class_remove = jQuery('#builder-viewport').attr('class');
    jQuery('#builder-viewport').removeClass(class_remove).addClass(current);
}

/**
 * Button hide all builder
 */
BuilderToolbar.prototype.hideBuilder = function (elem) {

    var iframe = builder.iframe.getIframeContents();

    if (jQuery(elem).hasClass('active')) {
        jQuery('#builder-toolbar').fadeIn(300);
        jQuery('#builder-menu').fadeIn(300);
        iframe.find('.control-block-button').fadeIn(300);

        jQuery('#builder-toolbar').find('.hide-builder').removeClass('active');
        jQuery(elem).remove();

        builder.viewPort.resize();
        builder.iframe.resize();
    } else {
        jQuery(elem).addClass('active');
        jQuery('#builder-toolbar').fadeOut(300, function () {
            builder.viewPort.resize();
            builder.iframe.resize();
            var width = (jQuery('#builder-iframe').width() - jQuery('#builder-iframe').contents().width());
            
            jQuery('#builder').prepend('<button class="arrow-btn hide-builder active" type="button" onclick="parent.builder.toolbar.hideBuilder(this); return false;" style="display:none; right: ' + width + 'px"></button>');
            jQuery('#builder>.hide-builder').fadeIn(300);
        });
        jQuery('#builder-menu').fadeOut(300);
        iframe.find('.control-block-button').fadeOut(300);
    }

}