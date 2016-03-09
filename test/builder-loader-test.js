var jQuery = "https://code.jquery.com/jquery-2.2.1.min.js";
var BuilderLoader = require('../js/builder-loader');

var assert = require('assert');

describe('BuilderLoader', function() {

    var builderLoader;

    before(function() {
        builderLoader = new BuilderLoader();
    });

    it('#add', function() {
        builderLoader.add();
        assert.equal(builderLoader.left, 1);
        builderLoader.add();
        assert.equal(builderLoader.left, 2);
        builderLoader.add(2);
        assert.equal(builderLoader.left, 4);
    });

    it('#sub', function() {
        builderLoader.sub(0);
        assert.equal(builderLoader.left, 3);
        builderLoader.sub(1);
        assert.equal(builderLoader.left, 2);
    });

    it('#show', function() {
        builderLoader.show();
        assert.equal(builderLoader.shown, true);
        builderLoader.show(2);
        assert.equal(builderLoader.shown, true);
    });

});
