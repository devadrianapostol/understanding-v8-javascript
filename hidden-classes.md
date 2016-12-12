# Hidden Classes

Is the internal notion of types of V8, the JS engine uses then in order to create a internal structure to organize your objects.

#### What's a Hidden Class?

It's a group of objects with the same structure, as you adding properties to objects, V8 will be looking at on each object and map that bundle of properties to a hidden class which defines an object with exactly these properties.

Let's see the following example, we have 2 literal objects, `a` and `b`. 

`````javascript
var a = {};
a.x = 8;
a.y = 8;

var b = {};
b.x = 3;
b.y = 9;

print(%HaveSameMap(a,b));
a.z = 1;
print(%HaveSameMap(a,b));
`````
The result of the following 
````bash
$> d8 --allow_natives_syntax native_syntax.js 
true
false
````
As you can observe, we have created 2 literal objects, which they should share the same map, but, in the moment we modify the object `a` with the assignment `a.z = 1` V8 creates a new map.