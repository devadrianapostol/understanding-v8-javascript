# Analizador \(Parser\)

### Qué es parseo?

El parseador toma el código fuente de Javascript y** construye estructuras de datos llamadas AST y los ámbitos basados en ellos**, después el generador de código de bytes va a través de esas estructuras y genera código de bytes, luego el mismo es interpretado por el interpretador \(interpreter\) y el compilador optimizado usa el código de bytes y lo convierte en lenguaje de máquina que es ejecutado directamente.

En este capítulo vamos a analizar la primera fase, el analizador \(o parseador\), como el código fuente es convertido en estructuras de datos y ver por etapas multiples escenarios de parseo.

### Analizador léxico \(Scaner\)

El analizador léxico o escaner es el primer paso del proceso donde el compilador convierte el código fuente en un programa. Son bloques de construcción de un programa, pequeños fragmentos como variables, punto y coma, parentesis, signos de puntuación y palabras clave.

![](../assets/tokens_v8.png)

En la imagen anterior se muestran una série de tokens, todos estas palabras estan definidas en el parseador tal como describe la especificación de Javascript. Un token es también llamado componente léxico que tiene un significado coherente. Un ejemplo seria los Puntuadores \(Puntuactors\) como se aprecia en la imagen anterior.

> tokens are the reserved words, identifiers, literals, and punctuators of the ECMAScript language

Según la especificación un token son: palabras reservadas `await, break, return`, [identificadores](https://mathias.html5.org/tests/javascript/identifiers/symbols.js) `$, _`, literales `null, true, false, 1, 2, 3`, y puntuadores `== != === !===`.

Veámos un ejemplo, en Javascript existen muchas [palabras clave](https://mathiasbynens.be/notes/reserved-keywords), el tokenizador

### Analizador Sintáctico \(Parser\)

El analizador sintáctico es un **proceso donde comprueba que los tokens forman una expresión permisible**, esta fase es completamente transparente para el desarrollador, pero no por eso debemos ignorar este paso, hoy en dia es una herramienta muy util que usamos en herramientas como `eslint`.

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

V8 es capaz de aplicar 2 tipos de análisis sintáctico al código fuente.

* Parser completo \(Full parsing\)
* Lazy Parser o Parseo Diferido

Analicemos el siguiente código fuente usando el argumento `--trace_parse` disponible con el comando `v8` o `d8` .

```
function innerFunction(message) {
    return "Now I say " + message + " !!!";
}

function fullParsed(message) {
    preParsedFunction(2, 5);
    return innerFunction("Hello " + message);
}

function preParsedFunction(a, b) {
    var length = 10;
    var update = [];
    for (var index = 0; index < length; index++) {
        update.push(a * b);
    }
    print("preParsedFunction");
    return update;
}

print(fullParsed("I am the full parsed function"));
```

Tengamos en cuenta que tenemos 3 métodos declarados, `innerFunction` , `fullParsed` y `preParsedFunction`.

Parsear el código toma tiempo, asi que los motores de Javacript tratan de evitar un parseo completo, en las siguientes secciones vamos analizar detalladamente algunos de los posibles escenarios más comunes.

#### Parser completo \(Full parsing\)

Un parseo completo es cuando el compilador se ve forzado a parsear todas las sentencias encontradas en el script. En el ejemplo anterior haremos uso de todas las funciones declaradas y veremos cual es el resultado.

> El parseo completo construye el Arbol Sintacto y es ~3x más lento

```
v8 parser.js --trace_parse
[parsing script: native harmony-regexp-exec.js - took 0.328 ms]
[parsing function: ImportNow - took 0.050 ms]
[parsing function: OverrideFunction - took 0.050 ms]
[parsing function: SetFunctionName - took 0.060 ms]
[parsing script: native harmony-species.js - took 0.110 ms]
[parsing function: get __proto__ - took 0.019 ms]
[parsing function: InstallGetter - took 0.059 ms]
[parsing script: native harmony-unicode-regexps.js - took 0.069 ms]
[parsing function: Import - took 0.016 ms]
[parsing script: native promise-extra.js - took 0.039 ms]
[parsing function: InstallFunctions - took 0.053 ms]
[parsing function: PostExperimentals - took 0.045 ms]
[parsing function:  - took 0.014 ms]
[parsing function:  - took 0.014 ms]
[parsing function:  - took 0.013 ms]
[parsing function: b.CreateDoubleResultArray - took 0.012 ms]
[parsing function: Float64Array - took 0.061 ms]
[parsing function: Float64ArrayConstructByLength - took 0.041 ms]
[parsing function: ToPositiveInteger - took 0.023 ms]
[parsing script: parser.js - took 0.061 ms]
[parsing function: fullParsed - took 0.016 ms]
[parsing function: preParsedFunction - took 0.026 ms]
preParsedFunction
[parsing function: innerFunction - took 0.015 ms]
Now I say Hello I am the full parsed function !!!
```

He querido mostrar todo la salida por motivos prácticos, pero ignoremos las primeras lineas y enfoquemonos en las últimas 3. Hemos forzado al compilador a parsear todo nuestro codigo y el tiempo de ejecución fue de `0.061 ms` .

#### Pre-parseo o Pre-Parser

Es muy probable que no todas las funciones en Javascript sean ejecutadas, o sean ejecutadas mas adelante por algun evento.

> El pre-parseo detecta errores de sintáxis, pero no resuelve el ámbito de las variables usadas en la función o generar AST, solo detecta la structura solamente y se limita donde estan los límites de las funciones.

Para demostar el pre-parseo, simplemente comentaremos la linea 6 `preParsedFunction(2, 5);`  y así el compilador pre-parseara según se espera difiriendo el análisis de su contenido cuando el compilador lo necesite \(lazy parsing\).

```
snippets/ch1/parser 
➜ v8 parser.js --trace_parse
....
[parsing script: parser.js - took 0.056 ms]
[parsing function: fullParsed - took 0.014 ms]
[parsing function: innerFunction - took 0.011 ms]
Now I say Hello I am the full parsed function !!!
```

La ejecución total ha sido de `0.056 ms` , `0.05ms`mas rápida que en el parseo completo, haciendo el parseo inicial mas rápido. Ese proceso se le llama **Pre-Parser **o pre-parseo. Esto hace que puede lleguar a ser hasta x3 veces mas rápido que ejecutando un parseo completo.

Un diferente escenario donde las funciones son completamente parseadas son las funciones anónimas \(IIFEs\).

```
function nestedFuntion(message) {

    let f1 = (function innerFunction3(message) {
      print("innerFunction3");
      return message;
    })();
    return 1;
  }

  print(nestedFuntion("I am the full parsed function"));
```

En el ejemplo anterior `innerFunction3` es una declaración de una funcion y se asigna a la variable `f1` pero jamas es invocada. Debido a una especial heurística de V8 **todas las funciones anónimas son siempre parseadas.**

### Lazy Parsing \(Parseo Diferido\)

La mayoría de los motores de Javascript tienen la habilidad de diferir el proceso de parseo de una función hasta que es completamente necesaria.

```
function sum(a, b) {
    return a + b;
}

function subs(a, b) {
    return a - b;
} 

print(sum(1,2));
```

En el ejemplo anterior tenemos dos declaraciones, `sum`  y `subs` pero solo `sum` es invocada en el ultimo paso.

Como el parseador interpreta lo anterior es lo que vamos a describir a continuación:

1. La función `sum` es declarada. Acepta argumentos `a` y `b` y retorna una suma de los mismos.
2. La función subs es declarada. Acepta argumentos `a` y `b` y retorna una resta de los mismos.
3. Ejecutamos la funcion `sum` con los argumentos `1` y `2` .

Aquí el motor no analiza en profundidad el contenido de cada sentencia y difiere su analisis interno para cuando lo necesite.

La ultima sentencia cambia las cosas porque invocamos la función.`print(sum(1,2));` y entonces el compilador procesa el contenido de la funcion `sum` .

El pareador diferido necesita parsear el código interno de la función `add` antes de su ejecución para localizar el cuerpo entero de la función, solo se consume el código, no genera AST, esto significa que se obtiene cierto grado de optimización en el sistema evitando consumo de memoria y mejorando la velocidad de ejecución.





