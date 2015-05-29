(function( $ ) {

    $.fn.multipleRangeInterface = function(method, arguments) {
    	var rangeInterface = this;

		var methods = {
			addSection : function(options) {
						var default_options = {color: this.getRandomColor()};
						var options = $.extend(default_options, options);
						
						var section = $('<div />').addClass('section').css({'width' : '25px'});
						var dragbar = $('<div />').addClass('dragbar');
						var section_body = $('<div />').addClass('section-body');

						rangeInterface.append(section.css('background', options.color).data('sectionData', {
																											id: this.getNextSectionId(),
																											start: 0,
																											stop: 0
																											}));

						// insert dragbars and section-body divs for dragging
						$('.section', rangeInterface).each(function(index, key) {
							$(this)
								.append(dragbar)
								.append(section_body.css('width', $(this).width() - 3));
						});

						return rangeInterface;
			},
			getNextSectionId : function() {
						if ($('.section', rangeInterface).length >= 1) {
							var ids = [];

							$('.section', rangeInterface).each(function() {
								ids.push($(this).data('sectionData').id);
							});

							return ids[ids.length - 1] + 1;
						}
						
						return 1;
			},
			getValues : function() {
						var values = [];

						$('.section', rangeInterface).each(function(index, key) {
							values.push($(this).data('sectionData'));
						});

						return values;
			},
			setValues : function(options) {
						// First make sure id is present in options
						if (options.hasOwnProperty('id')) {
							$('.section', rangeInterface).each(function(index, key) {
								var $this = $(this);

								if ($this.data('sectionData').id == options.id) {
									var new_data = $.extend($this.data('sectionData'), options);
									$this.data('sectionData', new_data);

									if (options.hasOwnProperty('start')) {
										$this.css('left', options.start);
									}

									if (options.hasOwnProperty('stop')) {
										var width = options.stop - $this.position().left
										$this.css('width', width)
											.find('.section-body')
		       									.css('width', width);
									}

									if (options.hasOwnProperty('color')) {
										$this.css('background', options.color);
									}

									//console.log(new_data);
								}
							});

							this.onChangeFunc();
							return true;
						}

						console.error("id is required for setValues method.");
						return false;
			},
			// Event methods
			onChange : function(callback) {
						// Not right...
						this.onChangeFunc = callback;
			},
			onChangeFunc : function() {},

			// Utility methods
			getRandomNumber : function(min, max) {
						return Math.floor(Math.random() * (max - min + 1)) + min;
			},
			getRandomColor : function() {
					    var letters = '0123456789ABCDEF'.split('');
					    var color = '#';
					    for (var i = 0; i < 6; i++ ) {
					        color += letters[Math.floor(Math.random() * 16)];
					    }
					    return color;
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

		   	this.empty().on('mousedown, touchstart', '.section-body, .dragbar', function(e){
		       e.preventDefault();
		       dragging = true;

		       var $this = $(this);
		       var start_position = e.pageX - $this.parent().position().left;
		       var main = $('#main');

		       $this.addClass('dragging');

		       $(document).mousemove(function(e){
		       		if ($this.is('.dragbar')) {
		       			var width = e.pageX - $this.parent().offset().left;// - dragbar_width;
		       			/*
		       			$this
		       				.parent()
		       				.css('width', width)
		       				.find('.section-body')
		       					.css('width', width);
		       					*/

		       			methods.setValues({
		       								id: $this.parent().data('sectionData').id,
		       								stop:  $this.parent().position().left + width
		       							});


		       		} else if ($this.is('.section-body')) {
		       			var left = e.pageX - start_position;
		       			//$this.parent().css('left', left);

		       			methods.setValues({
		       								id: $this.parent().data('sectionData').id,
		       								start:  left
		       							});
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