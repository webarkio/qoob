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
            initialize: function (builder) {
                var self = this;
                this.builder = builder;
                self.menu = new BuilderMenuView(this.builder);
                self.toolbar = new BuilderToolbarView(this.builder);
                self.viewPort = new BuilderViewportView(this.builder);
            },
            /**
             * Render builder view
             * @returns {Object}
             */
            render: function () {
                var self = this;
                this.builder.storage.getBuilderTemplate('builder', function (err, data) {
                    self.tpl = _.template(data);
                    self.menu.render();
                    self.toolbar.render();
                    self.viewPort.render();

                    self.$el.html(self.tpl({"postId": self.builder.storage.pageId}));
                    self.$el.find('#builder').append(self.toolbar.el);
                    self.$el.find('#builder').append(self.menu.el);
                    self.$el.find('#builder-content').append(self.viewPort.el);
                });
                
                return this;
            }
        });