/*global jQuery*/
'use strict';

/**
 * The Qoob starter class 
 * Load all JS and CSS files
 *  
 * @version 0.0.1
 * @class  QoobStarter
 */
jQuery.holdReady(true);

function QoobStarter(options) {
    var self = this;

    if (!(options.driver instanceof Object)) {
        throw new Error('Driver parameter mast be set!');
    }

    this.options = options;
    this.options.qoobUrl = this.options.qoobUrl || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/qoob/qoob/";
    this.options.qoobUrl = this.options.qoobUrl + (this.options.qoobUrl.indexOf("/", this.options.qoobUrl.length - "/".length) !== -1 ? '' : '/');

    var loaderSrc = this.options.qoobUrl + "loader.js";
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', loaderSrc);
    script.onload = function() {
        options.driver.loadLibrariesData(function(err, libs) {
            window.loader = new Loader();
            window.loader.once('complete', function() {

                if (window.parent.frames['qoob-iframe']) {
                    jQuery('#qoob-blocks').empty();
                    window.parent.jQuery('#qoob-iframe').trigger('libraries_loaded');
                    //call ready to build block event
                } else {}
                jQuery.holdReady(false);
            });
            for (var i in libs) {

                var libUrl = libs[i].url.replace(/\/+$/g, '') + "/"; //Trim slashes in the end and add /

                if (libs[i].res) {
                    var res = libs[i].res;
                    for (var j = 0; j < res.length; j++) {
                        if (res[j].backend && res[j].backend == true) {
                            if (res[j].src.indexOf("http://") !== 0 && res[j].src.indexOf("https://") !== 0) {
                                res[j].src = libUrl + res[j].src.replace(/^\/+/g, ''); //Trim slashes in the begining
                            }

                            window.loader.add(res[j]);
                        }
                    }
                }
            }
            window.loader.start();
        });

    };
    script.onerror = function() {
        console.log("Can't load loader.js file");
    };
    document.head.appendChild(script);

}
