'use strict';

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Sorts array by a given key
 * @function each_with_sort
 * @memberof Handlebars.helpers
 * @param {array} array - The data to sort.
 * @param {key} key - The key to sort by.
 * @returns {array}
 */
Handlebars.registerHelper('each_with_sort', function (array, key, opts) {
    var s = '';
    array = array.sort(function (a, b) {
        a = a[key];
        b = b[key];
        if (a > b) {
            return 1;
        }
        if (a === b) {
            return 0;
        }
        if (a < b) {
            return -1;
        }
    });

    for (var i = 0; i < array.length; i++) {
        array[i].index = i;
        s += opts.fn(array[i]);
    }
    return s;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * each with index and modulo
 * @param {object} options
 * @function ifIsNthItem
 * @memberof Handlebars.helpers
 * @returns {unresolved}
 */
Handlebars.registerHelper('ifIsNthItem', function (options) {
    var index = this.index + 1,
            nth = options.hash.nth;

    if (index % nth === 0) {
        return options.fn(this);
    }
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * @function splitString
 * @param {context} string
 * @param {object} options
 * @memberof Handlebars.helpers
 * @returns {Array}
 */
Handlebars.registerHelper("splitString", function (context, options) {
    if (context) {
        var ret = "";
        var tempArr = context.trim().split(options.hash["delimiter"]);
        for (var i = 0; i < tempArr.length; i++) {
            ret = ret + options.fn(tempArr[i]);
        }
        return ret;
    }
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * @function videoUrl
 * @param {url} string
 * @param {full} param full page
 * @memberof Handlebars.helpers
 * @returns {String}
 */
Handlebars.registerHelper("videoUrl", function (url, full) {    
    if (url) {
        var url_split = url.split(/[/]/);
        var id_video = url.substr(url.indexOf('=') + 1, url.length);
        
        var type_video = "";
        if (url_split[2] == 'youtu.be') {
            type_video = "//www.youtube.com/embed/" + url_split[url_split.length-1];

            if (full) {
                type_video = type_video + "?controls=0&disablekb=1&fs=0&showinfo=0&vq=hd1080";
            } else {
                type_video = type_video + "?controls=1&disablekb=1&fs=0&showinfo=0&vq=hd1080";
            }
        } else if (url_split[2] == 'www.youtube.com') {
            type_video = "//www.youtube.com/embed/" + id_video;

            if (full) {
                type_video = type_video + "?controls=0&disablekb=1&fs=0&showinfo=0&vq=hd1080";
            } else {
                type_video = type_video + "?controls=1&disablekb=1&fs=0&showinfo=0&vq=hd1080";
            }
        } else {
            type_video = "//player.vimeo.com/video/" + url_split[url_split.length-1];
            type_video = type_video + "?color=ffffff&title=0&portrait=0";
        }
        
        return type_video;
    }

    return url;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * @function for
 * @param {n} string
 * @param {object} options
 * @memberof Handlebars.helpers
 * @returns {Array}
 */
Handlebars.registerHelper('for', function(n, options) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += options.fn(i);
    return accum;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * If block helper ifCond
 * @param {string} v1
 * @param {string} operator
 * @param {string} v2
 * @param {object} options
 * @function ifCond
 * @memberof Handlebars.helpers
 * @returns {unresolved}
 */
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

