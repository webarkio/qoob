/*global QoobFieldView, IconCenterView*/
var Fields = Fields || {};

/**
 * View field icon
 */
Fields.icon = QoobFieldView.extend( // eslint-disable-line no-unused-vars
    /** @lends Fields.icon.prototype */
    {
        events: {
            'click .media-center': 'clickMediaCenter',
            'click .remove': 'clickRemoveIcon',
            'click .reset': 'clickResetIconToDefault'
        },
        /**
         * View field icon
         * @class Fields.icon
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.parentId = options.parentId;
            this.options = options;
            var assets = this.storage.getAssets();

            this.icons = [];

            //Get all icons from assets
            for (var i = 0, asLen = assets.length; i < asLen; i++) {
                for (var j = 0, aLen = assets[i].length; j < aLen; j++) {
                    if (assets[i][j].type === 'icon') {
                        this.icons.push({
                            classes: assets[i][j].classes,
                            tags: assets[i][j].tags
                        });
                    }
                }
            }

            this.tpl = _.template(this.storage.getSkinTemplate('field-icon-preview'));
        },
        /**
         * Remove image
         * @param {Object} evt
         */
        clickRemoveIcon: function(evt) {
            evt.preventDefault();
            this.$el.find('.edit-icon').addClass('empty');
            this.changeIcon('');
        },
        clickResetIconToDefault: function(evt) {
            evt.preventDefault();
            this.changeIcon(this.options.defaults);
            if (this.$el.find('.edit-icon').hasClass('empty')) {
                this.$el.find('.edit-icon').removeClass('empty');
            }
        },
        /**
         * Main method change icon
         * @param {String} icon
         */
        changeIcon: function(icon) {
            var iconObject = this.findByClasses(icon);
            this.$el.find('.preview-icon span').attr({
                'class': icon,
                'data-icon-tags': (iconObject ? iconObject.tags : '')
            });
            this.$el.find('input[type="hidden"]').val(icon);
            this.model.set(this.$el.find('input[type="hidden"]').attr('name'), icon);
        },
        /**
         * Show media center icon
         */
        clickMediaCenter: function() {
            window.selectFieldIcon = function(classes) {
                if (classes === '') {
                    this.$el.find('.edit-icon').addClass('empty');
                } else {
                    this.$el.find('.edit-icon').removeClass('empty');
                }
                this.changeIcon(classes);

            }.bind(this);

            var iconObject = this.findByClasses(this.$el.find('input[type="hidden"]').val());

            var iconCenter = new IconCenterView({
                model: this.model,
                controller: this.controller,
                parentId: this.parentId,
                storage: this.storage,
                icon: iconObject ? { classes: iconObject.classes, tags: iconObject.tags } : '',
                icons: this.icons,
                'no_icon': this.storage.__('no_icon', 'No icon')
            });

            this.controller.setInnerSettingsView(iconCenter);

            return false;
        },
        /**
         * Render filed icon
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                label: this.settings.label,
                name: this.settings.name,
                icon: this.findByClasses(this.getValue()) || this.getValue(),
                'media_center': this.storage.__('media_center', 'Media Center'),
                'no_icon': this.storage.__('no_icon', 'No icon'),
                'reset_to_default': this.storage.__('reset_to_default', 'Reset to default')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        },
        /**
         * Return icon object from icon's storage with needed classes
         * @param {string} classes
         * @returns {Object} Iconobject
         */
        findByClasses: function(classes) {
            return _.findWhere(this.icons, { "classes": classes });
        }
    });
