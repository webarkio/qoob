/*global jQuery*/
'use strict';

/**
 * The class responsible for the loader qoob
 *  
 * @version 0.0.1
 * @class  QoobLoader
 */

function QoobLoader(qoob) {
    this.qoob = qoob;
    this.left = 0;
    this.shown = false;
    this.$elem = jQuery('#loader-wrapper');
    this.precents = 0;
    this.tips = [
        "You can add block both by dragging preview picture or by clicking on it.",
        "You can view page in the preview mode by clicking the up-arrow in the up right corner of the screen.",
        "While you are in preview mode - you can't reach block editting.",
        "You can activate autosave of edited page by clicking 'Autosave' button in the toolbar in the top of your screen."
    ];
    this.init();
}

/**
 * Actions on preloading start.
 * Add random tip for users about qoob
 * 
 */
QoobLoader.prototype.init = function () {
    var rand = Math.random() * (this.tips.length),
            rand = rand.toFixed(),
            rand = parseInt(rand);

    this.$elem.find('.tip-content').text(this.tips[rand]);
};

/**
 * Add count steps
 * @param {Integer} count
 */
QoobLoader.prototype.addStep = function (count) {
    this.left = this.left + (count || 1);
    if (this.left > 0 && !this.shown) {
        this.show();
    }
};

/**
 * Animating preloader progressbar, depending on step
 * 
 */
QoobLoader.prototype.progressBarAnimate = function () {
    var loadingEl = this.$elem.find('.precent'),
            toPrecent = this.precents;
    
    loadingEl.text(toPrecent);
    this.$elem.find('.progress-bar').animate({width: toPrecent + '%'}, 500);
};

/**
 * Counter loading qoob
 * @param {Integer} count
 */
QoobLoader.prototype.step = function (count) {
    if (this.precents < 100) {
        this.precents += 25;
        this.progressBarAnimate();
    }
    this.left = this.left - (count || 1);
    if (this.left === 0 && this.shown) {
        this.hide();
    }
};

/**
 * Start loading
 * @param {Integer} count
 */
QoobLoader.prototype.show = function (count) {
    this.shown = true;
};

/**
 * Loading complete
 * @param {Integer} count
 */
QoobLoader.prototype.hide = function (count) {
    this.$elem.delay(350).fadeOut('slow');
    this.shown = false;
};

/**
 * Block added 
 */
QoobLoader.prototype.hideWaitBlock = function () {
    var iframe = this.qoob.qoobLayout.viewPort.getIframeContents();

    iframe.find('.droppable').removeClass('active-wait');
    // remove animation
    setTimeout(function () {
        iframe.find('.content-block').removeClass('content-fade');
    }, 1000);

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QoobLoader;
}