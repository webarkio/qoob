/*global QoobFieldView*/
var Fields = Fields || {};

/**
 * View field icon
 */
Fields.icon = QoobFieldView.extend( // eslint-disable-line no-unused-vars
    /** @lends Fields.icon.prototype */
    {
        className: 'field-icon field-group',
        events: {
            'click .show-media-center': 'clickMediaCenter',
            'click .field-icon__remove-icon': 'clickRemoveIcon',
            'click .reset': 'clickResetIconToDefault',
            'click .other-icon': 'clickOtherIcon'
        },
        /**
         * View field icon
         * @class Fields.icon
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.options = options;
            var assets = this.storage.getAssets();

            this.icons = [];

            //Get all icons from assets
            for (var i = 0; i < assets.length; i++) {
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
            evt.stopImmediatePropagation();
            this.changeIcon('');
        },
        clickResetIconToDefault: function(evt) {
            evt.preventDefault();
            this.changeIcon(this.options.defaults);
        },
        /**
         * Main method change icon
         * @param {String} icon
         */
        changeIcon: function(icon) {
            var iconObject = this.findByClasses(icon);

            this.$el.find('.field-icon__preview-icon span').attr({
                'class': icon,
                'data-icon-tags': (iconObject ? iconObject.tags : '')
            });

            if (iconObject === undefined) {
                this.$el.find('.field-icon-container').addClass('empty');
            } else {
                this.$el.find('.field-icon-container').removeClass('empty');
            }

            this.$el.find('input[type="hidden"]').val(icon);
            this.model.set(this.$el.find('input[type="hidden"]').attr('name'), icon);
        },
        /**
         * Click other icon
         * @param {Object} evt
         */
        clickOtherIcon: function(evt) {
            var icon = this.$(evt.currentTarget).find('span').prop('class');
            this.changeIcon(icon);
        },
        /**
         * Show media center icon
         */
        clickMediaCenter: function() {
            this.controller.navigate(this.controller.currentUrl() + "/" + this.settings.name, true);
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
                icons: _.map(this.settings.presets, function(val) {
                    return this.findByClasses(val);
                }.bind(this)),
                icon: this.findByClasses(this.getValue()) || this.getValue(),
                hideDeleteButton: this.settings.hideDeleteButton,
                'icon_center': this.storage.__('icon_center', 'Icon center'),
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