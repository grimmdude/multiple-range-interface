(function( $ ) {

    $.fn.multipleRangeInterface = function(method, parameters) {
    	var rangeInterface = this;

		var methods = {
			addSection : function(options) {
						var default_options = {color: this.getRandomColor()};
						var options = $.extend(default_options, options);

						// Clear selected sections
						$('.section', rangeInterface).removeClass('selected');

						var dragbarLeft = $('<div />').addClass('dragbar-left');
            var dragbarRight = $('<div />').addClass('dragbar-right');
						var section_body = $('<div />').addClass('section-body');
						var section = $('<div />')
										.addClass('section selected')
										.css({'width' : '25px'})
										.append(dragbarLeft)
                    .append(dragbarRight)
										.append(section_body);

						var section_data = {
											id: this.getNextSectionId(),
											start: 0,
											stop: 25,
											selected: true
											};

						this.selectSection(this.getNextSectionId());

						rangeInterface.append(section.data('sectionData', section_data));

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
      getBounds : function(id, start, stop) {
          var currentValues = methods.getValues();
          var minX = 0;
          var maxX = rangeInterface.width();
          currentValues.forEach(function(el,i) {
            if (el.id != id){
              if (el.stop > minX && el.stop <= start){
                minX = el.stop;
              }
              if (el.start < maxX && el.start >= stop){
                maxX = el.start;
              }
            }
          });

          return {
            min: minX + 1,
            max: maxX - 1
          };
      },
      getValuesById : function(id) {
						var values = $('.section[data-id=' + id + ']', rangeInterface);
            return values.data('sectionData');
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
										if (options.hasOwnProperty('animate') && options.animate) {
											$this.animate({
												left: options.start,
											}, 300);

										} else {
											$this.css('left', options.start);
										}
									}

									if (options.hasOwnProperty('stop')) {
										var width = options.stop - $this.position().left;

										if (options.hasOwnProperty('animate') && options.animate) {
											$this.animate({
											    width: width,
											}, 300)
											.find('.section-body')
		       									.css('width', width);

										} else {
											$this.css('width', width)
											.find('.section-body')
		       									.css('width', width);
										}
									}

									if (options.hasOwnProperty('color')) {
										$this.css('background', options.color);
									}
								}
							});

							return true;
						}

						console.error("id is required for setValues method.");
						return false;
			},
			selectSection : function(id) {
				var values = this.getValues();

				for (var i in values) {
					if (values[i].id == id) {
						values[i].selected = true;

					} else {
						values[i].selected = false;
					}
				}

				return rangeInterface;
			},
			getSelectedSection : function() {
				var values = this.getValues();
				for (var i in values) {
					if (values[i].selected) {
						return values[i];
					}
				}
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
    			onSectionClick : function() {},
          onSectionAdded : function() {}
    		};

    		options = $.extend(options, method);

			var dragging = false;
			var currentSectionData;

        /* Dragbar left */

		   	this.empty().on('mousedown', '.section-body, .dragbar-left', function(e){
		       e.preventDefault();

		       var $this = $(this);
		       var start_position = $this.parent().position().left;

		       currentSectionData = $this.parent().data('sectionData');

		       $this.parent().addClass('dragging');

		       	// if user just clicked then no need to run dragging code below
				$(document).on('mouseup', function() {
					$(document).unbind('mousemove');
				});

		       $(document).on('mousemove', function(e){
		       		dragging = true;

		       		if ($this.is('.dragbar-left')) {
                var offset = $(rangeInterface).offset();
                var currentPosition = e.pageX - offset.left;
                var currentItem = $this.parent().data('sectionData');

                var bounds = methods.getBounds(currentItem.id, currentItem.start, currentItem.stop);

		       			if (currentPosition > currentItem.stop - 10) {
		       				currentPosition = currentItem.stop - 10;
		       			}

                currentPosition = (currentPosition < bounds.min) ? bounds.min : currentPosition;

                methods.setValues({
   								id: currentItem.id,
   								start: currentPosition
   							});
		       		}
	       			// trigger the onChange event
					if (typeof options.onChange == 'function') {
						options.onChange.call(rangeInterface, e);
					}
		       });
		    })
			.on('mouseup', '.section-body, .dragbar-left', function(e) {
				if (!dragging) {
					// Clicked
					$('.section', rangeInterface).removeClass('selected');
					$(this).parent().addClass('selected');

					methods.selectSection($(this).parent().data('sectionData').id);

					// trigger the onSectionClick event
					if (typeof options.onSectionClick == 'function') {
						options.onSectionClick.call(rangeInterface, e, currentSectionData);
					}
				}
			});

      /* Dragbar right */

      this.empty().on('mousedown', '.section-body, .dragbar-right', function(e){
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

            if ($this.is('.dragbar-right')) {
              var width = e.pageX - $this.parent().offset().left;

              // Setup boundries
              if ($this.parent().position().left + width > rangeInterface.width()) {
                width = rangeInterface.width() - $this.parent().position().left;
              } else if (width < 10) {
                width = 10;
              }

              var bounds = methods.getBounds(currentSectionData.id, currentSectionData.start, currentSectionData.stop);

              width = (width + $this.parent().position().left > bounds.max) ? bounds.max - $this.parent().position().left : width;

              methods.setValues({
                        id: $this.parent().data('sectionData').id,
                        stop: $this.parent().position().left + width
                      });


            } else if ($this.is('.section-body')) {
              var left = e.pageX - start_position;

              // Setup boundries
              if (left < 0) {
                left = 0;

              } else if (left + $this.parent().width() > rangeInterface.width()) {
                left = rangeInterface.width() - $this.parent().width();
              }

              var bounds = methods.getBounds(currentSectionData.id, currentSectionData.start, currentSectionData.stop);

              if (left < bounds.min){
                left = bounds.min;
              }
              if (left + $this.parent().width() > bounds.max){
                left = bounds.max - $this.parent().width();
              }

              methods.setValues({
                      id: $this.parent().data('sectionData').id,
                      start: left,
                      stop: $this.parent().width() + left
                    });
            }

            // trigger the onChange event
        if (typeof options.onChange == 'function') {
          options.onChange.call(rangeInterface, e);
        }
         });
      })
      .on('mouseup', '.section-body, .dragbar-right', function(e) {
        if (!dragging) {
          // Clicked
          $('.section', rangeInterface).removeClass('selected');
          $(this).parent().addClass('selected');

          methods.selectSection($(this).parent().data('sectionData').id);

          // trigger the onSectionClick event
          if (typeof options.onSectionClick == 'function') {
            options.onSectionClick.call(rangeInterface, e, currentSectionData);
          }
        }
      })

      .on('mousedown', rangeInterface, function(event) {
          if(event.target != this) {
              return false;
          }

          var offset = $(this).offset();
          var clickPosition = event.pageX - offset.left;

          // Get values
          var values = methods.getValues();

          // Check if the user clicks inside a time frame already defined
          var isInValues = [];
          values.forEach(function(value) {
              if(clickPosition >= value.start && clickPosition <= value.stop) {
                  isInValues.push(value);
              }
          });

          if(!isInValues.length > 0) {

              var bounds = methods.getBounds(null, clickPosition, clickPosition + 1);
              var max = ((bounds.max - clickPosition) > 200) ? 200 : (bounds.max - clickPosition);

              // Set an incremental id
              var lastValue = (values.length > 0) ? values[values.length - 1].id : 0;
              methods.addSection();
              methods.setValues({
                  id: lastValue + 1,
                  start: clickPosition,
                  stop: clickPosition + max
              });
          }

          // trigger the onSectionAdded event
          if (typeof options.onSectionAdded == 'function') {
            options.onSectionAdded.call(rangeInterface, {
                id: lastValue + 1,
                start: clickPosition,
                stop: clickPosition + max
            });
          }
      });

			$(document).on('mouseup', function(e) {
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
