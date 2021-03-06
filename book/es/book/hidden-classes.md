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

```bash
➜ d8 --trace_opt hidden.js 
[marking 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> for recompilation, reason: small function, ICs with typeinfo: 2/2 (100%), generic ICs: 0/2 (0%)]
[didn't find optimized code in optimized code map for 0x21c6d66d1a89 <SharedFunctionInfo Hidden>]
[compiling method 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> using Crankshaft]
[optimizing 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> - took 0.386, 0.058, 0.072 ms]
[didn't find optimized code in optimized code map for 0x21c6d66d1a89 <SharedFunctionInfo Hidden>]
[completed optimizing 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)>]
[marking 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> for recompilation, reason: hot and stable, ICs with typeinfo: 7/20 (35%), generic ICs: 0/20 (0%)]
[didn't find optimized code in optimized code map for 0x21c6d66d18c1 <SharedFunctionInfo>]
[compiling method 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> using Crankshaft OSR]
[optimizing 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> - took 0.243, 0.383, 0.102 ms]
```

Analicemos lo anterior paso por paso:

* `marking 0x4c9b3bd1f19 <JS Function Hidden (SharedFunctionInfo 0x4c9b3bd1a89)> reason: small function`: v8 marca el objeto `Hidden` para recompilación. 
* `didn't find optimized code in optimized code map`: En este punto no hay ninguna "hidden class aún, pero V8 ha detectado que un objeto ha sido usado varias veces.
* `compiling method 0x705a23d1d81 using Crankshaft`: v8 concluye que no existe un mapa para este obejcto, asi que hace uso del compilador avanzado para crear un mapa de alto performance para usarlo como caché en el futuro.

Hasta este punto, V8 ha sido lo suficientemente inteligente para instanciar un objecto mucas veces, pero después de la iteración 8000 hasta la 8999 hemos echo un `monkeypatching` en algunas de sus instancias. Entonces es cuando pasa la **deoptimización**.

```
[evicting entry from optimizing code map (notify deoptimized) for 0x21c6d66d18c1 <SharedFunctionInfo> (osr ast id 90)]
trigger deopt
[evicting entry from optimizing code map (deoptimized code) for 0x21c6d66d1a89 <SharedFunctionInfo Hidden>]
[marking 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> for recompilation, reason: small function, ICs with typeinfo: 2/2 (100%), generic ICs: 0/2 (0%)]
[didn't find optimized code in optimized code map for 0x21c6d66d1a89 <SharedFunctionInfo Hidden>]
[compiling method 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> using Crankshaft]
[optimizing 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)> - took 0.015, 0.071, 0.034 ms]
[didn't find optimized code in optimized code map for 0x21c6d66d1a89 <SharedFunctionInfo Hidden>]
[completed optimizing 0x21c6d66d1f19 <JS Function Hidden (SharedFunctionInfo 0x21c6d66d1a89)>]
[marking 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> for recompilation, reason: hot and stable, ICs with typeinfo: 12/20 (60%), generic ICs: 0/20 (0%)]
[didn't find optimized code in optimized code map for 0x21c6d66d18c1 <SharedFunctionInfo>]
[compiling method 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> using Crankshaft OSR]
[optimizing 0x21c6d66d1e61 <JS Function (SharedFunctionInfo 0x21c6d66d18c1)> - took 0.145, 0.336, 0.062 ms]
```



