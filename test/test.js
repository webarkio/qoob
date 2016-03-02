var assert = require('assert');
var loader = require('./assets/js/builder-loader');
console.log(loader);

describe('#create()', function () {
	it('should return create', function () {

		var builder = new Builder();
		assert.equal(builder.create(),'');


	});
});

