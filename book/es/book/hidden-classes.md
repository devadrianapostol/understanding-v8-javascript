# Hidden Classes

Es la noción interna de tipado de V8, el motor de Javascript con el fin de crear una estructura interna para organizar tus objectos.

#### Qué es una Hidden Class?

Es un **grupo de objectos con la misma estructura**, según vayas agregando propiedades a tus objectos, V8 ira verificando cada objecto y mapeará el manojo de propiedades a una hidden class cual define un objecto exactamente con esas propiedades.

Vamos a ver el siguiente ejemplo donde tenemos dos objetos literales, `a` y `b`.

```javascript
var a = {};
a.x = 8;
a.y = 8;

var b = {};
b.x = 3;
b.y = 9;

print(%HaveSameMap(a,b));
a.z = 1;
print(%HaveSameMap(a,b));
```

El resultado para lo siguiente seria.

```javascript
$> d8 --allow_natives_syntax native_syntax.js 
true
false
```

Como puedes observar, hemos creado dos objetos literales, los cuales comparte el mismo mapa, pero, en el momento donde nosotros modificamos el objecto `a` con la asignación `a.z = 1` V8 crea un nuevo mapa para adaptarse a la nueva disposición del objeto.

En el ejemplo anterior, el argumento `--allow_natives_syntax`  permite sintaxis nativa dentro de tu script de Javascript, `%HaveSameMap` es un método nativo de **C++ **que retorna un \_booleano \_si dos objetos comparten el mismo mapa \(hidden class\).** **

##### Porque deberiamos ser consciente de esto?

Lo que es realmente importante es, un "**hidden class" de un objecto cambia según nuevas propiedades se van asignando. **Javascript es un lenguaje dinamicamente tipado y hace las cosas realmente complicadas para el motor de Javascript, el codigo no es compilado como en Java o C++, es compilado en tiempo de ejecución \(JIT\) y el **propósito de las las hidden classes es optimizar el tiempo acceso a la propiedad.**

En otras palabras, la razón porque una "hidden class" existe es:

* No existen tipos en Javascript
* El tiempo de compilación es en tiempo de ejecución

Cuando las "hidden classes" cambian o la heurística de la "hidden class" ya no es validad, sucede una **deoptimización.**

#### Probando una deoptimización \(deopt\)

Vamos a imaginar que tenemos el siguiente código:

```js
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
```

Como puedes observar, tenemos una clase llamado `Hidden`y que tiene 2 parámetros. En el ejemplo estamos iterando `Hidden` varias veces pero en medio del proceso hacemos algo de `monkeypatching` y agregamos un par de propiedades a nuestra instancia del objeto `Hidden`.



