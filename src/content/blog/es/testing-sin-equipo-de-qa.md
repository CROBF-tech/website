---
title: 'Testing sin equipo de QA: qué testear primero (y cómo no ahogarse en tests flaky)'
description: 'Guía práctica para freelances y equipos chicos: cómo decidir qué testear, cómo repartir unit, integration y e2e, y qué automatizar antes de que el deploy se vuelva un acto de fe.'
pubDate: '2026-10-02'
heroImage: '/blog/testing-sin-equipo-de-qa.png'
author: 'Juan Beresiarte'
tags:
  - 'Equipos'
readingTime: 5
featured: false
---
En un proyecto reciente —un SaaS de turnos para clínicas— éramos dos: yo y un cliente que respondía tickets entre pacientes. Sin QA, claro. Cada viernes, deploy. Cada viernes, la misma escena: el deploy listo y nosotros mirando Slack como si fuera un interrogatorio.

Lo curioso es que no testeábamos "poco": el problema era otro. No sabíamos qué testear primero, ni con qué, ni cuándo parar. Testear todo es imposible cuando sos una persona; testear nada es carísimo cuando el sistema maneja plata y agendas. Este post es el mapa que me hubiera gustado tener esa semana.

## 1. La pregunta correcta: ¿dónde te pegaría el bug?

La primera decisión del testing no es técnica, es de prioridad. No testeás lo que es fácil de testear; testeás lo que duele si está roto. Antes de escribir un solo test, pasá tu sistema por este filtro:

- ¿Es plata? Cálculos, totales, descuentos, facturación.
- ¿Son datos que no podés recuperar? Turnos, altas, borrados.
- ¿Se rompió antes? Código con historial de bugs es candidata fuerte.
- ¿Lo vería el usuario en los primeros 30 segundos?
- ¿Lo toca alguien que no podés llamar a las 3 de la mañana?

En el SaaS de turnos, la respuesta fue incómoda: ni el login ni el diseño eran lo riesgoso. Era el solapamiento de turnos. Un solo módulo concentraba casi todo el riesgo del negocio. Ese fue nuestro punto de partida, no porque fuera lindo de testear, sino porque era el único lugar donde un bug cobraba clientes.

## 2. La pirámide, traducida a presupuesto

La pirámide de testing (unit / integration / e2e) suele presentarse como dogma estético. Para un equipo chico es algo más útil: es un presupuesto. Cada piso compra un tipo de confianza a un precio distinto.

- **Unit tests** son monedas de 1 peso: baratas, rápidas, podés tener cientos. Compran *precisión*: que la regla de negocio sea exacta.
- **Integration tests** son los billetes de 50: menos cantidad, más caros. Compran *realidad*: que las piezas se entiendan entre sí (base de datos, HTTP, emails).
- **E2E** son los billetes de 1000: pocos, lentos, frágiles. Compran *panorama*: que el flujo completo del usuario camine de punta a punta.

El error clásico del equipo chico es invertir todo en el piso caro. Mirá la diferencia:

```ts
// ❌ Arrancar un navegador para probar una regla de negocio
test("total con descuento", async () => {
  await page.goto("/checkout?subtotal=100&descuento=20");
  expect(await page.textContent("#total")).toBe("80");
});
```

```ts
// ✅ La misma regla, sin navegador, en milisegundos
test("aplica un 20% de descuento al subtotal", () => {
  expect(calcularTotal({ subtotal: 100, descuento: 0.2 })).toBe(80);
});
```

El primer test puede romperse por un CSS, un timing o un cambio de copy. El segundo solo falla si la regla de negocio está mal. Eso es exactamente lo que querés saber.

Donde la pirámide se ensancha bien es en los bordes: endpoints, repositorios, colas. Ahí un test de integración con datos controlados vale oro:

```ts
test("no deja agendar dos turnos en el mismo horario", async () => {
  const repo = repoEnMemoria([{ fecha: "2026-10-05 09:00" }]);
  const res = await crearTurno({ fecha: "2026-10-05 09:00" }, repo);
  expect(res.status).toBe(409);
});
```

## 3. Qué automatizar primero

Con el presupuesto claro, el orden para un equipo chico queda así:

1. **Reglas de negocio puras → unit.** Cálculos, validaciones, transformaciones. Cuentan por decenas y cuestan poco.
2. **Bordes y endpoints → integration.** Rutas, queries, interacciones con la base de datos usando datos de prueba controlados.
3. **5 a 10 flujos críticos → e2e.** No más. Registro, pago, "el flujo que generaría plata". Si tu suite de e2e tiene 60 tests, no es una suite, es un problema.
4. **Cada bug de producción → un test que lo reproduce antes de arreglarlo.** Es la inversión con mejor réndimiento que existe: convertís incidentes en regimientos permanentes del suite.

Y la lista de lo que **no** conviene automatizar, que es igual de importante:

- Getters y setters triviales.
- Estilo visual puro (para eso está la revisión).
- Validaciones básicas que ya trae el framework.
- Cualquier cosa que testear cueste más que arreglar el bug.

En el proyecto de turnos, arrancamos con una sola tarde de trabajo: la función `solapaCon(turno, turnosExistentes)` y cuatro tests. No fue heroico. Pero la próxima vez que tocamos el módulo, el deploy dejó de ser una apuesta y pasó a ser una verificación.

## 4. Flaky tests: cómo no ahogarte

Un test flaky (falla, volvés a correr, pasa) es peor que un test roto. El roto te señala un problema; el flaky te enseña a ignorar la alarma. Es el chico que gritó lobos, versión repositorio.

La causa número uno de flakiness es esperar al reloj en lugar de esperar al estado:

```ts
// ❌ "Espero y rezo"
await new Promise((r) => setTimeout(r, 3000));
expect(await page.textContent("#estado")).toContain("Listo");
```

```ts
// ✅ Esperar la condición, no la suerte
await expect(page.getByText("Listo")).toBeVisible({ timeout: 5_000 });
```

Después de ese arreglo, mis reglas domésticas son pocas y firmes:

- **Un retry es una faja; dos retries son un escondite.** Los reintentos de tu runner están para tolerar ruido de red, no bugs intermitentes.
- **Cuarentena, no convivencia.** Test intermitente: se marca, se anota, se arregla o se borra en pocos días. Nunca debe vivir en verde-falso en el suite.
- **Cada test trae sus propios datos.** Seed determinista, nada de depender de lo que dejó el test anterior.
- **Flaky se arregla o se elimina.** No existe el "lo dejamos así".

## 5. Errores comunes (los vi todos)

1. **Testear por culpa.** Persuadir el porcentaje de cobertura como meta; te llena de tests inútiles que hay que mantener.
2. **Solo el camino feliz.** Sin bordes: los bugs viven en descuentos, fechas, duplicados y campos vacíos.
3. **Tests que dependen del orden.** Si el orden importa, es un test de integración mal escrito (y frágil).
4. **Dormir en vez de esperar.** El `setTimeout` de fábrica produce flaky a velocidad industrial.
5. **El suite rojo "temporal".** Tres semanas de rojo y la aldea entera aprende a no mirar el CI.
6. **Automatizar la demo y no la facturación.** Lo que se muestra en un video no es lo que te quiebra un martes.

## En resumen

La meta nunca fue "estar testeado". La meta es que el viernes a las 17:04, cuando deployás, sepás exactamente qué te está diciendo tu suite: si está verde, los flujos que pagan las cuentas caminan. Un equipo chico con esa claridad testea mejor que un piso lleno de gente apagando incendios sin mapa.

¿Cuál es el flujo de tu sistema que hoy es un acto de fe cada vez que toca deployar? Ese es tu primer test. Y si querés una segunda mirada para armar la pirámide de tu proyecto, ya sabés dónde encontrarme.
