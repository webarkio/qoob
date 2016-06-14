var Fields = Fields || {};

/**
 * View field icon
 */
Fields.icon = FieldView.extend(
        /** @lends Fields.icon.prototype */{
            events: {
                'change input': 'changeInput',
                'click .edit-icon-preview': 'iconUpload',
                'click .other-icon': 'changeIcon'
            },
            /**
             * View field icon
             * @class Fields.icon
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                FieldView.prototype.initialize.call(this, options);
                this.parentId = options.parentId;
                
                var assets = this.storage.getAssets(),
                        icons = [];
                //Get all icons from assets
                for (var i = 0, asLen = assets.length; i < asLen; i++) {
                    for (var j = 0, aLen = assets[i].length; j < aLen; j++) {
                        if (assets[i][j].type === 'icon') {
                            icons.push({
                                classes: assets[i][j].classes,
                                tags: assets[i][j].tags
                            });
                        }
                    }
                }
                
                this.icons = icons;
                this.tpl = _.template(this.storage.qoobTemplates['field-icon-preview']);         
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                this.model.set(this.$(evt.target).attr('name'), this.$el.find('.edit-icon-preview span').attr('class'));
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            iconUpload: function (evt) {

                window.selectFieldIcon = function (classes, tags) {
                    if (classes) {
                        this.$el.find('.edit-icon-preview span').attr({'class': classes, 'data-icon-tags': (!!tags ? tags : '')});
                        if (classes === 'empty') {
                            this.$el.find('.edit-icon-preview').addClass('empty');
                        } else {
                            this.$el.find('.edit-icon-preview').removeClass('empty');
                        }
                        this.$el.find('input').trigger("change");
                        if (this.$el.find('.other-icons').length) {
                            this.$el.find('.other-icon').removeClass('active');
                        }
                    }
                }.bind(this);

                var iconCenter = new IconCenterView({
                    model: this.model,
                    controller: this.controller,
                    parentId: this.parentId,
                    storage: this.storage,
                    icon: {classes: this.$el.find('.edit-icon-preview span').attr('class'), tags: this.$el.find('.edit-icon-preview span').attr('data-icon-tags')},
                    icons: this.icons
                });

                this.controller.setInnerSettingsView(iconCenter);

                return false;
            },
            /**
             * Change other icon
             * @param {Object} evt
             */
            changeIcon: function (evt) {
                var elem = this.$(evt.currentTarget);
                this.$el.find('.other-icon').removeClass('active');
                elem.addClass('active');
                this.$el.find('.edit-icon-preview span').attr({'class': elem.find('span').attr('class'), 'data-icon-tags': elem.find('span').attr('data-icon-tags')});
                this.$el.find('.edit-icon-preview').removeClass('empty');
                this.$el.find('input').trigger("change");
            },
            /**
             * Render filed icon
             * @returns {Object}
             */
            render: function () {
                var htmldata = {
                    label: this.settings.label,
                    name: this.settings.name,
                    icons: _.map(this.settings.presets, function (val) {
                        return this.findByClasses(val);
                    }.bind(this)),
                    icon: this.findByClasses(this.getValue()) || this.getValue()
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
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
                return _.findWhere(this.icons, {"classes": classes});
            }
        });
