# Abstract Syntax Tree

#### What is an Abstract syntax tree?

Abstract syntax trees (AST) are data structures widely used in compilers, due to their property of representing the structure of program code. An AST is usually **the result of the syntax analysis phase of a compiler.**

Futhermore, how this can be apply to Javascript is what we are going to discover now. But AST is not only used strictly with Javascript environments such Node.js or the Web Browser, everything started on Java world long time ago, with Netscape.

### AST and Compilers

// TODO

### The history of AST outside of Compilers

**Rhino** (javascript engine) was born as part of Nestcape project as Javascript interpreter, then it becomes open source under the hood of **Mozilla**. Rhino is mainly a converter from Javascript to Java classes, but, aside of that it has different uses, like as interpreter, then is when AST becomes important in our story.

**AST** is the core of Rhino, deeply used (forked mostly) Google Closure and YUI Compressor, both use the Java parser internally to analyse, parse and mangle the Javascript code.

Spidermonkey has his own AST implementation and is documented as Parse API. Futhermore, [Rhino has his own AST implementation](http://ramkulkarni.com/blog/understanding-ast-created-by-mozilla-rhino-parser/) as well and this changes based on the JS version and those specific javascript engines might change.

To solve these inconsistencies, not that far way, it started the confluence of these differences on the ESTree organisation, creating  [the first AST common specification](https://github.com/estree/estree). 

Now, we'll see a small overview about how AST becomes and where is used and how to use for our own benefit in the near future.

### Static Analysis of Javascript Statements

The static analysis has multiple benefits, like for instance:

* replace double quotes by single quotes
* Display the coverage of your javascript files based on your unit test.

The static analysis has multiple benefits, like [replace double quotes by single quotes](http://ariya.ofilabs.com/2012/02/from-double-quotes-to-single-quotes.html) or [display the coverage](https://github.com/gotwarlost/istanbul#api) of your javascript files based on your unit test.


![](/assets/ast.png)

Let’s analyse a basic example:

The following code represente a sentenence variable declaration.

````
var a;
````
The whole block represents a [VariableDeclaration](https://github.com/estree/estree/blob/master/es2015.md#variabledeclaration), it what it is. The **VariableDeclaration** is the “var” keyword, inside of this node we will found the **Identifier** which represents the `a`. The tree view visualize walk thought our small sentence in a syntax way.

````json
{
  "type": "Program",
  "start": 0,
  "end": 6,
  "range": [
    0,
    6
  ],
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 6,
      "range": [
        0,
        6
      ],
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 5,
          "range": [
            4,
            5
          ],
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "range": [
              4,
              5
            ],
            "name": "a"
          },
          "init": null
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
````
In AST **all is a Node**, any element extend from it and search for a specific node we will need to loop the whole tree and search exactly what we need. For instance, if our target were to replace `a` variable by `b` then we are going to need some tools to modify, travel through and remove or add our original code.


## Javascript Tooling

AST can be malleable, we can transform it, replace and even remove nodes.

### Parsers

The following parsers are fully compatible with the ESTree spec and probably the most two popular ones.

#### Esprima

Esprima is the most popular parsed, heavily used on thousands of projects, probably the most important I know is Istanbul code coverage.

````javascript
// esprima
var ast = esprima.parse("var foo = 'bar';");
// acorn
var ast = acorn.parse('var a;', {
    // collect ranges for each node
    ranges: true
});
````

#### Acorn

Acorn claims to be faster, smaller and prettiest than Esprima. Personally I haven’t tried with it, but it’s the core of ASTExplorer and it seems to be quite good, I haven’t worked with this one personally but I’ll leave here the reference.

Whether Esprima or acorn, both do the work, and they do it very well. Up to you to choose.

### Going throught the AST

#### Estraverse

Once we have our code in AST mode, we can loop the whole tree an change whatever we want. Estraverse is a tool to iterate through the tree and modify, skip or remove nodes. In the following example we are going to replace and long name Identifier by a short one.

`````javascript
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var ast = require('./ast');
var a = ast.esprimaAST();
// 'function bar(){ var longVariable; console.log("foo", longVariable);}'
estraverse.traverse(a, {
    enter: function (node, parent) {
        if (node.type == 'Identifier' && node.name == 'longVariable') {
            console.log(node);
            node.name = 'b';
            return node;
        }
    }
});
var js = escodegen.generate(a);
console.log(js);
// output
// function bar() {
//    var b;
//    console.log('foo', b);
// }
`````


#### Escodegen

Convert back the AST to code it’s possible with escodegen, after any transformation if the AST still valid will become Javascript again like we saw in the previous example.

`````javascript
var escodegen = require('escodegen');
var js = escodegen.generate({
    "type": "VariableDeclaration",
    "start": 0,
    "end": 6,
    "range": [
        0,
        6
    ],
    "declarations": [
        {
            "type": "VariableDeclarator",
            "start": 4,
            "end": 5,
            "range": [
                4,
                5
            ],
            "id": {
                "type": "Identifier",
                "start": 4,
                "end": 5,
                "range": [
                    4,
                    5
                ],
                "name": "a"
            },
            "init": null
        }
    ],
    "kind": "var"
});
//output: var a;
`````

#### Escope

It takes an Esprima syntax tree and returns the analyzed scopes. It allows us, eg: go to an specific scope and do some transformations, detect all variables in the scipe and their references to other parts of the code, detect child scopes, get function parameters, etc etc.

![](/assets/Screen-Shot-2016-03-20-at-18.21.33.png)

You can practice in this [demo page.](http://mazurov.github.io/escope-demo/)

#### Esrefactor

Esrefactor is a tool to locate any identifier in your code, this is very useful if we would want to rename any variable or function.


``````javascript
var esrefactor = require('esrefactor');
var code = require('./ast');
// function bar(){ var a; console.log("foo", a);}
var ctx = new esrefactor.Context(code.codeVariable);
var id = ctx.identify(21);
console.log("id", id);
//id { identifier: { type: 'Identifier', name: 'a', range: [ 20, 21 ] },
//  declaration: { type: 'Identifier', name: 'a', range: [ 20, 21 ] },
//  references: [ { type: 'Identifier', name: 'a', range: [Object] } ] }
``````

The current version (on npm) it doesn’t have this [patch](https://github.com/ariya/esrefactor/pull/9), so, I managed only to rename variables.

#### Esmangle

Esmangle is a small minifier, one of many ECMAScript tools, this one in particular is has a interesting set of parameters to change the behaviour.

``````javascript
var esprima = require('esprima');
var esmangle = require('esmangle');
var escodegen = require('escodegen');
var codeBase = require('./code');
var ast = esprima.parse(codeBase.wholeFile());
var result = esmangle.mangle(ast);  // gets mangled result
console.log(escodegen.generate(result, {
    format: {
        renumber: true,
        hexadecimal: true,
        escapeless: true,
        compact: true,
        semicolons: false,
        parentheses: false
    }
}));  
// !function(){function a(e,f){var b,a,c,d;a=e.length;c=0;while(a){b=a>>>1;d=c+b;if(f(e[d])){a=b}else{c=d+1;a-=b+1}}return c}var b=a([2,3,5,7,11,13,17,19,23,29,31,37],function(a){return a>25})}()
``````

#### AST-Types

Esprima has actually an [object accessible to compare node by Syntax type](https://github.com/jquery/esprima/blob/master/src/syntax.ts), this alternative is more suitable for Unit Testing.

`````javascript
var assert = require("assert");
var n = require("ast-types").namedTypes;
var b = require("ast-types").builders;
var fooId = b.identifier("foo");
var ifFoo = b.ifStatement(fooId, b.blockStatement([
    b.expressionStatement(b.callExpression(fooId, []))
]));
assert.ok(n.IfStatement.check(ifFoo));
assert.ok(n.Statement.check(ifFoo));
assert.ok(n.Node.check(ifFoo));
assert.ok(n.BlockStatement.check(ifFoo.consequent));
assert.strictEqual(
    ifFoo.consequent.body[0].expression.arguments.length,
    0);
assert.strictEqual(ifFoo.test, fooId);
assert.ok(n.Expression.check(ifFoo.test));
assert.ok(n.Identifier.check(ifFoo.test));
assert.ok(!n.Statement.check(ifFoo.test));
`````
#### Harmony (ES6)

Before Esprima supported ES6 and RxJS syntax in the after the version 2.0, there was a fork by facebook called esprima-fb. Actually is not necessary.

### AST Explorer

The AST explorer where you can convert automatically your source code to AST and traverse it in a nice user interfance.

[http://astexplorer.net/](http://astexplorer.net/)


