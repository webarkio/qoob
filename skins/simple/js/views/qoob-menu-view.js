/*global QoobMenuSettingsView, QoobMenuGroupsView, QoobMenuBlocksPreviewView, QoobMenuSavePageTemplateView */
/**
 * Create view for menu in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuView.prototype */
    {
        id: "qoob-menu",
        currentScreen: 'catalog-groups',
        menuViews: [],
        settingsViewStorage: [],
        events: {
            'change #lib-select': 'changeLib'
        },
        /**
         * View menu
         * @class QoobMenuView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        addSettings: function(model) {
            var item = this.storage.getBlockConfig(model.get('lib'), model.get('block'));
            if (item) {
                this.addView(new QoobMenuSettingsView({
                    "model": model,
                    "config": item,
                    "storage": this.storage,
                    controller: this.controller
                }));
            }
        },
        /**
         * Render menu
         * @returns {Object}
         */
        render: function() {
            this.$el.html(_.template(this.storage.getSkinTemplate('qoob-menu-preview'))());
            var groups = this.storage.getGroups();

            this.addView(new QoobMenuGroupsView({
                storage: this.storage,
                groups: groups,
                controller: this.controller
            }));

            for (var i = 0; i < groups.length; i++) {
                this.addView(new QoobMenuBlocksPreviewView({
                    id: 'group-' + groups[i].id,
                    storage: this.storage,
                    controller: this.controller,
                    group: groups[i]
                }));
            }

            this.addView(new QoobMenuSavePageTemplateView({
                id: 'save-template',
                storage: this.storage,
                controller: this.controller
            }));

            this.draggable();

            this.$el.find('#lib-select').selectpicker();

            return this;
        },

        draggable: function() {
            var self = this;
            // this.$el.find('.preview-block').draggable({
            //     appendTo: "body",
            //     helper: "clone",
            //     distance: 10,
            //     iframeFix: true,
            //     iframeScroll: true,
            //     scrollSensitivity: 100,
            //     scrollSpeed: 15,
            //     containment: 'document',
            //     opacity: 0.5,
            //     start: function(event) {
            //         self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").hide();
            //     },
            //     stop: function() {
            //         self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").show();
            //     }
            // });
        function longClick($el){
            //$el=jQuery(el);
                        
            $el.find('.preview-block').draggable({
                appendTo: "body",
                helper: "clone",
                distance: 10,
                iframeFix: true,
                iframeScroll: true,
                scrollSensitivity: 100,
                scrollSpeed: 15,
                containment: 'document',
                opacity: 0.5,
                start: function(event) {
                    self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").hide();
                },
                stop: function() {
                    self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").show();
                }
            });

            $el.on( "dragstart", function( event, ui ) {
                console.log('DRAG start');
            } );

            $el.on( "dragstop", function( event, ui ) {
                console.log('DRAG stop');


                jQuery(event.target).draggable( "destroy" );
            } );

            $el.simulate( "mousedown");
        }
            
            //self.$el.find('.preview-block').draggable( 'disable');
            this.$el.find('.preview-block').each(function() {


jQuery(this).on("mousedown touchstart",function(){
    console.log('mouse');
    var timer;
    $this = $(this);

    timer = setInterval(function(){
        longClick($this);
        console.log("WORKY MOUSE");
        $this.one('click', function(){
            return false;
        });
    },1000);

        $this.one("mouseup mouseleave mousemove touchmove touchend",function(evt){
        console.log('out');
        console.log(evt);
    clearInterval(timer);
    });
    return false;
});

// jQuery(this).on("touchstart",function(){
//     var timer;
//     $this = $(this);
//     $this.one("touchmove touchend",function(evt){
//         clearInterval(timer);
//         return false;
//     });
//     timer = setInterval(function(){
//         longClick($this);
//         console.log("WORKY TOUCH");
//         $this.one('click', function(){
//             return false;
//         });
//     },1000);
//     return false;
// });

                // var $this = jQuery(this);
                // var mc = new Hammer(this);
                // // listen to events...
                // mc.on("press", function(ev) {

                //         console.log('press');

                        // jQuery(ev.target.parentElement).draggable('enable');

                        // jQuery( ev.target.parentElement ).on( "dragstart", function( event, ui ) {
                        //     console.log('DRAG start');
                        // } );

                        // jQuery( ev.target.parentElement ).on( "dragstop", function( event, ui ) {
                        //     console.log('DRAG stop');
                        //     jQuery(event.target).draggable( "disable" );
                        // } );

                        // jQuery(ev.target.parentElement).simulate( "mousedown");

    // // This will set enough properties to simulate valid mouse options.
    // jQuery.ui.mouse.options = jQuery.ui.mouse.defaults;

    // var divOffset = jQuery(ev.target.parentElement).offset();

    // // This will simulate clicking down on the div - works mostly.
    // console.log(jQuery.ui.mouse);
    // jQuery.ui.mouse._mouseDown({
    //         target: jQuery(ev.target.parentElement),
    //         pageX: divOffset.left,
    //         pageY: divOffset.top,
    //         which: 1,

    //         preventDefault: function() { }
    // });

//                        jQuery(ev.target.parentElement).trigger('mousedown', ev);
                        
                        // console.log(ev);
                        // self.$el.find('.preview-block').draggable( 'enable'); 

                // });
            });

            
            /*
            var element;
            document.addEventListener('touchstart', function(event) {
                // event.preventDefault();
                // self.$el.find('.preview-block').draggable( 'disable'); //if swipe is horizontal
                var touch = event.touches[0];
                element = document.elementFromPoint(touch.pageX,touch.pageY);
            }, false);

            document.addEventListener('touchmove', function(event) {
                // event.preventDefault();
                var touch = event.touches[0];
                if (element !== document.elementFromPoint(touch.pageX,touch.pageY)) {
                    touchleave();
                }
            }, false);

            function touchleave() { 
                console.log ("You're not touching the element anymore");
            }
            */
            /*
            
            var hammer = new Hammer.Manager(this.$el.find('.preview-blocks')[7], {
                touchAction: 'auto',
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
                recognizers: [
                    [Hammer.Swipe, {
                        direction: Hammer.DIRECTION_VERTICAL
                    }]
                ]
            });

            hammer.on('swipeup swipedown', function(e) {
                if (e.type === "swipedown") {
                    console.log("swipedown");
                    self.$el.find('.preview-block').draggable( 'disable'); //if swipe is horizontal
                } else if (e.type === "swipeup") {
                    console.log("swipeup");
                    self.$el.find('.preview-block').draggable( 'disable'); //if swipe is horizontal
                }
            });
            */

            /*
            this.$el.find('.preview-block').on("touchstart", function(e) {
                    touchY = e.originalEvent.touches[0].pageY;
                    touchX = e.originalEvent.touches[0].pageX;

                });

                self.$el.find('.preview-block').on("touchmove", function(e) {

                    var fTouchY = e.originalEvent.touches[0].pageY;
                    var fTouchX = e.originalEvent.touches[0].pageX;

                    if ((Math.abs(fTouchX - touchX)) / Math.abs(fTouchY - touchY) > 1){ //check swipe direction

                        self.$el.find('.preview-block').draggable( 'enable'); //if swipe is horizontal
                    }
                    else{
                        self.$el.find('.preview-block').draggable( 'disable'); //if swipe is horizontal
                    }

            });
            */
        },

        setPreviewMode: function() {
            this.$el.fadeOut(300);
        },
        setEditMode: function() {
            this.$el.fadeIn(300);
        },
        showGroup: function(group) {
            this.rotateForward('group-' + group);
        },
        showIndex: function() {
            this.rotateBackward('catalog-groups');
        },
        startEditBlock: function(blockId) {
            this.rotateForward(blockId);
        },
        /**
         * Resize menu
         */
        resize: function() {
            this.$el.css({
                height: jQuery(window).height() - 62,
                top: 62
            });
        },
        /**
         * Add view to side qoob
         * @param {Object} BackboneView  View from render
         */
        addView: function(view) {
            this.menuViews.push(view);
            this.$el.find('.current-screen').append(view.render().el);
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
            }
        },
        /**
         * Menu rotation
         * @param {Number} id
         * @param {String} screen Class side
         * @param {Number} deg number transform
         */
        rotate: function(id, screen, deg, cb) {
            var self = this,
                findScreen = this.$el.find('[data-side-id="' + id + '"]'),
                currentSide = this.$el.find('[data-side-id="' + this.currentScreen + '"]');

            if (this.currentScreen === id) {
                currentSide.addClass('show');
                return;
            }

            this.$el.find('.' + screen).append(findScreen.clone());
            this.$el.find('.current-temporary').append(currentSide.clone());

            if (screen === 'forward-screen') {
                this.$el.find('#card').addClass('rotate-forward');
            } else if (screen === 'backward-screen') {
                this.$el.find('#card').addClass('rotate-backward');
            }

            this.$el.find('.current-temporary').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
                if (e.target == this) {
                    self.$el.find('#card').removeClass('rotate-forward rotate-backward');
                    self.$el.find('[data-side-id]').removeClass('show');
                    findScreen.addClass('show');
                    self.$el.find('.' + screen).html('');
                    self.$el.find('.current-temporary').html('');

                    self.currentScreen = id;

                    jQuery(this).off(e);
                }
            });
        },
        /**
         * Menu rotation forward
         * @param {Number} id
         */
        rotateForward: function(id, cb) {
            this.rotate(id, 'forward-screen', 90, cb);
        },
        /**
         * Menu rotation backward
         * @param {Number} id
         */
        rotateBackward: function(id, cb) {
            this.rotate(id, 'backward-screen', -90, cb);
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
         * Delete view from settingsViewStorage
         * @param {String} view name
         */
        delView: function(name) {
            if (this.settingsViewStorage && this.settingsViewStorage[name]) {
                this.settingsViewStorage[name].dispose();
                delete this.settingsViewStorage[name];
            }
        },
        deleteSettings: function(model) {
            this.controller.stopEditBlock();

            var settings = this.getSettingsView(model.id);
            settings.dispose();
        },
        /**
         * Hide groups and blocks in menu those are not contained in selected lib.
         * @param  {String} libName Lib name for which not to hide groups and blocks
         */
        hideLibsExcept: function(libName) {
            var self = this,
                groups = this.$el.find('ul.catalog-list li'),
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
        },
        changeLib: function(evt) {
            var target = jQuery(evt.target);
            this.controller.changeLib(target.val());
        },
        hideNotice: function() {
            var viewSaveTemplate = _.findWhere(this.menuViews, { 'id': 'save-template' }),
                element = viewSaveTemplate.$el;

            if (element.find('.save-template-settings').hasClass('show-notice')) {
                element.find('.remove').trigger('click');
                element.find('.input-text').val('');
                element.find('.save-template-settings').removeClass('show-notice');
            }
            if (element.find('.error-block').is(':visible')) {
                element.find('.error-block').hide();
            }
            if (element.find('.input-text').hasClass('error')) {
                element.find('.input-text').removeClass('error');
            }
        }
    });
