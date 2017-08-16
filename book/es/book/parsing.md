# Analizador \(Parser\)

Es el paso inicial donde el el explorador recibe un puñado de texto que nostros llamamos Javascript, pero para el es solo texto sin sentido. En esta seción vamos a analizar los primeros pasos de un largo proceso.

### Tokenizer

Es el proceso donde V8 separa el Tokens donde el motor convertira posteriormente a Sintaxis Abstracta o AST. ![](/assets/tokens_v8.png)Como puedes observar internamente todos los Token están registrados de acuerdo  a la [especificación](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-punctuators) ECMASCRIPT-262. Eso hace que el tokenizador entienda el código que esta tratando de parsear.

### Parseo Básico

V8 no ofrece un API externo para imprimir AST, pero si **spidermonkey**, en el siguiente ejemplo

```
function parser(x,y) { 
   return x + y
}
```

Ahora vamos hacer uso del Parser API para mostrar cual seria el resultado de una simple declaración anterior:

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

Como puedes observar el resultado de una simple expresión denota en una gran cantidad de datos con un significado especifico.

