/*global QoobController, QoobStorage, PageModel, QoobLayout*/
QUnit.module("QoobController");

//============START TEST===============
QUnit.test("index", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            showIndex: function() {
                assert.ok(true, 'showIndex Ok');
            }
        },
        toolbar: {
            logoRotation: function() {
                assert.ok(true, 'logoRotation Ok');
            }
        },
        stopEditBlock: function() {
            assert.ok(true, 'stopEditBlock Ok');
        }
    });
    controller.index();
});

QUnit.test("showGroup", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            showGroup: function() {
                assert.ok(true, 'showGroup Ok');
            }
        },
        toolbar: {
            logoRotation: function() {
                assert.ok(true, 'logoRotation Ok');
            }
        }
    });
    controller.showGroup();
});

QUnit.test("setLayout", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        test: 'test'
    });

    assert.ok(Object.keys(controller.layout).length);
});

QUnit.test("setPageModel", function(assert) {
    var controller = new QoobController();
    controller.setPageModel(new Backbone.Model({ test: 'test' }));
    assert.equal(controller.pageModel.get('test'), 'test');
});

QUnit.test("setStorage", function(assert) {
    var controller = new QoobController();
    controller.setStorage(1);
    assert.equal(controller.storage, 1);
});

QUnit.test("setPreviewMode", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        setPreviewMode: function() {
            assert.ok(true, 'setPreviewMode Ok');
        }
    });
    controller.setPreviewMode();
});

QUnit.test("setEditMode", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        setEditMode: function() {
            assert.ok(true, 'setEditMode Ok');
        }
    });
    controller.setEditMode();
});

QUnit.test("setDeviceMode", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        setDeviceMode: function() {
            assert.ok(true, 'setDeviceMode Ok');
        }
    });
    controller.setDeviceMode('pc');
});

QUnit.test("setAutoSave", function(assert) {
    var controller = new QoobController();
    controller.setAutoSave(true);
    assert.equal(controller.autosave, true, 'setAutoSave Ok');
    controller.setAutoSave(false);
    assert.equal(controller.autosave, false, 'setAutoSave Ok');
});

QUnit.test("save", function(assert) {
    var ViewTest = Backbone.View.extend({
        tag: 'div',
        renderedTemplate: null
    });
    var controller = new QoobController();

    var Collection = new Backbone.Collection();
    var Model = new Backbone.Model({ id: 1 });
    Collection.add(Model);

    controller.setStorage({
        save: function() {
            assert.ok(true, 'save Ok');
        }
    })

    controller.setPageModel(new Backbone.Model({ id: 1, blocks: Collection }));

    controller.setLayout({
        toolbar: {
            showSaveLoader: function() {
                assert.ok(true, 'showSaveLoader Ok');
                return false;
            }
        },
        viewPort: {
            getBlockView: function() {
                // assert.ok(true, 'getBlockView Ok');
                var View = new Backbone.View({});
                var ViewInner = new ViewTest({ model: controller.pageModel });
                ViewInner.renderedTemplate = 'test';
                View.innerBlock = ViewInner;

                return View;
            },

        }
    });


    controller.save();
});

QUnit.test("exit", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        driver: {
            exit: function() {
                assert.ok(true, 'exit Ok');
            }
        }
    });

    controller.exit();
});

QUnit.test("showMore", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            rotateForward: function() {
                assert.ok(true, 'rotateForward Ok');
            }
        },
        toolbar: {
            logoRotation: function() {
                assert.ok(true, 'logoRotation Ok');
            }
        },
        stopEditBlock: function() {
            assert.ok(true, 'stopEditBlock Ok');
        }
    });

    controller.showMore();
});

QUnit.test("showManageLibs", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            rotateForward: function() {
                assert.ok(true, 'rotateForward Ok');
            }
        },
        toolbar: {
            logoRotation: function() {
                assert.ok(true, 'logoRotation Ok');
            }
        }
    });

    controller.showManageLibs();
});

QUnit.test("addNewBlock", function(assert) {
    var controller = new QoobController();
    controller.setPageModel({
        addBlock: function() {
            assert.ok(true, 'addBlock Ok');
        }
    });
    controller.setStorage({
        getBlockConfig: function() {
            return {
                lib: 'default',
                settings: [{ label: "Header", name: "header", type: "text" }],
                defaults: [{ label: "Header", name: "header", type: "text" }],
                name: 'qoob_main'
            };
        }
    });
    controller.setLayout({
        viewPort: {
            addBlock: function() {
                assert.ok(true, 'addBlock Ok');
            },
            scrollTo: function() {
                assert.ok(true, 'scrollTo Ok');
            }
        },
        menu: {
            addSettings: function() {
                assert.ok(true, 'addSettings Ok');
            }
        }
    });

    controller.addNewBlock('default', 'qoob_main', 1);
});

QUnit.test("addBlock", function(assert) {
    var controller = new QoobController();
    controller.setPageModel({
        addBlock: function() {
            assert.ok(true, 'addBlock Ok');
        }
    });
    controller.setLayout({
        viewPort: {
            addBlock: function() {
                assert.ok(true, 'addBlock Ok');
            },
            scrollTo: function() {
                assert.ok(true, 'scrollTo Ok');
            }
        },
        menu: {
            addSettings: function() {
                assert.ok(true, 'addSettings Ok');
            }
        }
    });

    controller.addBlock([{ label: "Header", name: "header", type: "text" }], 1);
});

QUnit.test("startEditBlock", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            scrollTo: function() {
                assert.ok(true, 'scrollTo Ok');
            }
        },
        startEditBlock: function() {
            assert.ok(true, 'startEditBlock Ok');
        }
    });

    controller.startEditBlock(1);
});

QUnit.test("stopEditBlock", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        stopEditBlock: function() {
            assert.ok(true, 'stopEditBlock Ok');
        }
    });

    controller.stopEditBlock();
});

QUnit.test("load", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            trigger: function() {
                assert.ok(true, 'trigger  Ok');
            }
        }
    });
    var blocks = [];
    controller.load(blocks);
});

QUnit.test("setInnerSettingsView", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            settingsViewStorage: [],
            addView: function() {
                assert.ok(true, 'addView Ok');
            },
            rotateForward: function() {
                assert.ok(true, 'rotateForward Ok');
            }
        }
    });

    var ViewTest = Backbone.View.extend({
        tag: 'div'
    });
    controller.setInnerSettingsView(new ViewTest());
});

QUnit.test("deleteInnerSettingsView", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            delView: function() {
                assert.ok(true, 'delView Ok');
            }
        }
    });

    controller.deleteInnerSettingsView('test');
});

QUnit.test("deleteBlock", function(assert) {
    var controller = new QoobController();
    controller.setPageModel({
        deleteBlock: function() {
            assert.ok(true, 'deleteBlock Ok');
        }
    });
    controller.setLayout({
        viewPort: {
            delBlockView: function() {
                assert.ok(true, 'delBlockView Ok');
            },
            triggerIframe: function() {
                assert.ok(true, 'triggerIframe Ok');
            }
        },
        menu: {
            deleteSettings: function() {
                assert.ok(true, 'deleteSettings Ok');
            }
        }
    });

    controller.deleteBlock('test');
});

QUnit.test("moveDownBlock", function(assert) {
    var controller = new QoobController();
    controller.setPageModel({
        moveDown: function() {
            assert.ok(true, 'moveDown Ok');
        }
    });

    controller.moveDownBlock();
});

QUnit.test("moveUpBlock", function(assert) {
    var controller = new QoobController();
    controller.setPageModel({
        moveUp: function() {
            assert.ok(true, 'moveUp Ok');
        }
    });

    controller.moveUpBlock();
});

QUnit.test("triggerIframe", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            triggerIframe: function() {
                assert.ok(true, 'triggerIframe Ok');
            }
        }
    });

    controller.triggerIframe();
});

QUnit.test("triggerIframe", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            triggerIframe: function() {
                assert.ok(true, 'triggerIframe Ok');
            }
        }
    });

    controller.triggerIframe();
});

QUnit.test("changeLib", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        currentLib: 'default'
    });
    controller.setLayout({
        menu: {
            hideLibsExcept: function() {
                assert.ok(true, 'hideLibsExcept Ok');
            }
        }
    });

    controller.changeLib('default');
});

QUnit.test("addLibrary", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        driver: {
            loadLibrariesData: function(cb) {
                assert.ok(true, 'loadLibrariesData Ok');
                cb(null, [{ name: 'test' }]);
            },
            saveLibrariesData: function() {
                assert.ok(true, 'saveLibrariesData Ok');
            }
        },
        getLibraryByUrl: function(url, cb) {
            assert.ok(true, 'getLibraryByUrl Ok');
            cb(null, [{ name: 'test' }]);
        }
    });

    controller.addLibrary('url');
});

QUnit.test("removeLibrary", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        driver: {
            loadLibrariesData: function(cb) {
                assert.ok(true, 'loadLibrariesData Ok');
                cb(null, [{ name: 'test' }]);
            },
            saveLibrariesData: function() {
                assert.ok(true, 'saveLibrariesData Ok');
            }
        }
    });

    controller.removeLibrary('test');
});

QUnit.test("updateLibrary", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        driver: {
            loadLibrariesData: function(cb) {
                assert.ok(true, 'loadLibrariesData Ok');
                cb(null, [{ name: 'test' }]);
            },
            saveLibrariesData: function() {
                assert.ok(true, 'saveLibrariesData Ok');
            }
        },
        getLibraryByUrl: function(url, cb) {
            assert.ok(true, 'getLibraryByUrl Ok');
            cb(null, [{ name: 'test' }]);
        }
    });

    controller.updateLibrary('test', 'url');
});

QUnit.test("scrollTo", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            scrollTo: function() {
                assert.ok(true, 'scrollTo Ok');
            }
        }
    });

    controller.scrollTo(1);
});

QUnit.test("current", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            showIndex: function() {
                assert.ok(true, 'showIndex Ok');
            },
            rotateForward: function() {
                assert.ok(true, 'rotateForward Ok');
            }
        },
        toolbar: {
            logoRotation: function() {
                assert.ok(true, 'logoRotation Ok');
            }
        },
        stopEditBlock: function() {
            assert.ok(true, 'stopEditBlock Ok');
        }
    });

    // Start history
    Backbone.history.start();
    controller.navigate('index');
    assert.equal(controller.current().route, 'index');
    controller.navigate('');
});

QUnit.test("createTemplate", function(assert) {
    var controller = new QoobController();

    var Collection = new Backbone.Collection();
    var Model = new Backbone.Model({ id: 1 });
    Collection.add(Model);

    controller.setStorage({
        createTemplate: function() {
            assert.ok(true, 'createTemplate Ok');
        }
    })

    controller.setPageModel(new Backbone.Model({ id: 1, blocks: Collection }));

    controller.setLayout({
        menu: {
            showOverlay: function() {
                assert.ok(true, 'showOverlay Ok');
            }
        }
    });

    controller.createTemplate([{ name: 'test' }]);
});

QUnit.test("removeTemplateBlock", function(assert) {
    var controller = new QoobController();
    controller.setStorage({
        removeTemplate: function() {
            assert.ok(true, 'removeTemplate Ok');
        }
    })
    controller.removeTemplateBlock(1);
});

QUnit.test("changeDefaultPage", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        viewPort: {
            changeDefaultPage: function() {
                assert.ok(true, 'changeDefaultPage Ok');
            }
        }
    });
    controller.changeDefaultPage({ test: 'test' });
});

QUnit.test("showMenuOverlay", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            showOverlay: function() {
                assert.ok(true, 'showOverlay Ok');
            }
        }
    });
    controller.showMenuOverlay();
});

QUnit.test("hideMenuOverlay", function(assert) {
    var controller = new QoobController();
    controller.setLayout({
        menu: {
            hideOverlay: function() {
                assert.ok(true, 'hideOverlay Ok');
            }
        }
    });
    controller.hideMenuOverlay();
});
