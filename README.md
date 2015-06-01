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
$('#range-interface').multipleRangeInterface();
```

##Methods
Methods can be called like so:

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