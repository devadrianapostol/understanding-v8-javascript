# Abstract Syntax Tree

#### What is an Abstract syntax tree?

Abstract syntax trees (AST) are data structures widely used in compilers, due to their property of representing the structure of program code. An AST is usually the result of the syntax analysis phase of a compiler.

Exactly, the result of a syntax analysis. Futhermore, how this can be apply to Javascript is what we are going to discover now. But AST is not only used strictly with Javascript environments such Node.js or the Web Browser, everything started on Java world long time ago, with Netscape.

### Javascript Compilers and Engines

**Rhino** (javascript engine) was born as part of Nestcape project as Javascript interpreter, then it becomes open source under the hood of **Mozilla**. Rhino is mainly a converter from Javascript to Java classes, but, aside of that it has different uses, like as interpreter, then is when AST becomes important in our story.

**AST** is the core of Rhino, and deeply used (forked mostly) Google Closure and YUI Compressor, both use the Java parser internally to analyse, parse and mangle the Javascript code.

Spidermonkey has his own AST implementation and is documented as Parse API, and also it [seems Rhino has his own AST implementation](http://ramkulkarni.com/blog/understanding-ast-created-by-mozilla-rhino-parser/) as well and this changes based on the JS version and those specific javascript engines might change.

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
In AST **all is a Node**, any element extend from it and search for a specific node we will need to loop the whole tree and search exactly what we need. For instance, if our target were to replace “a” variable by “b” then we are going to need some tools to modify, travel through and remove or add our original code.