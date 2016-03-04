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

});
