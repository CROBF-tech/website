---
title: 'Timeouts y reintentos en APIs que no empeoran el fallo'
description: 'Guía práctica para teams chicos: cómo poner timeouts y reintentos en APIs sin empeorar el fallo, con backoff con jitter, idempotency keys y cómo distinguir 429, 5xx y timeouts en TypeScript.'
pubDate: '2026-10-09'
heroImage: '/blog/timeouts-y-reintentos-que-no-empeoran.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 4
featured: false
---
Toda llamada a una API tiene una tasa de fallo mayor a cero. La red se corta, el servicio del otro lado hace un deploy, tu request entra en una cola saturada. Eso es normal y no va a dejar de pasar. Lo raro es que, cuando pasa, tu sistema quede colgado indefinido o que los reintentos multipliquen el daño original: dos cobros, tres mails, una cola atascada.

En este post te dejo la versión corta y práctica de lo que miro primero cuando trabajo con equipos chicos: dónde poner timeouts, cuándo reintentar y cuándo no, y cómo evitar que tu función de reintento sea la parte más peligrosa del sistema. Nada de esto es avanzado; es base que conviene tener clara antes del primer incidente, no después.

## 1. Primero el timeout, después todo lo demás

Un cliente HTTP sin timeout confía en que el otro lado algún día va a responder. A veces pasa. Cuando no, tu proceso queda esperando para siempre y los recursos (conexiones, workers, límites de concurrencia) se van ocupando hasta que todo se cuelga junto. El primer cambio siempre es el mismo:

```ts
// mal: si el otro lado se congela, tu worker también
const res = await fetch(url);
```

```ts
// bien: timeout explícito, del tamaño del presupuesto que vos sí podés esperar
const res = await fetch(url, {
  signal: AbortSignal.timeout(3_000),
});
```

`AbortSignal.timeout` funciona en Node moderno y en el navegador, y te ahorra configurar nada a mano. La parte difícil no es el código, es elegir el número. Una regla simple que uso: tu timeout tiene que ser más chico que el de quien te llama. Si tu endpoint tiene un presupuesto de 10 segundos y hacés tres reintentos de 10 segundos, ese presupuesto ya no se cumple nunca. Andá siempre de adentro hacia afuera: el retry interno suma menos que el timeout del que te invoca.

## 2. 429, 5xx y timeouts no son lo mismo

El error más común de diseño es tratar a todos los fallos como "reintentar ya". No son iguales:

- **429:** el otro lado te está diciendo "más lento". Reintentar en el segundo siguiente es exactamente lo que no hay que hacer. Si viene un header `Retry-After`, respetalo.
- **5xx:** el servidor falló, muchas veces de forma transitoria. Candidato a reintento, con backoff y cantidad acotada.
- **Timeout:** el peor de los tres, porque el estado es desconocido. Tu request puede haber llegado y procesado igual. Reintentar acá a ciegas es volver a pasar la tarjeta sin saber si ya la pasaron.

Un clasificador mínimo te ordena todo esto:

```ts
// bien: decidir por respuesta, no por intuición
function reintentar(status: number): boolean {
  return status === 429 || status >= 500;
}
```

Todo lo que no entre en ese grupo (400, 401, 403, 404) conviene mandarlo directo al error: reintentarlo va a fallar lo mismo cinco veces.

## 3. Backoff con jitter, no reintentos en ráfaga

El segundo error clásico es reintentar inmediatamente y con cadencia fija. Cuando un servicio empieza a degradarse, todos tus clientes tienen el mismo reloj: si los diez mil usuarios que fallaron juntos reintentan un segundo después, generás una segunda tormenta perfectamente sincronizada sobre un servicio que ya estaba mal. El backoff exponencial espacia la espera; el jitter agrega aleatoriedad para que nadie comparta el mismo milisegundo:

```ts
// mal: espera fija, sin jitter, todos reintentan juntos
await sleep(1_000);
```

```ts
// bien: backoff exponencial + jitter
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function conBackoff<T>(fn: () => Promise<T>, intentos = 3): Promise<T> {
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === intentos - 1) throw err;
      const base = 500;
      await sleep(base * 2 ** i + Math.random() * base);
    }
  }
  throw new Error("sin intentos");
}
```

Con tres intentos y jitter, diez mil clientes se reparten sus reintentos en una ventana en vez de apilarse en un pico. Es una línea de código que evita una clase entera de incidentes.

## 4. Idempotency keys para los POST

Los GET se pueden reintentar casi gratis porque leer dos veces no cambia nada. Los POST no: crear dos veces son dos recursos. Ahí es donde entra la idempotency key: generás una clave por operación del lado del negocio, la mandás en el header, y el otro lado puede reconocerla y devolverte el mismo resultado en lugar de duplicar el trabajo.

```ts
// bien: una key por transacción del negocio, no por reintento
async function crearOrden(clienteId: string, carrito: Item[]) {
  const idempotencyKey = crypto.randomUUID();

  return fetch("https://api.mipago.dev/ordenes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    signal: AbortSignal.timeout(3_000),
    body: JSON.stringify({ clienteId, carrito }),
  });
}
```

El detalle que se rompe todo el tiempo: la key tiene que vivir a nivel de la operación, no del reintento. Si la generás dentro del loop de reintentos, cada reintento es una orden nueva y no sirvió de nada. Con esto, tu timeout deja de ser una bomba: si la respuesta llega tarde, el reintento con la misma key va a chocar con la primera y no va a duplicar nada.

## 5. Tres errores que empeoran el fallo

Si tuviera que resumir dónde vi más daño causado por "soluciones" de reintento, sería en estos tres:

1. **Reintentar escrituras no idempotentes.** Un POST de cobro reintentado dos veces son dos cobros. Si no podés usar idempotency keys, no reintenten escrituras en automático: mostrale el error al usuario y dejá que decida.
2. **Reintentos sin jitter.** La cadencia fija sincroniza a todos tus clientes contra el mismo servicio. El jitter es una línea que evita una clase entera de incidentes.
3. **Loops infinitos de reintento.** Un `while (true)` con un `catch` vacío convierte un incidente de cinco minutos en una caída completa. Todo reintento tiene que tener techo: tres intentos, un error claro, y que el sistema siga vivo.

Los tres comparten el mismo origen: confundir "hacer que vuelva a funcionar" con "hacer más intentos". El reintento no arregla el fallo; solo decide cuánto lo amplificás.

## Para cerrar

Ninguna pieza es complicada: un timeout, un límite de intentos, un poco de jitter y una idempotency key. Lo complejo es acordar que los reintentos son parte del comportamiento del sistema, no un parche que se agrega cuando ya hubo incidente. Si tu equipo está arrancando con APIs y querés revisar cómo están hoy tus reintentos, arrancá por preguntarte: ¿qué pasa si el otro lado responde el doble de lento de lo que espero? La respuesta honesta a esa pregunta suele ser el mejor punto de partida. Y si querés charlarlo, en CROBF nos copan estos temas.