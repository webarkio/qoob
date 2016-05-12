var _ = require("underscore");
var Backbone = require("backbone");

var BuilderLoader = require('../js/builder-loader');


var assert = require('assert');
var jsdom = require('jsdom');
var should = require('should');



describe('BuilderLoader', function() {

    var builderLoader;

    before(function() {
        builderLoader = new BuilderLoader();
    });

    it('#add', function() {
        builderLoader.addStep();
        assert.equal(builderLoader.left, 1);
        builderLoader.addStep();
        assert.equal(builderLoader.left, 2);
        builderLoader.addStep(2);
        assert.equal(builderLoader.left, 4);
    });

    it('#sub', function() {
        builderLoader.step(0);
        assert.equal(builderLoader.left, 3);
        builderLoader.step(1);
        assert.equal(builderLoader.left, 2);
    });

    it('#show', function() {
        builderLoader.show();
        assert.equal(builderLoader.shown, true);
        builderLoader.show(2);
        assert.equal(builderLoader.shown, true);
    });

    it('#hide', function() {
    require("jsdom").env("", function(err, window) {
        if (err) {
                console.error(err);
        return;
        }
        var jquery = require("jquery")(window);
        Backbone.$ = jquery;  
        builderLoader.hide();
        });

        assert.equal(builderLoader.hide.length, 1);
  
    });

    it('#showAutosave', function() {
        require("jsdom").env("", function(err, window) {
        if (err) {
                console.error(err);
        return;
        }
        var jquery = require("jquery")(window);
        Backbone.$ = jquery;
        builderLoader.showAutosave();
        });

        builderLoader.showAutosave.length.should.equal(0);

    });

    it('#hideAutosave', function() {
        require("jsdom").env("", function(err, window) {
        if (err) {
                console.error(err);
        return;
        }
        var jquery = require("jquery")(window);
        Backbone.$ = jquery;
        builderLoader.hideAutosave();
        });

        builderLoader.hideAutosave.length.should.equal(0);

    });

    it('#hideWaitBlock', function() {
        require("jsdom").env("", function(err, window) {
        if (err) {
                console.error(err);
        return;
        }
        var jquery = require("jquery")(window);
        Backbone.$ = jquery;
        builderLoader.hideWaitBlock();
        });
        
        assert.equal(builderLoader.hideWaitBlock.length, 0);
    });

});