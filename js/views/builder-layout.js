/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderLayout = Backbone.View.extend(
        /** @lends BuilderView.prototype */{
            tpl: null,
            postId: null,
            /**
             * View buider
             * @class BuilderView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (pageModel) {
                this.menu = new BuilderMenuView({"model": pageModel});
                this.toolbar = new BuilderToolbarView({"model": pageModel});
                this.viewPort = new BuilderViewportView({"model": pageModel});
            },
            /**
             * Render builder view
             * @returns {Object}
             */
            render: function () {
                var data = builder.storage.builderTemplates['builder'];
                this.tpl = _.template(data);

                this.$el.html(this.tpl({"postId": builder.storage.pageId}));
                this.$el.find('#builder').append(this.toolbar.render().el);
                this.$el.find('#builder').append(this.menu.render().el);
                this.$el.find('#builder-content').append(this.viewPort.render().el);

                return this;
            }
        });