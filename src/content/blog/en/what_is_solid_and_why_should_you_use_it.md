---
title: 'What is SOLID and Why Should You Use It?'
description: 'If you’ve ever worked on a development project that scaled rapidly and became difficult to maintain, you know how important it is to follow conventions and standards to avoid headaches. This is where SOLID comes in.'
pubDate: 'Nov 26 2024'
heroImage: '/blog/placheholder-blog-solid.jpg'
author: 'Juan Beresiarte'
---

If you’ve ever worked on a development project that scaled rapidly and became difficult to maintain, you know how important it is to follow conventions and standards to avoid headaches. This is where SOLID comes in.

## What is SOLID?

SOLID is an acronym for five fundamental principles of object-oriented design. These principles aim to improve code quality, making it easier to understand, maintain, and scale. Each letter in SOLID stands for a specific principle:

- **S**: Single Responsibility Principle (SRP)  
- **O**: Open/Closed Principle (OCP)  
- **L**: Liskov Substitution Principle (LSP)  
- **I**: Interface Segregation Principle (ISP)  
- **D**: Dependency Inversion Principle (DIP)

Applying these principles not only improves the structure of your code but also helps you avoid common pitfalls and makes team collaboration smoother.

## The SOLID Principles Explained

---

### 1. Single Responsibility Principle (SRP)

A class should have only one reason to change. In other words, a class should focus on doing just one thing.

**Example in PHP:**

```php
class User {
    public function saveToDatabase() {
        // Code to save a user to the database
    }
}
```

This example violates the principle because the `User` class mixes business logic with database operations. A better approach would be to delegate the persistence logic to another class.

**Corrected:**

```php
class User {
    public string $name;
}

class UserRepository {
    public function save(User $user) {
        // Code to save a user to the database
    }
}
```

---

### 2. Open/Closed Principle (OCP)

Classes should be open for extension but closed for modification. This means you can add functionality without altering existing code.

**Example:**

```php
interface PaymentMethod {
    public function pay(float $amount): void;
}

class PayPal implements PaymentMethod {
    public function pay(float $amount): void {
        // PayPal payment logic
    }
}

class CreditCard implements PaymentMethod {
    public function pay(float $amount): void {
        // Credit card payment logic
    }
}
```

Using interfaces allows adding new payment methods without changing the core logic.

---

### 3. Liskov Substitution Principle (LSP)

A subclass should be able to replace its base class without altering the expected behavior of the program. This means subclasses must adhere to the contract defined by the base class.

**Example:**

```php
class Bird {
    public function fly(): string {
        return "I am flying";
    }
}

class Penguin extends Bird {
    public function fly(): string {
        throw new Exception("Penguins can't fly");
    }
}

// Usage
function letBirdFly(Bird $bird) {
    echo $bird->fly();
}

$penguin = new Penguin();
letBirdFly($penguin); // This throws an error.
```

**Solution:** Redesign the class hierarchy:

```php
interface Flyable {
    public function fly(): string;
}

class Bird {
    public function eat(): string {
        return "I am eating";
    }
}

class Sparrow extends Bird implements Flyable {
    public function fly(): string {
        return "I am flying like a sparrow";
    }
}

class Penguin extends Bird {
    // Does not implement Flyable
}

// Usage
function letFly(Flyable $bird) {
    echo $bird->fly();
}

$sparrow = new Sparrow();
letFly($sparrow); // Works correctly

$penguin = new Penguin();
// letFly($penguin); // This is not possible because Penguin is not Flyable
```

---

### 4. Interface Segregation Principle (ISP)

It’s better to have multiple small, specific interfaces than a single, large, general interface.

**Example:**

```php
interface Flyable {
    public function fly();
}

interface Swimable {
    public function swim();
}
```

---

### 5. Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions.

**Example:**

```php
interface Logger {
    public function log(string $message);
}

class FileLogger implements Logger {
    public function log(string $message) {
        // Write the message to a file
    }
}

class Application {
    private Logger $logger;

    public function __construct(Logger $logger) {
        $this->logger = $logger;
    }

    public function run() {
        $this->logger->log('The application is running');
    }
}
```

This allows changing the logger implementation without altering the core application logic.

---

## Why Should You Use SOLID?

1. **Maintainability:** Cleaner code that is easier to modify without breaking other parts of the system.  
2. **Scalability:** Facilitates adding new features without major refactoring.  
3. **Collaboration:** Improves readability and makes teamwork easier.  
4. **Testing:** SOLID-designed applications are easier to test.

---

## Conclusion

Applying the SOLID principles may seem complex at first, but their long-term impact is undeniable. Adopting these principles will not only improve your code quality but also make you a better developer, capable of creating robust, scalable, and maintainable applications. Are you ready to implement SOLID in your next project?
