/**
 * Initialize builder toolbar
 *  
 * @version 0.0.1
 * @class  BuilderToolbar
 */
function BuilderToolbar() {
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
    jQuery('#builder-toolbar .logo .cube').css("transform", "rotateY(" + rot + "deg)");
};