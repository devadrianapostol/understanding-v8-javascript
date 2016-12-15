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

In the example above, `--allow_natives_syntax` arguments allows allow natives syntax within your js file, `%HaveSameMap` is a native C++ method that returns a boolean if two object share the same map (hidden class).

#### Why we should be aware of this ?

This is really important, a **Object’s hidden class changes as new properties are being added to it**. Javascript is dynamically-typed laguage that makes things really complicated for the Javascript Engine, the code is not compiled in advanced like Java or C++ and it's compiled in executionn time (JIT) and **the purpose of the hidden classes is to optimize property access time**.

In short tha main reason why hidden classes exist:

- No types in Javascript
- Compilation is part of the execution time

When the hidden classes changes, or the heuristic of the hidden clases are not longer valid, it happens a **depotimization**.

#### Proving the Hidden Class Deopt

Let's imagine we have the following code:

````javascript
function Hidden(a, b) {
  this.a = a;
  this.b = b;
}

Hidden.prototype = {
  fancyFunction : function() { return this.x; }
}

for(let i = 0; i< 10000; i++) {
  let h = new Hidden(i, i + 1);
  if( i > 80 < 90  ) {
    h.fancyMethod = 4;
  }
} 
````
As you can see, we have a constructor called `Hidden` and accepts 2 parameters. We iterate Hidden several times but in the middle of the way we do some `monkeypatching` and we add a new property in a couple our `Hidden` instance.

What's gonna happen here? Easy, `V8` is going to create a Hidden class because the object is intensivelly used `hot` optimized such object. 

````bash
d8 --trace_opt hidden.js  
[marking 0x705a23d1d81 <JS Function Hidden (SharedFunctionInfo 0x705a23d1a09)> for recompilation, reason: small function, ICs with typeinfo: 2/2 (100%), generic ICs: 0/2 (0%)]
[didn't find optimized code in optimized code map for 0x705a23d1a09 <SharedFunctionInfo Hidden>]
[compiling method 0x705a23d1d81 <JS Function Hidden (SharedFunctionInfo 0x705a23d1a09)> using Crankshaft]
[optimizing 0x705a23d1d81 <JS Function Hidden (SharedFunctionInfo 0x705a23d1a09)> - took 0.045, 0.073, 0.053 ms]
````
Let's analise the previous output:








