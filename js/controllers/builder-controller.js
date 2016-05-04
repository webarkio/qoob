 var BuilderController = Backbone.Router.extend({


     routes: {
         "help": "help", // #help
         "search/:query": "search", // #search/kiwis
         "search/:query/p:page": "search" // #search/kiwis/p7
     },

     help: function() {

     },

     search: function(query, page) {

     },
     setLayout: function(layout) {
         this.layout = layout;
     },
     setPreviewMode: function() {
		this.layout.setPreviewMode();
     },
     setEditMode: function() {
     	this.layout.setEditMode();
     },
     setScreenMode: function(mode){
     	console.log("SET MODE");
     	console.log(mode);
            // jQuery('.screen-size').removeClass('active');
            // jQuery(elem).addClass('active');

                size = {};

            switch (mode) {
                case 'pc':
                    size = {
                        'width': '100%'
                    };
                    break;
                case 'tablet-vertical':
                    size = {
                        'width': '768px'
                    };
                    break;
                case 'phone-vertical':
                    size = {
                        'width': '375px'
                    };
                    break;
                case 'tablet-horizontal':
                    size = {
                        'width': '1024px'
                    };
                    break;
                case 'phone-horizontal':
                    size = {
                        'width': '667px'
                    };
                    break;
            }

            jQuery('#builder-viewport iframe').stop().animate({
                width: size.width
            });

            var class_remove = jQuery('#builder-viewport').attr('class');
            jQuery('#builder-viewport').removeClass(class_remove).addClass(current);     	
     }



 });
