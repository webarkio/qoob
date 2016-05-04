/**
 * Create buidler view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderLayout = Backbone.View.extend(
    /** @lends BuilderView.prototype */
    {
        tpl: null,
        /**
         * View buider
         * @class BuilderView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
            this.menu = new BuilderMenuView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.toolbar = new BuilderToolbarView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.editModeButton = new BuilderEditModeButtonView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.viewPort = new BuilderViewportView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
        },
        /**
         * Render builder view
         * @returns {Object}
         */
        render: function() {
            this.tpl = _.template(this.storage.builderTemplates['builder']);
            //FIXME: this.storage => this.model
            this.$el.html(this.tpl({
                "postId": this.storage.pageId
            }));
            this.$el.find('#builder').append(this.toolbar.render().el);
            this.$el.find('#builder').append(this.editModeButton.render().el);
            this.editModeButton.hide();
            this.$el.find('#builder').append(this.menu.render().el);
            this.$el.find('#builder-content').append(this.viewPort.render().el);

            return this;
        },
        resize: function() {
            this.toolbar.resize();
            this.editModeButton.resize();
            this.menu.resize();
            this.viewPort.resize();
        },
        setPreviewMode: function() {
            this.toolbar.setPreviewMode();
            this.editModeButton.setPreviewMode();
            this.menu.setPreviewMode();
            this.viewPort.setPreviewMode();
            this.resize();
        },
        setEditMode: function() {
            this.toolbar.setEditMode();
            this.editModeButton.setEditMode();
            this.menu.setEditMode();
            this.viewPort.setEditMode();
            this.resize();
        }

    });
