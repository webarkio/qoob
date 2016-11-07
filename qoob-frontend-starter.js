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
    var loaderSrc = "qoob/qoob/loader.js";
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', loaderSrc);
    script.onload = function() {
        options.driver.loadLibrariesData(function(err, data) {
            window.loader = new Loader();
            window.loader.once('complete', function() {

                if (window.parent.frames['qoob-iframe']) {
                    $('#qoob-blocks').empty();
                    window.parent.jQuery('#qoob-iframe').trigger('libraries_loaded');
                    //call ready to build block event
                } else {}
                $.holdReady(false);
            });
            for (var i = 0; i < data.length; i++) {
                if (data[i].res) {
                    window.loader.add(data[i].res);
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
