(function( $ ) {

    $.fn.multipleRangeInterface = function(method, arguments) {
    	var rangeInterface = this;

		var methods = {
			addSection : function(options) {
						var default_options = {color: 'blue'};
						var options = $.extend(default_options, options);
						
						var section = $('<div />').addClass('section').css({'width' : '25px', 'background' : 'blue'});
						var dragbar = $('<div />').addClass('dragbar');
						var section_body = $('<div />').addClass('section-body');
						
						rangeInterface.append(section.css('background', options.color).data('sectionId', this.getNextSectionId()));

						// insert dragbars and section-body divs for dragging
						$('.section', rangeInterface).each(function(index, key) {
							$(this)
								.append(dragbar)
								.append(section_body.css('width', $(this).width() - 3));
						});
			},
			getNextSectionId : function() {
						if ($('.section', rangeInterface).length >= 1) {
							var ids = [];

							$('.section', rangeInterface).each(function() {
								ids.push($(this).data('sectionId'));
							});

							return ids.sort()[ids.length - 1] + 1;
						}
						
						return 1;
			},
			getValues : function() {
						var values = [];
						$('.section', rangeInterface).each(function(index, key) {
							var $this = $(this);

							values.push({
											'id'	: $this.data('sectionId'),
											'start' : $this.position().left,
											'stop' 	: $this.position().left + $(this).width()
										});
						});

						return values;
			},
			setValues : function() {

			},
			getRandomNumber : function(min, max) {
						return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		};

		if (methods.hasOwnProperty(method)) {
			return methods[method](arguments);
		}
    	else {
    		var duration = 60;
			var dragging = false;
			var dragbar_width = 3;
			var sections = {};

		   	this.empty().on('mousedown', '.section-body, .dragbar', function(e){
		       e.preventDefault();
		       dragging = true;

		       var $this = $(this);
		       var start_position = e.pageX - $this.parent().offset().left;
		       var main = $('#main');

		       $this.addClass('dragging');

		       $(document).mousemove(function(e){
		       		if ($this.is('.dragbar')) {
		       			var width = e.pageX - $this.parent().offset().left - dragbar_width;

		       			$this
		       				.parent()
		       				.css('width', width)
		       				.find('.section-body')
		       					.css('width', width);


		       		} else if ($this.is('.section-body')) {
		       			var left = e.pageX - start_position;
		       			$this.parent().css('left', left);
		       		}
		       });
		    });

			$(document).mouseup(function(e){
		   		if (dragging) 
		     	{
		      		$(document).unbind('mousemove');
		    		dragging = false;
		   			$('.section-body', this).removeClass('dragging');

		   			//console.log(rangeInterface.multipleRangeInterface('getValues'));
		   		}
			});
    	}
    	
        return this;
 
    };
 
}( jQuery ));