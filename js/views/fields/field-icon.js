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
                this.icons = this.storage.builderData.icons;
                this.tpl = _.template(this.storage.builderTemplates['field-icon-preview']);
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

                window.selectFieldIcon = function (classes) {
                    if (classes) {
                        this.$el.find('.edit-icon-preview span').attr('class', classes);
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
                    icons: _.map(this.settings.icons, function (val) {
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
                var icon,
                        curLibName = classes.split(' ')[0];
                
                for(var i in this.icons) {
                    var libName = this.icons[i][0].classes.split(' ')[0];
                    if(curLibName !== libName) {
                        continue;
                    }
                    icon = _.findWhere(this.icons[i], {"classes": classes});
                }
                
                return icon;
            }
        });
