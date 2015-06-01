(function( $ ) {

    $.fn.multipleRangeInterface = function(method, parameters) {
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
						$('.section', rangeInterface).each(function() {
							$(this)
								.append(dragbar)
								.append(section_body.css('width', $(this).width() - 3));
						});

						return rangeInterface;
			},
			deleteSection : function(id) {
						$('.section', rangeInterface).each(function() {
							if ($(this).data('sectionData').id == id) {
								$(this).remove();
							}

							return rangeInterface;
						});
			},
			getValues : function() {
						var values = [];

						$('.section', rangeInterface).each(function() {
							values.push($(this).data('sectionData'));
						});

						return values;
			},
			setValues : function(options) {
						// First make sure id is present in options
						if (options.hasOwnProperty('id')) {
							$('.section', rangeInterface).each(function() {
								var $this = $(this);

								if ($this.data('sectionData').id == options.id) {
									var new_data = $.extend($this.data('sectionData'), options);
									$this.data('sectionData', new_data);

									if (options.hasOwnProperty('start')) {
										$this.css('left', options.start);
									}

									if (options.hasOwnProperty('stop')) {
										var width = options.stop - $this.position().left;
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

							return true;
						}

						console.error("id is required for setValues method.");
						return false;
			},
			// Utility methods
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
			return methods[method](parameters);
		}
    	else {
    		var options = {
    			onChange : function() {},
    			onSectionClick : function() {}
    		};

    		options = $.extend(options, method);

			var dragging = false;
			var currentSectionData;

		   	this.empty().on('mousedown', '.section-body, .dragbar', function(e){
		       e.preventDefault();

		       var $this = $(this);
		       var start_position = e.pageX - $this.parent().position().left;

		       currentSectionData = $this.parent().data('sectionData');

		       $this.parent().addClass('dragging');

		       	// if user just clicked then no need to run dragging code below
				$(document).on('mouseup', function() {
					$(document).unbind('mousemove');
				});

		       $(document).on('mousemove', function(e){
		       		dragging = true;
		       		
		       		if ($this.is('.dragbar')) {
		       			var width = e.pageX - $this.parent().offset().left;

		       			// Setup boundries
		       			if ($this.parent().position().left + width > rangeInterface.width()) {
		       				width = rangeInterface.width() - $this.parent().position().left;
		       			
		       			}

		       			methods.setValues({
		       								id: $this.parent().data('sectionData').id,
		       								stop:  $this.parent().position().left + width
		       							});


		       		} else if ($this.is('.section-body')) {
		       			//var position = $this.parent().position();
		       			//var direction = position.left > left ? 'left' : 'right';

		       			var left = e.pageX - start_position;

		       			// Setup boundries
		       			if (left < 0) {
		       				left = 0;

		       			} else if (left + $this.parent().width() > rangeInterface.width()) {
		       				left = rangeInterface.width() - $this.parent().width();
		       			}

	       				methods.setValues({
	       								id: $this.parent().data('sectionData').id,
	       								start:  left,
	       								stop: $this.parent().width() + left
	       							});
		       		}

	       			// trigger the onChange event
					if (typeof options.onChange == 'function') {
						options.onChange.call(rangeInterface, e);
					}
		       });
		    })
			.on('mouseup', '.section-body, .dragbar', function(e) {
				if (!dragging) {
					// trigger the onSectionClick event
					if (typeof options.onSectionClick == 'function') {
						options.onSectionClick.call(rangeInterface, e, currentSectionData);
					}
				}
			});

			$(document).on('mouseup', function() {
				$('.section', this).removeClass('dragging');
		   		
		   		if (dragging) {
		      		$(document).unbind('mousemove');
		    		dragging = false;	
		   		}
			});
    	}
    	
        return this;
 
    };
 
}( jQuery ));