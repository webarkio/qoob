function Loader() {
    this.isStarted = false;
    this.events = {};
    this.queue = {};
    this.loading = {};
    this.loaded = {};
    this.failed = {};

}

Loader.prototype.isExists = function(name) {
    if ((name in this.queue) || (name in this.loading) || (name in this.loaded)) {
        return true;
    }
    return false;
};

Loader.prototype.getCountQueue = function() {
    return Object.keys(this.queue).length;
};

Loader.prototype.getCountLoading = function() {
    return Object.keys(this.loading).length;
};

Loader.prototype.getCountLoaded = function() {
    return Object.keys(this.loaded).length;
};

Loader.prototype.getCountFailed = function() {
    return Object.keys(this.failed).length;
};

Loader.prototype.isDependencyLoaded = function(dep) {
    if (dep) {
        if (dep.length) {
            for (var i = 0; i < dep.length; i++) {
                if (!(dep[i] in this.loaded)) {
                    return false;
                }
            }
        } else {
            if (!(dep in this.loaded)) {
                return false;
            }
        }
    }
    return true;
};

Loader.prototype.add = function(obj, opt) {
    var self = this;

    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            this.add(obj[i], opt);
        }
    } else {
        var options = opt || {};
        if (!this.isExists(obj.name)) {
            if (options.prefix) {
                obj.src = options.prefix + obj.src;
            }
            this.queue[obj.name] = obj;
            this.emmit('added', [obj]);
            this.progress();
            if (this.isStarted) {
                this.loadNext();
            }
        } else {
            if (obj.onloaded) {
                if (obj.name in this.loaded) {
                    obj.onloaded(this.loaded[obj.name].data);
                } else {
                    this.on('loaded', function(objLoaded) {
                        if (objLoaded.name === obj.name) {
                            obj.onloaded(self.loaded[obj.name].data);
                        }
                    });
                }
            }
        }
    }
};

Loader.prototype.removeListener = Loader.prototype.off = function(event, listener) {
    for (var i = 0; i < this.events[event].length; i++) {
        if (this.events[event][i].listener == listener) {
            this.events[event].splice(i, 1);
            return;
        }
    }
};


Loader.prototype.on = function(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push({ listener: callback, once: false });
};

Loader.prototype.once = function(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push({ listener: callback, once: true });
};

Loader.prototype.emmit = Loader.prototype.trigger = function(event, args) {

    if (this.events[event] && this.events[event].length > 0) {
        var listeners = this.events[event];
        var newListeners = [];
        var executeListeners = [];

        for (var i = 0; i < listeners.length; i++) {
            executeListeners.push(listeners[i].listener);

            if (!listeners[i].once) {
                newListeners.push(listeners[i]);
            }
        }

        this.events[event] = newListeners;

        for (i = 0; i < executeListeners.length; i++) {
            executeListeners[i].apply(executeListeners[i], args);
        }
    }
};

Loader.prototype.start = function() {
    this.isStarted = true;
    this.emmit('start', [this.queue]);
    this.progress();
    this.loadNext();
};

Loader.prototype.stop = function() {
    this.isStarted = false;
    this.emmit('stop', []);
};

Loader.prototype.loadNext = function() {
    for (var obj in this.queue) {
        if (this.isDependencyLoaded(this.queue[obj].dep)) {
            this.startLoading(obj);
        }
    }
};

Loader.prototype._onLoaded = function(name) {
    var obj = this.loading[name];
    this.loaded[obj.name] = obj;
    delete this.loading[name];
    this.emmit('loaded', [obj]);
    this.progress();
};

Loader.prototype._onLoadFail = function(name) {
    var obj = this.loading[name];
    this.failed[obj.name] = obj;
    delete this.loading[name];
    this.emmit('failed', [obj]);
    this.progress();

};

Loader.prototype.progress = function() {
    this.emmit('progress', [this.getCountQueue(), this.getCountLoading(), this.getCountLoaded(), this.getCountFailed()]);
    if (this.getCountQueue() + this.getCountLoading() === 0) {
        //        this.stop();
        this.emmit('complete', [this.loaded, this.failed]);
    } else {
        if (this.isStarted) {
            this.loadNext();
        }
    }
};

Loader.prototype.startLoading = function(name) {
    var obj = this.queue[name];
    this.loading[name] = obj;
    delete this.queue[name];
    var self = this;

    this.emmit('loading', [obj]);
    if (obj.type == "js") {
        this.loadJS(obj.src, function() { self._onLoaded(obj.name); }, function() { self._onLoadFail(obj.name); });
    }
    if (obj.type == "json") {
        this.loadJSON(obj.src,
            function(json) {
                obj.data = json;
                if (obj.onloaded instanceof Function) {
                    obj.onloaded(json);
                }
                self._onLoaded(obj.name);
            },
            function() {
                self._onLoadFail(obj.name);
            });
    }
    if (obj.type == "css") {
        this.loadCSS(obj.src, function() { self._onLoaded(obj.name); }, function() { self._onLoadFail(obj.name); });
    }
    if (obj.type == "data") {
        this.loadData(obj.src,
            function(data) {
                obj.data = data;
                if (obj.onloaded instanceof Function) {
                    obj.onloaded(data);
                }
                self._onLoaded(obj.name);
            },
            function() {
                self._onLoadFail(obj.name);
            });
    }

};

Loader.prototype.loadData = function(src, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(xhr.responseText);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", src, true);
    xhr.send();
};

Loader.prototype.loadJSON = function(src, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error) {
                    error(xhr);
                }
            }
        }
    };
    xhr.open("GET", src, true);
    xhr.send();
};

Loader.prototype.loadJS = function(src, success, error) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src);
    script.onload = success;
    script.onerror = error;
    document.head.appendChild(script);
};

Loader.prototype.loadCSS = function(src, success, error) {
    var style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', src);
    style.onload = success;
    style.onerror = error;
    document.head.appendChild(style);
};

if ('undefined' !== typeof module) {
    module.exports = Loader;
}