---
title: '¿Que es solid y por que deberías utilizarlo?'
description: 'Si alguna vez has trabajado en un proyecto de desarrollo que escaló rapidamente y se volvió muy difícil de manetener, sabras lo importante que es seguir convenciones y estandares para evitar dolores de cabeza. Aquí es donde entra SOLID.'
pubDate: 'Nov 26 2024'
heroImage: '/blog/placheholder-blog-solid.jpg'
author: 'Juan Beresiarte'
---

Si alguna vez has trabajado en un proyecto de desarrollo que escaló rapidamente y se volvió muy difícil de manetener, sabras lo importante que es seguir convenciones y estandares para evitar dolores de cabeza. Aquí es donde entra SOLID.

## ¿Qué es SOLID?

SOLID es un acrónimo que representa cinco principios fundamentales del diseño orientado a objetos. Estos principios buscan mejorar la calidad del código, haciéndolo más fácil de entender, mantener y escalar. Cada letra en SOLID corresponde a un principio específico:

- **S**: Single Responsibility Principle (Responsabilidad Única)  
- **O**: Open/Closed Principle (Abierto/Cerrado)  
- **L**: Liskov Substitution Principle (Sustitución de Liskov)  
- **I**: Interface Segregation Principle (Segregación de Interfaces)  
- **D**: Dependency Inversion Principle (Inversión de Dependencias)

Aplicar estos principios no solo mejora la estructura de tu código, sino que también ayuda a evitar errores comunes y facilita la colaboración dentro de un equipo.

## Los principios de SOLID explicados

---

##### 1. Principio de Responsabilidad Única (SRP)
Cada clase debe tener una única responsabilidad y razón para cambiar. En otras palabras, una clase debe enfocarse en hacer solo una cosa.

**Ejemplo en PHP:**
```php
class User {
    public function saveToDatabase() {
        // Código para guardar un usuario en la base de datos
    }
}
```
Este ejemplo viola el principio porque la clase `User` mezcla lógica de negocio con operaciones de base de datos. Una mejor solución sería delegar la lógica de persistencia a otra clase.

**Corregido:**
```php
class User {
    public string $name;
}

class UserRepository {
    public function save(User $user) {
        // Código para guardar un usuario en la base de datos
    }
}
```

---

##### 2. Principio Abierto/Cerrado (OCP)
Las clases deben estar abiertas a la extensión, pero cerradas a la modificación. Esto significa que puedes añadir funcionalidades sin alterar el código existente.

**Ejemplo:**
```php
interface PaymentMethod {
    public function pay(float $amount): void;
}

class PayPal implements PaymentMethod {
    public function pay(float $amount): void {
        // Lógica de pago con PayPal
    }
}

class CreditCard implements PaymentMethod {
    public function pay(float $amount): void {
        // Lógica de pago con tarjeta de crédito
    }
}
```
El uso de interfaces permite agregar nuevos métodos de pago sin cambiar la lógica central.

---

##### 3. Principio de Sustitución de Liskov (LSP)

El principio de Sustitución de Liskov (LSP) establece que una subclase debe poder reemplazar a su clase base sin alterar el comportamiento esperado del programa. Esto significa que las subclases deben adherirse al contrato definido por la clase base, asegurando que cualquier instancia de la subclase funcione correctamente donde se espera una instancia de la clase base.

El objetivo principal de este principio es mantener la consistencia en la jerarquía de clases y evitar violaciones que puedan causar errores o comportamientos inesperados. Si una subclase introduce modificaciones que cambian el propósito o el comportamiento básico de la clase base, entonces no cumple con este principio.

**Ejemplo práctico**: Supongamos que tienes una clase base `Bird` con un método `fly()` que representa la habilidad de volar de un ave. Luego, creas una subclase `Penguin`, que hereda de `Bird`, pero los pingüinos no pueden volar. Si el programa espera que todas las instancias de `Bird` puedan usar el método `fly()`, la subclase `Penguin` rompería este comportamiento, violando el principio.

```php
class Bird {
    public function fly(): string {
        return "Estoy volando";
    }
}

class Penguin extends Bird {
    public function fly(): string {
        throw new Exception("Los pingüinos no pueden volar");
    }
}

// Uso en el programa
function letBirdFly(Bird $bird) {
    echo $bird->fly();
}

$penguin = new Penguin();
letBirdFly($penguin); // Esto causa un error.
```

##### Solución: Rediseñar la jerarquía de clases

En lugar de asumir que todas las aves pueden volar, podemos redefinir la jerarquía de clases para representar mejor las características reales de cada tipo de ave. Podemos introducir una interfaz específica para aves que pueden volar, evitando la necesidad de que los pingüinos implementen un comportamiento que no poseen.

```php
interface Flyable {
    public function fly(): string;
}

class Bird {
    public function eat(): string {
        return "Estoy comiendo";
    }
}

class Sparrow extends Bird implements Flyable {
    public function fly(): string {
        return "Estoy volando como un gorrión";
    }
}

class Penguin extends Bird {
    // No implementa Flyable
}

// Uso en el programa
function letFly(Flyable $bird) {
    echo $bird->fly();
}

$sparrow = new Sparrow();
letFly($sparrow); // Funciona correctamente

$penguin = new Penguin();
// letFly($penguin); // Esto no es posible porque Penguin no es Flyable
```

##### Beneficios del cumplimiento del LSP

1. **Mayor coherencia:** La jerarquía de clases refleja mejor la realidad, evitando suposiciones incorrectas sobre las capacidades de las subclases.  
2. **Reducción de errores:** El programa no fallará debido a comportamientos inesperados introducidos por subclases que no cumplen con el contrato de la clase base.  
3. **Facilidad de mantenimiento:** El código es más fácil de extender y modificar, ya que las subclases se integran sin alterar la lógica existente.  

Cumplir con el principio de Sustitución de Liskov no solo mejora la calidad de tu diseño orientado a objetos, sino que también asegura que tu código sea robusto y confiable a medida que crece.

---

##### 4. Principio de Segregación de Interfaces (ISP)
Es mejor tener varias interfaces pequeñas y específicas que una interfaz grande y general.

**Ejemplo:**
```php
interface Flyable {
    public function fly();
}

interface Swimable {
    public function swim();
}
```

---

##### 5. Principio de Inversión de Dependencias (DIP)
Los módulos de alto nivel no deben depender de los módulos de bajo nivel; ambos deben depender de abstracciones.

**Ejemplo:**
```php
interface Logger {
    public function log(string $message);
}

class FileLogger implements Logger {
    public function log(string $message) {
        // Escribe el mensaje en un archivo
    }
}

class Application {
    private Logger $logger;

    public function __construct(Logger $logger) {
        $this->logger = $logger;
    }

    public function run() {
        $this->logger->log('La aplicación está corriendo');
    }
}
```
Esto permite cambiar la implementación del logger sin alterar la lógica principal de la aplicación.

---

## ¿Por qué deberías usar SOLID?

1. **Mantenimiento:** Código más limpio y fácil de modificar sin temor a romper otras partes del sistema.  
2. **Escalabilidad:** Facilita la adición de nuevas funcionalidades sin grandes refactorizaciones.  
3. **Colaboración:** Mejora la legibilidad y facilita el trabajo en equipo.  
4. **Pruebas:** Las aplicaciones diseñadas con SOLID son más fáciles de probar.

---

## Conclusión

Aplicar los principios SOLID puede parecer complejo al principio, pero su impacto a largo plazo es innegable. Adoptarlos no solo mejorará la calidad de tu código, sino que también te convertirá en un mejor desarrollador, capaz de crear aplicaciones robustas, escalables y fáciles de mantener. ¿Estás listo para implementar SOLID en tu próximo proyecto?