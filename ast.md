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


![](/assets/ast.png)



