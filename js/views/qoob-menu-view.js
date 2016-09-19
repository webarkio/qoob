/**
 * Create view for menu in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuView = Backbone.View.extend({
    id: "qoob-menu",
    currentId: 'catalog-groups',
    menuViews: [],
    /**
     * View menu
     * @class QoobMenuView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.controller = options.controller;
        this.storage = options.storage;
        this.model.on("block_add", this.addSettings.bind(this));
        this.model.on("block_delete", this.deleteSettings.bind(this));
    },
    addSettings: function(model) {
        var item = this.storage.getBlock(model.get('template'), model.get('lib'));
        this.addView(new QoobMenuSettingsView({ "model": model, "config": item, "storage":this.storage, controller:this.controller }), 270);
    },
    /**
     * Render menu
     * @returns {Object}
     */
    render: function() {
        this.$el.html(_.template(this.storage.qoobTemplates['qoob-menu-preview'])());
        var groups = this.storage.getGroups();
        this.addView(new QoobMenuGroupsView({ storage: this.storage, groups: groups, controller: this.controller }), 0);
        for (var i = 0; i < groups.length; i++) {
            this.addView(new QoobMenuBlocksPreviewView({
                id: 'group-' + groups[i].id,
                storage: this.storage,
                controller: this.controller,
                group: groups[i]
            }), 90);
        }
        this.draggable();

        return this;
    },

    draggable: function() {
        this.$el.find('.preview-block').draggable({
            appendTo: "body",
            helper: "clone",
            iframeFix: true,
            iframeScroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 15,
            containment:'body',
            start: function(event, ui) {
                jQuery('.droppable').show();
            },
            stop: function(event, ui) {
                jQuery('.droppable').hide();
            }
        });
    },

    setPreviewMode: function() {
        this.$el.fadeOut(300);
    },
    setEditMode: function() {
        this.$el.fadeIn(300);
    },
    showGroup: function(group) {
        this.rotate('group-' + group);
    },
    showIndex: function() {
        this.rotate('catalog-groups');
    },
    startEditBlock: function(blockId) {
        this.rotate('settings-block-' + blockId);
    },

    /**
     * Resize menu
     */
        resize: function() {
        this.$el.css({
            height: jQuery(window).height() - 70,
            top: 70
        });
    },
    /**
     * Add view to side qoob
     * @param {Object} BackboneView  View from render
     * @param {String} side Side qoob
     */
    addView: function(view, side) {
        this.menuViews.push(view);
        this.$el.find('#side-' + side).append(view.render().el);
    },
    /**
     * Get SettingsView by id
     * @param {Number} id modelId
     */
    getSettingsView: function(id) {
        for (var i = 0; i < this.menuViews.length; i++) {
            if (this.menuViews[i].model && this.menuViews[i].model.id == id) {
                return this.menuViews[i];
            }
        };
    },
    /**
     * Menu rotation
     * @param {Integer} id
     * @param {Boolean} back Rotate back
     */
    rotate: function(id) {
        if (this.currentId == id)
            return;

        // current block for id
        var currentElement = this.$el.find('#' + this.currentId);
        var newElement = this.$el.find('#' + id);

        // get block side
        var currentSide = currentElement.closest('div[id^="side-"]');
        var newSide = newElement.closest('div[id^="side-"]');
        var addedClass = newSide.prop('id');

        if(this.$el.find('.card-main').hasClass('side-full-rotation')) {
            this.$el.find('.card-main').removeClass('side-full-rotation');
        }else{
            if (currentSide.prop('id') == newSide.prop('id')) {
                addedClass += ' side-full-rotation';
            }
        }

        // hide all blocks side
        this.$el.find('.menu-block').hide();

        // show current block menu
        currentElement.hide();
        newElement.show();

        // rotate qoob menu
        this.$el.find('.card-main')
            .removeClass(function(index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            }).removeClass('side-full-rotation')
            .addClass(addedClass)
            .children()
            .removeClass('active');

        // add active class
        newSide.addClass('active');

        // set current rotate id
        this.currentId = id;

    },
    onEditStart: function(blockId) {
        this.rotate('settings-block-' + blockId);
    },
    onEditStop: function() {
        this.rotate('catalog-groups');
    },

    onEditMode: function() {
        this.$el.fadeIn(300);
    },

    /**
     * Rotate menu back
     * Not used
     */
    back: function() {
        var tmp = this.backSide;

        // rotate qoob menu
        this.$el.find('.card-main')
            .removeClass(function(index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            })
            .addClass(this.backSide);

        // Set back side
        this.backSide = this.currentSide;

        // Set current side
        this.currentSide = tmp;
    },
    /**
     * Delete view from settingsViewStorage
     * @param {String} view id
     */
    delView: function(id) {
        if(this.settingsViewStorage && this.settingsViewStorage[id]) {
            this.settingsViewStorage[id].dispose();
        }   
    },
    deleteSettings: function(modelId) {
        this.controller.stopEditBlock();
        
        var settings = this.getSettingsView(modelId);
        settings.dispose();
    },
    /**
     * Hide groups and blocks in menu those are not contained in selected lib.
     * @param  {String} libName Lib name for which not to hide groups and blocks
     */
    hideLibsExcept: function(libName) {
        var self = this,
            groups = this.$el.find('#catalog-groups li'),
            blocks = this.$el.find('.preview-block');
        
        groups.hide();
        blocks.hide();

        if (libName !== 'all') {
            groups = groups.filter(function(index) {
                return self.$(groups[index]).hasClass(libName);
            });
            blocks = blocks.filter(function(index) {
                return self.$(blocks[index]).hasClass(libName);
            }); 
        }

        groups.show();
        blocks.show();
    }
});
