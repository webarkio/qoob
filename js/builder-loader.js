/*global jQuery*/
'use strict';

/**
 * The class responsible for the loader builder
 *  
 * @version 0.0.1
 * @class  BuilderLoader
 */

function BuilderLoader(builder) {
    this.builder = builder;
    this.left = 0;
    this.shown = false;
}

/**
 * Add count steps
 * @param {Integer} count
 */
BuilderLoader.prototype.add = function (count) {
    this.left = this.left + (count || 1);
    if (this.left > 0 && !this.shown) {
        this.show();
    }
};

/**
 * Counter loading builder
 * @param {Integer} count
 */
BuilderLoader.prototype.sub = function (count) {
    this.left = this.left - (count || 1);
    if (this.left === 0 && this.shown) {
        this.hide();
    }
};

/**
 * Start loading
 * @param {Integer} count
 */
BuilderLoader.prototype.show = function (count) {
    this.shown = true;
};

/**
 * Loading complete
 * @param {Integer} count
 */
BuilderLoader.prototype.hide = function (count) {
    jQuery('#loader-wrapper').delay(350).fadeOut('slow');
    this.shown = false;
};

/**
 * Show loader autosave
 */
BuilderLoader.prototype.showAutosave = function () {
    jQuery('.save span').hide();
    jQuery('.save .clock').show();
};

/**
 * Hide loader autosave
 */
BuilderLoader.prototype.hideAutosave = function () {
    jQuery('.save .clock').hide();
    jQuery('.save span').show();
};

/**
 * Block added 
 */
BuilderLoader.prototype.hideWaitBlock = function () {
    var iframe = this.builder.viewPort.getIframeContents();
    
    iframe.find('.droppable').removeClass('active-wait');
    // remove animation
    setTimeout(function () {
        iframe.find('.content-block').removeClass('content-fade');
    }, 1000);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuilderLoader;
}