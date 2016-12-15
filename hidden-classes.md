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

for(let i = 0; i< 100000; i++) {
  let h = new Hidden(i, i);
  if( i > 8000 && i < 9000  ) {     
    if (!Hidden.prototype.deoptMethod) {
      print('trigger deopt');   
      Hidden.prototype.deoptMethod = function(){}
    }
  }
} 
````
As you can see, we have a constructor called `Hidden` and accepts 2 parameters. We iterate Hidden several times but in the middle of the way we do some `monkeypatching` and we add a new property in a couple our `Hidden` object.

What's gonna happen here? Easy, `V8` is going to create a Hidden class because the object is intensivelly used `hot` optimized such object. 

````bash
d8 --trace_opt hidden.js  
[marking 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> for recompilation, reason: small function, ICs with typeinfo: 2/2 (100%), generic ICs: 0/2 (0%)]
[didn't find optimized code in optimized code map for 0x4c9b3bd1a89 <SharedFunctionInfo Hidden>]
[compiling method 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> using Crankshaft]
[optimizing 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> - took 0.039, 0.113, 0.069 ms]
[didn't find optimized code in optimized code map for 0x4c9b3bd1a89 <SharedFunctionInfo Hidden>]
[completed optimizing 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)>]
[marking 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> for recompilation, reason: hot and stable, ICs with typeinfo: 7/20 (35%), generic ICs: 0/20 (0%)]
[didn't find optimized code in optimized code map for 0x4c9b3bd18c1 <SharedFunctionInfo>]
[compiling method 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> using Crankshaft OSR]
[optimizing 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> - took 0.201, 0.423, 0.096 ms]
````
Let's analise the previous outcome:

* `marking 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> reason: small function`: v8 marks the `Hidden` object  for recompilation. 
* `didn't find optimized code in optimized code map`: At this point there isn't any hidden class, but v8 has dettected the object has been used several times.
* `compiling method 0x705a23d1d81 using Crankshaft`: v8 concludes there isn't a map for this object and uses the **optimized** compiler to create a high performance map for future use caching it.

At this point V8 is has been smart enough to detect our object is being instanciated several times, but, after the 8000 until 8999 instance we made a nasty `monkeypatching` in some of our instances. Then it happens a **depotimization**.

````bash
[deoptimizing (DEOPT soft): begin 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> (opt #1) @10, FP to SP delta: 88, caller sp: 0x7fff51adece0]
            ;;; deoptimize at 208: Insufficient type feedback for combined type of binary operation
  reading input frame  => node=262, args=1, height=8; inputs:
      0: 0x4c9b3bd1e61 ; [fp - 16] 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)>
      1: 0xe6091004e31 ; rsi 0xe6091004e31 <JS Global Object>
      2: 0x4c9b3babc59 ; rcx 0x4c9b3babc59 <FixedArray[173]>
      3: 0xe609105e239 ; r9 0xe609105e239 <a Hidden with map 0xddb060d419>
      4: 0x1f4100000000 ; rdi 8001
      5: 0x4c9b3b04301 ; (literal 3) 0x4c9b3b04301 <undefined>
      6: 0x4c9b3b06559 ; (literal 7) 0x4c9b3b06559 <Odd Oddball>
      7: 0 ; rbx 
      8: 0x4c9b3b06559 ; (literal 7) 0x4c9b3b06559 <Odd Oddball>
      9: 0x4c9b3b04301 ; (literal 3) 0x4c9b3b04301 <undefined>
  translating frame  => node=262, height=56
    0x7fff51adecd8: [top + 88] <- 0xe6091004e31 ;  0xe6091004e31 <JS Global Object>  (input #1)
    0x7fff51adecd0: [top + 80] <- 0x180c5683bb83 ;  caller's pc
    0x7fff51adecc8: [top + 72] <- 0x7fff51adecf8 ;  caller's fp
    0x7fff51adecc0: [top + 64] <- 0x4c9b3babc59 ;  context    0x4c9b3babc59 <FixedArray[173]>  (input #2)
    0x7fff51adecb8: [top + 56] <- 0x4c9b3bd1e61 ;  function    0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)>  (input #0)
    0x7fff51adecb0: [top + 48] <- 0xe609105e239 ;  0xe609105e239 <a Hidden with map 0xddb060d419>  (input #3)
    0x7fff51adeca8: [top + 40] <- 0x1f4100000000 ;  8001  (input #4)
    0x7fff51adeca0: [top + 32] <- 0x4c9b3b04301 ;  0x4c9b3b04301 <undefined>  (input #5)
    0x7fff51adec98: [top + 24] <- 0x4c9b3b06559 ;  0x4c9b3b06559 <Odd Oddball>  (input #6)
    0x7fff51adec90: [top + 16] <- 0x00000000 ;  0  (input #7)
    0x7fff51adec88: [top + 8] <- 0x4c9b3b06559 ;  0x4c9b3b06559 <Odd Oddball>  (input #8)
    0x7fff51adec80: [top + 0] <- 0x4c9b3b04301 ;  0x4c9b3b04301 <undefined>  (input #9)
[deoptimizing (soft): end 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> @10 => node=262, pc=0x180c568424ff, caller sp=0x7fff51adece0, state=NO_REGISTERS, took 0.098 ms]
[removing optimized code for: ]
[evicting entry from optimizing code map (notify deoptimized) for 0x4c9b3bd18c1 <SharedFunctionInfo> (osr ast id 90)]
trigger deopt
[marking dependent code 0x180c56843241 (opt #0) for deoptimization, reason: prototype-check]
[marking dependent code 0x180c56843e01 (opt #1) for deoptimization, reason: prototype-check]
[deoptimize marked code in all contexts]
[deoptimizer unlinked: Hidden / 4c9b3bd1f19]
[evicting entry from optimizing code map (deoptimized code) for 0x4c9b3bd1a89 <SharedFunctionInfo Hidden>]
[marking 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> for recompilation, reason: small function, ICs with typeinfo: 2/2 (100%), generic ICs: 0/2 (0%)]
[didn't find optimized code in optimized code map for 0x4c9b3bd1a89 <SharedFunctionInfo Hidden>]
[compiling method 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> using Crankshaft]
[optimizing 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> - took 0.010, 0.078, 0.017 ms]
[didn't find optimized code in optimized code map for 0x4c9b3bd1a89 <SharedFunctionInfo Hidden>]
[completed optimizing 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)>]
[marking 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> for recompilation, reason: hot and stable, ICs with typeinfo: 12/20 (60%), generic ICs: 0/20 (0%)]
[didn't find optimized code in optimized code map for 0x4c9b3bd18c1 <SharedFunctionInfo>]
[compiling method 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> using Crankshaft OSR]
[optimizing 0x4c9b3bd1e61 <JS Function (SharedFunctionInfo 0x4c9b3bd18c1)> - took 0.095, 0.305, 0.061 ms]
````





