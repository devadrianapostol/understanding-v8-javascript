# Hidden Classes

Is the internal notion of types of V8, the JS engine uses then in order to create a internal structure to organize your objects.

#### What's a Hidden Class?

It's a **group of objects with the same structure**, as you adding properties to objects, V8 will be looking at on each object and map that bundle of properties to a hidden class which defines an object with exactly these properties.

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
As you can observe, we have created 2 literal objects, which they should share the same map, but, in the moment we modify the object `a` with the assignment `a.z = 1` V8 creates a new map to fit the new object layout.

#### Why we should be aware of this ?

This is really important, a **Object’s hidden class changes as new properties are being added to it**. Javascript is dynamically-typed laguage that makes things really complicated for the Javascript Engine, the code is not compiled in advanced like Java or C++ and it's compiled in runtime (JIT).

In short tha main reason why hidden classes exist:

- No types in Javascript
- Compilation is part of the execution time

When the hidden classes changes, or the heuristic of the hidden clases are not longer valid, it happens a **depotimization**.










