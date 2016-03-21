DVERIFY
=======
Javascript for parsing elements in JSON format and manipulate the elements by changing the values in JSON

### Dependencies
none

### Install
at the head tag
```javascript
<script src="dverify.js"></script>
```
Create an object after document.body ready
```javascript
    dveri=new dverify(function(obj){
		console.log("ready");
	});
```
* In forms add attribute "dverify-form" with form name
* On each form element add tag "field" that represents the field name, 
radio elements have the same value for field attribute 

### USE
DOM of dverified forms and elements in it
```javascript
dveri.elements
```
JSON data of dverified forms and elements in it
```javascript
dveri.data
```

Read value in element fom JSON
```javascript
console.log("element have value: ",dveri.data[form][field]);
```
Change value in element by JSON
```javascript
dveri.data[form][field]="new value";
```

### Event listeners
When dverify is ready
```javascript
document.addEventListener("dverifyReady", function(e){
    console.log("dverifyReady and all forms are parsed")
});
```
When dom element is changed by changing JSON value
```javascript
element.addEventListener("dverified", function(e){
    console.log("Element now have new value")
});
```