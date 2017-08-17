# Analizador \(Parser\)

El Analizador \(Parser\) es el proceso donde V8 separa en **tokens** el texto donde el motor convertira posteriormente a Sintaxis Abstracta o AST.

### Analizador léxico \(Scaner\)

El analizador léxico o escaner es el primer paso del proceso donde el compilador convierte el código fuente en un programa. Son bloques de construcción de un programa, pequeños fragmentos como variables, punto y coma, parentesis, signos de puntuación y palabras clave.

![](../assets/tokens_v8.png)

En la imagen anterior se muestran una série de tokens, todos estas palabras estan definidas en el parseador tal como describe la especificación de Javascript. Un token es también llamado componente léxico que tiene un significado coherente. Un ejemplo seria los Puntuadores \(Puntuactors\) como se aprecia en la imagen anterior.

> tokens are the reserved words, identifiers, literals, and punctuators of the ECMAScript language

Según la especificación un token son: palabras reservadas `await, break, return`, [identificadores](https://mathias.html5.org/tests/javascript/identifiers/symbols.js) `$, _`, literales `null, true, false, 1, 2, 3`, y puntuadores `== != === !===`.

Veámos un ejemplo, en Javascript existen muchas [palabras clave](https://mathiasbynens.be/notes/reserved-keywords), el tokenizador

### Analizador Sintáctico \(Parser\)

El analizador sintáctico es un proceso completamente transparente para el desarrollador, pero no por eso debemos ignorar este paso, hoy en dia es una herramienta muy util que usamos en herramientas como `eslint`.

#### SpiderMonkey Parser API

Desafortunadamente **V8** no ofrece un API externo para imprimir AST, pero **spidermonkey **sí nos ofrece un API que podemos usar en modo de demostración. En el siguiente ejemplo vamos a mostrar el arbol sintactico generado por el parseador.

```
function parser(x,y) { 
   return x + y
}
```

Desde la terminal hacémos uso del la funcion `Reflect.parse("foo")` donde el unico argumento que acepta el código que deseamos analizar y retorna un grupo de objectos que representan cada nodo del Arbol Sintáctico.

```
js> Reflect.parse("function parser(x,y) { return x + y }");

({loc:{start:{line:1, column:0}, end:{line:1, column:37}, source:null}, 
type:"Program", body:[{loc:{start:{line:1, column:9}, end:{line:1, column:37}, source:null}, 
type:"FunctionDeclaration", id:{loc:null, 
type:"Identifier", name:"parser"}, params:[{loc:{start:{line:1, column:16}, end:{line:1, column:17}, source:null}, 
type:"Identifier", name:"x"}, {loc:{start:{line:1, column:18}, end:{line:1, column:19}, source:null},
type:"Identifier", name:"y"}], body:{loc:{start:{line:1, column:21}, end:{line:1, column:35}, source:null}, 
type:"BlockStatement", body:[{loc:{start:{line:1, column:23}, end:{line:1, column:35}, source:null}, 
type:"ReturnStatement", argument:{loc:{start:{line:1, column:30}, end:{line:1, column:35}, source:null}, 
type:"BinaryExpression", operator:"+", left:{loc:{start:{line:1, column:30}, end:{line:1, column:31}, source:null}, 
type:"Identifier", name:"x"}, right:{loc:{start:{line:1, column:34}, end:{line:1, column:35}, source:null}, 
type:"Identifier", name:"y"}}}]}, generator:false, expression:false}]})
```

Vamos con un segundo ejemplo, `const a = 4;`

```
js> Reflect.parse("const a = 4;");
({loc:{start:{line:1, column:0}, end:{line:1, column:12}, source:null}, 
type:"Program", body:[{loc:{start:{line:1, column:0}, end:{line:1, column:11}, source:null}, 
type:"VariableDeclaration", kind:"const", declarations:[{loc:{start:{line:1, column:6}, end:{line:1, column:11}, source:null}, 
type:"VariableDeclarator", id:{loc:{start:{line:1, column:6}, end:{line:1, column:11}, source:null}, 
type:"Identifier", name:"a"}, init:{loc:{start:{line:1, column:10}, end:{line:1, column:11}, source:null}, 
type:"Literal", value:4}}]}]})
```

### Tipos de Parsing

V8 tiene 2 tipos de parseo:

* Parser completo \(Full parser\)
* Lazy Parser o Parseo Diferido

Analicemos el siguiente código fuente,

```
function innerFunction(message) {
	return "Now I say " + message + " !!!";
}

function fullParsed(message) {
	return innerFunction("Hello " + message);
}

function preParsedFunction() {
	print("preParsedFunction");
}

print(fullParsed("I am the full parsed function"));
```

Tenemos 3 funciones, `innerFunction` , `fullParsed` y `preParsedFunction`. Vamos a ejectuar lo anterior en el motor V8.

```
snippets/ch1/parser 
➜ v8 parser.js --trace_parse
[parsing script: native harmony-regexp-exec.js - took 1.265 ms]
[parsing function: ImportNow - took 0.360 ms]
[parsing function: OverrideFunction - took 0.077 ms]
[parsing function: SetFunctionName - took 0.068 ms]
[parsing script: native harmony-species.js - took 0.118 ms]
[parsing function: get __proto__ - took 0.053 ms]
[parsing function: InstallGetter - took 0.043 ms]
[parsing script: native harmony-unicode-regexps.js - took 0.084 ms]
[parsing function: Import - took 0.026 ms]
[parsing script: native promise-extra.js - took 0.105 ms]
[parsing function: InstallFunctions - took 0.055 ms]
[parsing function: PostExperimentals - took 0.105 ms]
[parsing function:  - took 0.025 ms]
[parsing function:  - took 0.020 ms]
[parsing function:  - took 0.016 ms]
[parsing function: b.CreateDoubleResultArray - took 0.449 ms]
[parsing function: Float64Array - took 0.404 ms]
[parsing function: Float64ArrayConstructByLength - took 0.048 ms]
[parsing function: ToPositiveInteger - took 0.041 ms]
[parsing script: parser.js - took 0.050 ms]
[parsing function: fullParsed - took 0.018 ms]
[parsing function: hiPeople - took 0.012 ms]
Now I say Hello I am the full parsed function !!!
```

Ignoremos las primeras lineas y enfoquemonos en las últimas 3 líneas. 

```
[parsing script: parser.js - took 0.050 ms]
[parsing function: fullParsed - took 0.018 ms]
[parsing function: hiPeople - took 0.012 ms]
Now I say Hello I am the full parsed function !!!
```



