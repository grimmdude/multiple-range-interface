Multiple Range Interface
===============

Multiple Range Interface is a jQuery plugin that creates an interface that allows the user to set multiple range based values.  
It's useful for interacting with timeline based data like videos, slideshows, music, etc.

##Usage
HTML:
```html
<div id="range-interface"></div>
```

JS:
```js
$('#range-interface').multipleRangeInterface({
	onChange: function() {
		// Do stuff when the interface is changed
	},
	onSectionClick: function() {
		// Do stuff when a section is clicked
	}
});
```

##Methods
After the interface is initialized methods can be called on it like so:

```js
$('#range-interface').multipleRangeInterface('methodName', options);
```
###addSection
Adds a new range section.
```js
$('#range-interface').multipleRangeInterface('addSection', {color: '#DDDDDD'});
```
###deleteSection
Deletes a range section by id.
```js
$('#range-interface').multipleRangeInterface('deleteSection', id);
```
###getValues
Gets values for all range sections.
```js
$('#range-interface').multipleRangeInterface('getValues');
```
###setValues
Sets values for given section id.  The `id` field must be present in the parameters object.
```js
$('#range-interface').multipleRangeInterface('getValues' {id: 1, start: 20, stop: 44});
```

##Browser Support
The following browsers are what I've tested:
* Chrome
* Firefox
* Opera
If you find the plugin works in other browsers please let me know and I'll add it to the list.  Likewise if it doesn't work in certain browsers please let me know.