---
title: 'Mejores Prácticas en JavaScript Moderno'
description: ''
pubDate: 'Nov 29 2024'
heroImage: '/blog/placheholder-blog-solid.jpg'
author: 'Juan Beresiarte'
---

JavaScript es, sin duda, el lenguaje de programación más utilizado en el mundo y tiene una enorme influencia en una de las tecnologías más importantes de nuestra vida diaria: internet. Con este poder viene una gran responsabilidad, y el ecosistema de JavaScript ha estado evolucionando rápidamente, haciendo difícil mantenerse al día con las mejores prácticas.

En este artículo, exploraremos algunas de las principales mejores prácticas en JavaScript moderno para escribir un código más limpio, mantenible y eficiente.

---

## 1. Las reglas del proyecto son lo más importante

Cada proyecto puede tener reglas específicas para mantener la coherencia del código. Estas reglas siempre tendrán prioridad sobre cualquier recomendación externa, incluso sobre las de este artículo. Antes de implementar una práctica en un proyecto, asegúrate de que esté alineada con las reglas establecidas y que todos los miembros del equipo estén de acuerdo.

---

## 2. Usa JavaScript actualizado

JavaScript ha evolucionado enormemente desde su creación en 1995. Muchas prácticas antiguas que encuentras en internet pueden estar desactualizadas. Antes de implementar una técnica, verifica que sea compatible con la versión actual del lenguaje.  

Además, si decides usar características de JavaScript muy recientes, asegúrate de que estén en **Ecma TC39 Stage 3** o superior para garantizar su estabilidad.

---

## 3. Usa `let` y `const` en lugar de `var`

Aunque `var` sigue siendo válido, es una práctica obsoleta. Usar `let` y `const` proporciona **alcance por bloque**, lo que es más predecible y reduce errores inesperados.  

**Ejemplo:**

```javascript
for (let j = 1; j < 5; j++) {
  console.log(j);
}
console.log(j); // ReferenceError: j is not defined
```

Con `var`, este código tendría un comportamiento diferente:

```javascript
for (var j = 1; j < 5; j++) {
  console.log(j);
}
console.log(j); // 5
```

---

## 4. Prefiere las clases a `Function.prototype`

El enfoque basado en `prototype` es antiguo y más complicado. Las **clases** ofrecen una sintaxis más limpia y moderna para la programación orientada a objetos.

**Ejemplo:**

```javascript
class Persona {
  constructor(nombre) {
    this.nombre = nombre;
  }
  obtenerNombre() {
    return this.nombre;
  }
}
const persona = new Persona('Juan');
console.log(persona.obtenerNombre()); // 'Juan'
```

---

## 5. Usa campos privados reales

Antes, se usaban convenciones como un guion bajo (`_`) para indicar propiedades privadas, pero esto no garantizaba la privacidad. Ahora, JavaScript tiene **campos privados reales** con el prefijo `#`.

**Ejemplo:**

```javascript
class Persona {
  #nombre;
  constructor(nombre) {
    this.#nombre = nombre;
  }
  obtenerNombre() {
    return this.#nombre;
  }
}
const persona = new Persona('Juan');
console.log(persona.obtenerNombre()); // 'Juan'
console.log(persona.#nombre); // SyntaxError: Private field '#nombre' must be declared in an enclosing class
```

---

## 6. Usa funciones flecha

Las **funciones flecha** ofrecen una sintaxis más concisa y enlazan automáticamente el contexto de `this`. Son especialmente útiles en funciones de orden superior como `map`, `filter` y `reduce`.

**Ejemplo:**

```javascript
const numeros = [1, 2, 3];
const dobles = numeros.map(num => num * 2);
console.log(dobles); // [2, 4, 6]
```

---

## 7. Operador de coalescencia nula (`??`)

El operador lógico `||` se usa frecuentemente para asignar valores por defecto, pero puede dar resultados inesperados con valores como `0`, `false` o `""`. El operador `??` soluciona este problema.

**Ejemplo:**

```javascript
const valor = 0;
const resultado = valor ?? 10;
console.log(resultado); // 0
```

---

## 8. Encadenamiento opcional (`?.`)

Al trabajar con objetos o estructuras anidadas, el **operador de encadenamiento opcional** simplifica la verificación de valores nulos o indefinidos.

**Ejemplo:**

```javascript
const producto = {};
const impuesto = producto?.precio?.impuesto;
console.log(impuesto); // undefined
```

---

## 9. Usa `async/await` para manejo de asincronía

La sintaxis `async/await` simplifica el manejo de operaciones asíncronas y mejora la legibilidad del código comparado con el uso de promesas y `.then`.

**Ejemplo:**

```javascript
async function obtenerDatos() {
  try {
    const respuesta = await fetch('https://api.ejemplo.com/datos');
    const datos = await respuesta.json();
    console.log(datos);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 10. Métodos modernos para objetos

Para trabajar con claves y valores en objetos, utiliza métodos modernos como `Object.entries()`, `Object.values()` y `Object.keys()`.

**Ejemplo:**

```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.entries(obj).forEach(([clave, valor]) => {
  console.log(clave, valor);
});
```

---

## 11. Detecta arrays con `Array.isArray()`

El método `Array.isArray()` es la forma más confiable de verificar si una variable es un array, especialmente en entornos complejos.

**Ejemplo:**

```javascript
const arr = [1, 2, 3];
console.log(Array.isArray(arr)); // true
```

---

## 12. Usa `Map` para claves no primitivas

Cuando necesitas asociar valores a claves que no sean cadenas o símbolos, utiliza `Map`. Es más robusto y mantiene el tipo y el orden de las claves.

**Ejemplo:**

```javascript
const mapa = new Map();
const clave = { id: 1 };
mapa.set(clave, 'valor');
console.log(mapa.get(clave)); // 'valor'
```

---

## 13. Utiliza `Symbol` para claves únicas

Los `Symbol` permiten crear claves únicas que no son accesibles a través de enumeración normal, lo que los hace útiles para valores “ocultos” o únicos.

**Ejemplo:**

```javascript
const obj = {};
const claveOculta = Symbol('oculta');
obj[claveOculta] = 'valor secreto';
console.log(obj[claveOculta]); // 'valor secreto'
```

---

### Verifica la API Intl antes de usar librerías externas para formato

En el pasado, los desarrolladores solían depender de librerías de terceros para tareas como el formato de fechas, números y monedas en diferentes idiomas. Aunque estas librerías ofrecen funcionalidades potentes, agregan peso extra al proyecto y pueden duplicar características ya integradas en JavaScript.

```javascript
// Usando una librería para formatear moneda
const amount = 123456.78;
// formatLibrary.formatCurrency(amount, 'USD');
```

**Consejo:** Antes de recurrir a una librería externa, considera usar la API de Internacionalización de ECMAScript (Intl). Esta API ofrece funcionalidades robustas para formatear fechas, números, monedas y más, según el idioma, sin necesidad de agregar dependencias externas.

```javascript
const amount = 123456.78;
// Usando Intl.NumberFormat para formatear moneda
const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
console.log(formatter.format(amount)); // $123.456,78

// También puedes usarla para fechas
const date = new Date();
const dateFormatter = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
console.log(dateFormatter.format(date)); // "15 de octubre de 2024"
```

**Por qué es importante:** La API Intl ofrece soporte nativo y optimizado para internacionalización, eliminando la necesidad de usar librerías externas para tareas simples de formato. Esto mantiene tu proyecto ligero, reduce dependencias y facilita el mantenimiento. Además, mejora el rendimiento al evitar el uso de código redundante.

---

### Usa igualdad estricta (===) siempre que sea posible

Uno de los comportamientos más confusos de JavaScript proviene del operador de igualdad no estricta (`==`). Este realiza coerción de tipos, lo que puede generar resultados inesperados.

```javascript
console.log([] == ![]); // true (sorprendente y poco intuitivo)
```

**Consejo:** Siempre que sea posible, utiliza la igualdad estricta (`===`) en lugar de la no estricta (`==`). La igualdad estricta no realiza coerción de tipos, lo que hace que las comparaciones sean más predecibles.

```javascript
console.log([] === ![]); // false (como se espera)

// Ejemplo más típico
console.log(0 == '');  // true
console.log(0 === ''); // false
```

**Por qué es importante:** Usar `===` evita los comportamientos inesperados causados por la coerción de tipos, haciendo que tu código sea más seguro y predecible. Esto es especialmente útil cuando trabajas con tipos de datos variados como números, cadenas y booleanos.

---

### Maneja expresiones en sentencias `if` de forma explícita

En JavaScript, las sentencias `if` convierten implícitamente el resultado de la expresión en un valor "truthy" o "falsy". Esto puede ocasionar resultados inesperados si no se comprende bien este comportamiento.

```javascript
const value = 0;
if (value) {
  console.log('Esto no se ejecutará porque 0 es "falsy".');
}
```

**Consejo:** Define las condiciones de forma explícita para evitar ambigüedades.

```javascript
const value = 0;
// Implícito (puede dar resultados inesperados)
if (value) {
  console.log('Esto no se ejecutará');
}

// Explícito
if (value !== 0) {
  console.log('Esto se ejecutará solo si value no es 0.');
}
```

**Por qué es importante:** Al definir condiciones explícitas, reduces el riesgo de errores causados por la coerción automática de JavaScript. Esto hace que tu lógica sea más clara y predecible, especialmente cuando trabajas con valores ambiguos como `0`, `null` o `""`.

---

### Evita usar `Number` para cálculos sensibles

El tipo `Number` de JavaScript utiliza números de punto flotante, lo que puede causar errores de precisión en cálculos decimales.

```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
```

**Consejo:** Para cálculos donde la precisión es crucial, como operaciones financieras, utiliza librerías como `decimal.js` o `big.js`.

```javascript
const Decimal = require('decimal.js');
const result = new Decimal(0.1).plus(0.2);
console.log(result.toString()); // '0.3'
```

**Por qué es importante:** Los errores de precisión pueden ser graves, especialmente en cálculos financieros. Usar librerías especializadas asegura resultados exactos, evitando discrepancias y errores críticos.

---

### Ten cuidado con JSON y números grandes

JavaScript tiene límites para manejar números grandes. El mayor entero seguro es `9007199254740991` (o `Number.MAX_SAFE_INTEGER`). Los números mayores a este pueden perder precisión.

```javascript
console.log(
  JSON.parse('{"id": 9007199254740999}')
); 
// Salida: { id: 9007199254741000 } (precisión perdida)
```

**Consejo:** Usa `BigInt` o maneja grandes números como cadenas en JSON para evitar problemas de precisión.

```javascript
const data = { id: 9007199254740999n };
console.log(
  JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  })
);
// Salida: {"id":"9007199254740999"}
```

**Por qué es importante:** Manejar correctamente números grandes asegura la integridad de los datos, especialmente al trabajar con APIs o sistemas externos.

---

### Usa JSDoc para ayudar a lectores y editores de código

Documentar funciones y objetos con JSDoc mejora la legibilidad del código y facilita la autocompletación y validación de tipos en editores.

```javascript
/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} [middleName]  // Propiedad opcional
 * @property {string} lastName
 */
/**
 * Imprime el nombre completo de un usuario.
 * @param {User} user - Objeto con los datos del usuario.
 * @return {string} - Nombre completo.
 */
const printFullUserName = user =>
  `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
```

**Por qué es importante:** JSDoc facilita la colaboración, mejora la documentación del código y reduce errores al proporcionar autocompletado y validación en tiempo de desarrollo.

---

### Escribe pruebas automatizadas

Node.js (desde la versión 20) incluye un *test runner* integrado que permite escribir y ejecutar pruebas sin necesidad de herramientas externas.

```javascript
import { test } from 'node:test';
import { equal } from 'node:assert';

const sum = (a, b) => a + b;

test('sum', () => {
  equal(sum(1, 1), 2);
});
```

**Por qué es importante:** Las pruebas automatizadas garantizan que tu código funcione como se espera, permitiéndote hacer cambios con confianza y detectar errores rápidamente.