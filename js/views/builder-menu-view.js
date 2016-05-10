/**
 * Create view for menu in builder layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuView = Backbone.View.extend({
    id: "builder-menu",
    currentId: 'catalog-groups',
    //    settingsViewStorage: {},
    /**
     * View menu
     * @class BuilderMenuView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.controller = options.controller;
        this.storage = options.storage;
        this.model.on("block_add", this.addSettings.bind(this));
    },
    addSettings: function(model) {
        var item = _.findWhere(this.storage.builderData.items, { id: model.get('template') });
        this.addView(new BuilderMenuSettingsView({ "model": model, "config": item, "storage":this.storage, controller:this.controller }), 270);
        // Add devices field
        // if (!_.findWhere(settings, { label: "Visible Devices" })) {
        //     settings.push(self.devicesSettings());
        // }

    },
    /**
     * Render menu
     * @returns {Object}
     */
    render: function() {
        this.$el.html(_.template(this.storage.builderTemplates['builder-menu'])());
        this.addView(new BuilderMenuGroupsView({ storage: this.storage }), 0);
        var groups = this.storage.builderData.groups;
        for (var i = 0; i < groups.length; i++) {
            this.addView(new BuilderMenuBlocksPreviewView({
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
            scrollSensitivity: 50,
            scrollSpeed: 10,
            start: function(event, ui) {
                jQuery('.droppable').show();
            },
            stop: function(event, ui) {
                jQuery('.droppable').hide();
                // Remove empty div for mobile
                if (jQuery('#builder-viewport').find('div').length > 0) {
                    jQuery('#builder-viewport').find('div').remove();
                }
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
     * Add view to side cube
     * @param {Object} BackboneView  View from render
     * @param {String} side Side cube
     */
    addView: function(view, side) {
        this.$el.find('#side-' + side).append(view.render().el);
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
        
        if (currentSide.prop('id') == newSide.prop('id')) {
            addedClass += ' side-full-rotation';
        }

        // hide all blocks side
        this.$el.find('.menu-block').hide();

        // show current block menu
        currentElement.hide();
        newElement.show();

        // rotate cube menu
        this.$el.find('.card-main')
            .removeClass(function(index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            })
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

        // rotate cube menu
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
        this.settingsViewStorage[id].dispose();
    }

});
