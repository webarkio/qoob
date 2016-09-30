QUnit.module("QoobLoader");
var qoobLoader = new QoobLoader();

//init
QUnit.test("addStep", function(assert) {
    var done = assert.async();
    qoobLoader.addStep();
    assert.equal(qoobLoader.left, 1);
    qoobLoader.addStep();
    assert.equal(qoobLoader.left, 2);
    qoobLoader.addStep(2);
    assert.equal(qoobLoader.left, 4);
    done();
});
//progressBarAnimate

QUnit.test("step", function(assert) {
    var done = assert.async();
    qoobLoader.step();
    _.delay(function() {
            assert.equal(qoobLoader.left, 3);
            done();
        },
    500);
});

QUnit.test("show", function(assert) {
    var done = assert.async();
    qoobLoader.show();
    assert.equal(qoobLoader.shown, true);
    qoobLoader.show(2);
    assert.equal(qoobLoader.shown, true);
    done();
});

QUnit.test("hide", function(assert) {
    qoobLoader.hide(3);
    assert.equal(qoobLoader.shown, false);
});

