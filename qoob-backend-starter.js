/*global jQuery*/
'use strict';

/**
 * The Qoob starter class 
 * Load all JS and CSS files
 *  
 * @version 0.0.1
 * @class  QoobStarter
 */

function QoobStarter(options) {

    if (!(options.driver instanceof Object)) {
        throw new Error('Driver parameter mast be set!');
    }

    this.options = options;
    this.options.qoobUrl = this.options.qoobUrl || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + (window.location.pathname.indexOf("/", window.location.pathname.length - "/".length) !== -1 ? '' : '/') + "qoob/qoob/";
    this.options.qoobUrl = this.options.qoobUrl + (this.options.qoobUrl.indexOf("/", this.options.qoobUrl.length - "/".length) !== -1 ? '' : '/');
    this.options.skins = this.options.skins || { 'black': this.options.qoobUrl + 'skins/black/skin.js' };
    this.options.debug = this.options.debug || false;
    this.options.mode = this.options.mode || "prod";
    this.options.skin = this.options.skin || "black";
    this.options.librariesData = this.options.librariesData || [];
    this.options.pageData = this.options.pageData || {};

    window.onload = this.startStage1.bind(this);
}

QoobStarter.prototype.startStage1 = function() {
    var self = this;
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', this.options.qoobUrl + "loader.js");
    script.onload = function() {

        if (self.options.debug)
            console.log("Staring Stage 1");

        self.attachLoaderHTML();

        self.loader = new Loader();
        self.options.loader = self.loader;

        self.loader.add([
            { "type": "js", "name": "jquery", "src": self.options.qoobUrl + "libs/jquery.min.js" },
            { "type": "js", "name": "underscore", "src": self.options.qoobUrl + "libs/underscore.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "backbone", "src": self.options.qoobUrl + "libs/backbone-min.js", "dep": ["jquery", "underscore"] },
            { "type": "js", "name": "handlebars", "src": self.options.qoobUrl + "libs/handlebars.min-latest.js" },
            { "type": "js", "name": "handlebars-helper", "src": self.options.qoobUrl + "libs/handlebars-helper.js", "dep": ["handlebars"] }
        ]);

        self.loader.once('complete', self.startStage2.bind(self));
        self.loader.start();
    };
    script.onerror = function() {
        console.log("Can't load loader.js file");
    };
    document.head.appendChild(script);

}

QoobStarter.prototype.startStage2 = function() {
    var self = this;
    if (this.options.debug)
        console.log("Staring Stage 2");

    this.options.driver.loadLibrariesData(function(err, libs) {

        if (self.options.debug) {
            console.log("Libs config loaded");
        }
        if (err) {
            console.error("Libraries have been not loaded from driver " + self.options.driver.constructor.name + "." + err);
            return;
        }
        if (typeof(libs) == 'undefined') {
            console.error("Libraries have been not loaded from driver " + self.options.driver.constructor.name + ". Check 'loadLibrariesData' method.");
            return;
        }

        self.loader.once('complete', function() {
            if (self.options.debug)
                console.log("Blocks configs loaded");

            self.options.librariesData = self.parseBlockData(libs);
            self.startStage3();

        });

        for (var i in libs) {
            if (libs[i].res) {
                var res = libs[i].res;
                for (var j = 0; j < res.length; j++) {
                    if (res[j].backend && res[j].backend == true) {
                        self.loader.add(res[j]);
                    }
                }
            }

            var blocks = libs[i].blocks;
            var libUrl = libs[i].url.replace(/\/+$/g, '') + "/"; //Trim slashes in the end and add /

            for (var j in blocks) {
                blocks[j].url = blocks[j].url.replace(/\/+$/g, '') + "/"; //Trim slashes in the end and add /

                if (blocks[j].url.indexOf("http://") !== 0 && blocks[j].url.indexOf("https://") !== 0) {
                    blocks[j].url = libUrl + blocks[j].url;
                }
                if (blocks[j].config_url) {
                    if (blocks[j].config_url.indexOf("http://") !== 0 && blocks[j].config_url.indexOf("https://") !== 0) {
                        blocks[j].config_url = libUrl + blocks[j].config_url.replace(/^\/+/g, ''); //Trim slashes in the begining
                    }
                } else {
                    blocks[j].config_url = blocks[j].url + "config.json";
                }

                self.loader.add({ "type": "json", "name": libs[i].name + "_" + blocks[j].name, "src": blocks[j].config_url });
            }
        }
    });
}



QoobStarter.prototype.startStage3 = function() {
    var self = this;
    if (this.options.debug)
        console.log("Staring Stage 3");
    self.options.driver.loadPageData(function(err, data) {
        if (self.options.debug)
            console.log("Page data loaded");

        self.options.pageData = data;

        self.startStage4();

    });
};


QoobStarter.prototype.startStage4 = function() {
    var self = this;
    if (this.options.debug) {
        console.log("Staring Stage 4");
        console.log("Staring loading skin " + this.options.skin);
    }

    self.loader.once('complete', function() {
        window.qoob = new Skin();

        self.loader.once('complete', function() {
            window.qoob.activate(self.options);
        });
        var skinPrefix = self.options.skins[self.options.skin].replace("skin.js", "");
        self.loader.add(window.qoob.assets[self.options.mode], { "prefix": skinPrefix });
        self.loader.add(window.qoob.assets["all"], { "prefix": skinPrefix });
    });

    self.loader.add({ "type": "js", "src": this.options.skins[this.options.skin], "name": "skin" });

}


QoobStarter.prototype.applyGlobalMask = function(libs) {
    for (var i in libs) {
        var currentLib = libs[i];
        for (var j in currentLib.blocks) {

            var configString = JSON.stringify(libs[i].blocks[j].config);

            configString = configString.replace(/%lib_url\(.*?\)%\/|%lib_url\(.*?\)%/g, function(substr) {
                var libName = substr.replace(/%lib_url\(|\)%\/|%lib_url\(|\)%/g, '').trim();
                if (findedLib = _.findWhere(libs, { name: libName.trim() })) {
                    return findedLib.url;
                }
            });

            configString = configString.replace(/%block_url\(.*?\)%\/|%block_url\(.*?\)%/g, function(substr) {
                var blockLib = substr.replace(/%block_url\(|\)%\/|%block_url\(|\)%/g, '');
                var splited = blockLib.split(',');
                var libName, blockName, findedLib, findedBlock;
                if (splited.length === 2) {
                    libName = splited[0];
                    blockName = splited[1];
                } else if (splited.length === 1) {

                    libName = currentLib.name;
                    blockName = splited[0];
                } else {
                    return substr;
                }
                if (findedLib = _.findWhere(libs, { name: libName.trim() })) {
                    if (findedBlock = _.findWhere(findedLib.blocks, { name: blockName })) {
                        return findedBlock.url;
                    } else {
                        console.log("Can't apply mask '" + substr + "' for block '" + currentLib.blocks[j].name + "' in lib '" + currentLib.name + "'. Block '" + blockName + "' not found in '" + libName + "'.");
                        return substr;
                    }
                }
            });
            currentLib.blocks[j] = _.extend(JSON.parse(configString), currentLib.blocks[j]);
        }
    }
    return libs;
}

QoobStarter.prototype.applySelfMask = function(config, libUrl, blockUrl) {

    var configString = JSON.stringify(config);

    configString = configString.replace(/%lib_url%\/|%lib_url%/g, function(substr) {
        return libUrl;
    });

    configString = configString.replace(/%block_url%\/|%block_url%/g, function(substr) {
        return blockUrl;
    });

    return JSON.parse(configString);
};


QoobStarter.prototype.parseBlockData = function(libs) {
    var result = [];
    for (var i in libs) {
        var lib = libs[i];
        for (var j in lib.blocks) {
            if (this.loader.loaded[lib.name + "_" + lib.blocks[j].name]) {
                lib.blocks[j].lib = lib.name;
                lib.blocks[j].config = this.applySelfMask(this.loader.loaded[lib.name + "_" + lib.blocks[j].name].data, lib.url, lib.blocks[j].url);
            } else {
                lib.blocks.splice(j, 1);
            }
        }
        result.push(lib);
    }
    return this.applyGlobalMask(result);
};

QoobStarter.prototype.getLoaderHTML = function() {
    return "<div id='loader-wrapper'><div class='loader-inner-wrapper'><div class='loading-panel'><div class='qoob-preview-img'></div><span class='sr-only'>Loading <span class='precent'>0</span>%</span><div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width:0%;'></div></div></div><div class='panel tip-panel'><span class='tip-header'>Did you know</span><div class='tip-content'></div></div></div></div>";
};

QoobStarter.prototype.attachLoaderHTML = function() {
    document.body.innerHTML = this.getLoaderHTML() + document.body.innerHTML;
};
