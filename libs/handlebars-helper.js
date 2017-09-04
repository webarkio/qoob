'use strict';

/**
 * Handlebars Utils 
 */
Handlebars.utils = {
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    random: function(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
}

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
Handlebars.registerHelper('each_with_sort', function(array, key, opts) {
    var s = '';
    array = array.sort(function(a, b) {
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
        array[i].first = (i == 0) ? true : false;
        array[i].last = (i == (array.length - 1)) ? true : false;
        s += opts.fn(array[i]);
    }
    return s;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Sorts some count arrays by a given key and makes one of the arrays
 * @function each_with_sort_arrays
 * @memberof Handlebars.helpers
 * @param {array} array - The data to sort.
 * @param {array} array2 - The data to sort.
 * @param {key} key - The key to sort by.
 * @returns {array}
 */
Handlebars.registerHelper('each_with_sort_arrays', function(key, opts) {
    var s = '';
    var arr = [];
    var tempArr = opts.hash;

    for (i in tempArr) {
        tempArr[i].sort(function(a, b) {
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

        arr.push.apply(arr, tempArr[i]);
    }

    for (var i = 0; i < arr.length; i++) {
        arr[i].order = i;
        s += opts.fn(arr[i]);
    }
    return s;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Each group by array with sorts
 * @function each_by_group_with_sort
 * @memberof Handlebars.helpers
 * @returns {array}
 */
Handlebars.registerHelper('each_by_group', function(opts) {
    var s = '',
        arr = [],
        tempArr = opts.hash.array,
        group = opts.hash.group;

    var arr = _.chain(tempArr)
        .groupBy(function(obj) {
            return obj[group];
        })
        .sortBy(function(v, k) {
            return k;
        })
        .value();

    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = {
            group: arr[i],
            index: i,
            type_name: arr[i][0]['type_name'],
            last: arr.length - 1
        };
        s += opts.fn(result[i]);
    }
    return s;

});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Sorts some count arrays by a given key and makes one of the arrays
 * @function each_with_sort_arr
 * @memberof Handlebars.helpers
 * @param {key} key - The key to sort by.
 * @param {array} opts - The data to sort.
 * @returns {array}
 */
Handlebars.registerHelper('each_with_sort_arr', function(key, opts) {
    var s = '';
    var arr = [];
    var tempArr = opts.hash;

    for (i in tempArr) {
        tempArr[i].sort(function(a, b) {
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
        arr.push(tempArr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
        arr[i].order = i;
        s += opts.fn(arr[i]);
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
Handlebars.registerHelper('ifIsNthItem', function(options) {
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
Handlebars.registerHelper("splitString", function(context, options) {
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
Handlebars.registerHelper("videoUrl", function(url, full) {
    if (url) {
        var url_split = url.split(/[/]/);
        var id_video = url.substr(url.indexOf('=') + 1, url.length);

        var type_video = "";
        if (url_split[2] == 'youtu.be') {
            type_video = "//www.youtube.com/embed/" + url_split[url_split.length - 1];

            if (full) {
                type_video = type_video + "?controls=0&disablekb=1&fs=0&showinfo=0&vq=hd1080&wmode=opaque";
            } else {
                type_video = type_video + "?controls=1&disablekb=1&fs=0&showinfo=0&vq=hd1080&wmode=opaque";
            }
        } else if (url_split[2] == 'www.youtube.com') {
            type_video = "//www.youtube.com/embed/" + id_video;

            if (full) {
                type_video = type_video + "?controls=0&disablekb=1&fs=0&showinfo=0&vq=hd1080&wmode=opaque";
            } else {
                type_video = type_video + "?controls=1&disablekb=1&fs=0&showinfo=0&vq=hd1080&wmode=opaque";
            }
        } else {
            type_video = "//player.vimeo.com/video/" + url_split[url_split.length - 1];
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
    for (var i = 0; i < n; ++i)
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
Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case "!=":
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
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

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Sorts array by a given key and return every count
 * @function everyNth
 * @memberof Handlebars.helpers
 * @param {array} context - The data to sort.
 * @param {key} every - The key to sort by.
 * @returns {array}
 */
Handlebars.registerHelper('everyNth', function(context, every, options) {

    if (options.hash.sort == 'sort') {
        var key = options.hash.key;
        context = context.sort(function(a, b) {
            var x = a[key],
                y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    var fn = options.fn,
        inverse = options.inverse;
    var ret = "";
    if (context && context.length > 0) {
        var counter = 0;
        for (var i = 0, j = context.length; i < j; i++) {
            var modZero = i % every === 0;
            ret = ret + fn(_.extend({}, context[i], {
                isModZero: modZero,
                isModZeroNotFirst: modZero && i > 0,
                isLast: i === context.length - 1,
                itteration: counter
            }));
            if (modZero) {
                counter++;
            }
        }
    } else {
        ret = inverse(this);
    }

    return ret;
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Return global variable by name
 * @function everyNth
 * @memberof Handlebars.helpers
 * @param {array} context - The data to sort.
 * @param {key} every - The key to sort by.
 * @returns {array}
 */
Handlebars.registerHelper('globalVar', function(varName) {
    return window.qoob_backend_custom[varName];
});

/**
 * Handlebars helpers.
 * @namespace Handlebars.helpers
 * Return index
 * @function math
 * @memberof Handlebars.helpers
 * @param {string} lvalue - The data to sort.
 * @param {string} rvalue - The key to sort by.
 * @returns {float}
 */
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

/**
 * Return the magnitude of `a`.
 *
 * @param {Number} `a`
 * @return {Number}
 * @api public
 */
Handlebars.registerHelper('abs', function(num) {
  if (!Handlebars.utils.isNumber(num)) {
    throw new TypeError('expected a number');
  }
  return Math.abs(num);
});

/**
 * Return the sum of `a` plus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @api public
 */
Handlebars.registerHelper('add', function(a, b) {
  if (Handlebars.utils.isNumber(a) && Handlebars.utils.isNumber(b)) {
    return Number(a) + Number(b);
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  }
  return '';
});

/**
 * Returns the average of all numbers in the given array.
 *
 * ```handlebars
 * {{avg "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '3' -->
 * ```
 *
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('avg', function() {
  var args = [].concat.apply([], arguments);

  // remove handlebars options object
  args.pop();

  args = args[0].replace(/[\[\]']+/g, '');
  
  var args = args.split(",");

  var len = args.length;
  var sum = 0;

  while (len--) {
    if (Handlebars.utils.isNumber(args[len])) {
      sum += Number(args[len]);
    }
  }

  return sum / args.length;
});

/**
 * Get the `Math.ceil()` of the given value.
 *
 * @param {Number} `value`
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('ceil', function(num) {
  if (!Handlebars.utils.isNumber(num)) {
    throw new TypeError('expected a number');
  }
  return Math.ceil(num);
});

/**
 * Divide `a` by `b`
 *
 * @param {Number} `a` numerator
 * @param {Number} `b` denominator
 * @api public
 */

Handlebars.registerHelper('divide', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) / Number(b);
});

/**
 * Get the `Math.floor()` of the given value.
 *
 * @param {Number} `value`
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('floor', function(num) {
  if (!Handlebars.utils.isNumber(num)) {
    throw new TypeError('expected a number');
  }
  return Math.floor(num);
});

/**
 * Return the difference of `a` minus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @alias subtract
 * @api public
 */

Handlebars.registerHelper('minus', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) - Number(b);
});

/**
 * Get the remainder of a division operation.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('modulo', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) % Number(b);
});

/**
 * Return the product of `a` times `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @return {Number}
 * @alias times
 * @api public
 */

Handlebars.registerHelper('multiply', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) * Number(b);
});

/**
 * Add `a` by `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @api public
 */

Handlebars.registerHelper('plus', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) + Number(b);
});

/**
 * Generate a random number between two values
 *
 * @param {Number} `min`
 * @param {Number} `max`
 * @return {String}
 * @api public
 */

Handlebars.registerHelper('random', function(min, max) {
  if (!Handlebars.utils.isNumber(min)) {
    throw new TypeError('expected minimum to be a number');
  }
  if (!Handlebars.utils.isNumber(max)) {
    throw new TypeError('expected maximum to be a number');
  }
  return Handlebars.utils.random(min, max);
});

/**
 * Get the remainder when `a` is divided by `b`.
 *
 * @param {Number} `a` a
 * @param {Number} `b` b
 * @api public
 */

Handlebars.registerHelper('remainder', function(a, b) {
  return a % b;
});

/**
 * Round the given number.
 *
 * @param {Number} `number`
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('round', function(num) {
  if (!Handlebars.utils.isNumber(num)) {
    throw new TypeError('expected a number');
  }
  return Math.round(num);
});

/**
 * Return the product of `a` minus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @alias minus
 * @api public
 */

Handlebars.registerHelper('subtract', function(a, b) {
  if (!Handlebars.utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number');
  }
  if (!Handlebars.utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number');
  }
  return Number(a) - Number(b);
});

/**
 * Returns the sum of all numbers in the given array.
 *
 * ```handlebars
 * {{sum "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '15' -->
 * ```
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */

Handlebars.registerHelper('sum', function() {
  var args = [].concat.apply([], arguments);

  // remove handlebars options object
  args.pop();

  args = args[0];

  var len = args.length;
  var sum = 0;

  while (len--) {
    if (Handlebars.utils.isNumber(args[len])) {
      sum += Number(args[len]);
    }
  }
  return sum;
});