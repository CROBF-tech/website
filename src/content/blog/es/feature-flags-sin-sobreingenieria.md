---
title: 'Feature flags sin sobreingeniería'
description: 'Cuándo conviene un feature flag, cómo implementar uno mínimo en TypeScript y por qué la mitad del trabajo es borrarlo a tiempo. Con una historia de deploy de viernes incluida.'
pubDate: '2026-10-05'
heroImage: '/blog/feature-flags-sin-sobreingenieria.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 6
featured: false
---
Todos los tutoriales de feature flags arrancan igual: un panel lindo con toggles, segmentación de usuarios y facturación mensual. Para la mayoría de los proyectos en los que trabajo —un freelance solo contra el cliente, o un producto chico con tres personas— eso es sobreingeniería pura. En la práctica necesitás otra cosa: poder apagar o encender una función sin pushear otro deploy, y hacerlo un viernes a las 18:40 sin transpirar.

Acá va el sistema mínimo que uso hoy: un archivo de configuración tipado, un helper de unas diez líneas y una regla que casi nadie te cuenta: los flags se escriben para borrarse.

## 1. El viernes que un flag me habría salvado

El año pasado reescribí el formulario de facturación de un cliente y, como el código estaba terminado y los tests estaban verdes, deployé un viernes por la tarde. Clásico. A las 19:15 me escribió la contadora del cliente: las facturas con cupón de descuento mostraban el total mal redondeado. El fix en sí eran tres líneas, pero la única vuelta atrás completa era `git revert` y redeployar la versión anterior: unos veinte minutos con el cliente del otro lado del chat preguntando si sus ventas quedaban mal registradas.

Un flag habría convertido todo esto en una llamada de dos minutos: `FLAG_NEW_INVOICE_LAYOUT=off` y listo. Nadie más veía el formulario nuevo hasta el lunes, cuando arreglaba el redondeo con calma y liberaba bien. La lección no fue "escribí más tests", sino que deployar y liberar no tienen por qué ser el mismo acto.

## 2. ¿Cuándo conviene un flag y cuándo no?

Un flag es una puerta temporal que existe para separar el deploy del release. Conviene cuando:

- La función puede romper más de lo que arregla: checkout, pagos, facturación, importación de datos.
- Querés activar de a poco: primero el equipo interno, después un porcentaje de usuarios, después todos.
- El release depende de algo que todavía no controlás: una migración de base de datos que corre al otro día, un proveedor que aún no termina de su lado.

Mejor evitarlo cuando:

- Estás nombrando configuración permanente. El idioma del sistema o los límites del plan no se apagan ni llevan fecha de defunción: son config, no flags.
- El riesgo es bajo y podés verificarlo en staging. Un flag ahí es deuda técnica gratis.
- Lleva dos meses al 100%. Ya no es un flag: es un cadáver con permisos de producción.

Regla práctica: si no podés imaginarte el momento en que lo borrás, no lo creas.

## 3. La implementación: un solo archivo

Primero, cómo se ve el problema:

```ts
// Mal: la decisión vive repartida y hardcodeada
if (user.id === "42" || req.headers.get("x-beta") === "1") {
  renderNewForm(); // ¿y si hay que apagarlo? ¿dónde estaba este if?
}
```

La versión que uso es un único módulo con tres estados por flag: `on`, `off` o un porcentaje:

```ts
// src/lib/flags.ts
export type FlagValue = "on" | "off" | `${number}`;

const defaults = {
  newInvoiceLayout: "off", // nació 2026-09-08; se libera en v2.14 y se borra
  csvExport: "off", // nació 2026-09-20
} satisfies Record<string, FlagValue>;

export type FlagName = keyof typeof defaults;
export type FlagContext = { userId: string };

function envKey(flag: FlagName): string {
  return `FLAG_${flag.replace(/(?=[A-Z])/g, "_").toUpperCase()}`;
}

function parseFlag(raw?: string): FlagValue | undefined {
  if (!raw) return undefined;
  if (raw === "on" || raw === "off") return raw;
  const n = Number(raw);
  const valid = Number.isInteger(n) && n >= 0 && n <= 100;
  return valid ? (`${n}` as FlagValue) : "off";
}

export function isEnabled(flag: FlagName, ctx: FlagContext): boolean {
  const value = parseFlag(process.env[envKey(flag)]) ?? defaults[flag];
  if (value === "on") return true;
  if (value === "off") return false;
  return bucket(`${flag}:${ctx.userId}`) < Number(value);
}
```

Y en el código de la app se lee como una frase:

```tsx
if (isEnabled("newInvoiceLayout", { userId: user.id })) {
  return <NewInvoiceForm />;
}
```

Cómo funciona: los defaults viven en el código y por eso son la fuente de verdad; todo flag nace en `off`, que es el estado seguro. El env (`FLAG_NEW_INVOICE_LAYOUT=on` o `=25`) solo sobrescribe. Si el valor está mal escrito, el default apaga la función en vez de encenderla a medias. Esto corre del lado del servidor tal cual (Node, Astro en SSR, una API route); si la UI necesita el dato, pasale los flags ya resueltos como props, no leas `process.env` en el navegador.

## 4. Rollout gradual, sin sorpresas

Con `FLAG_CSV_EXPORT=25`, un 25% de los usuarios ve la función. ¿Cuáles? Siempre los mismos. El porcentaje se evalúa con un hash determinístico del userId, porque un `Math.random()` prendería y apagaría la función de una request a la otra: imposible de soportar ("a mí me aparece y a mi compañera no").

```ts
// FNV-1a de 32 bits, escrita a mano: cero dependencias
function bucket(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % 100;
}
```

El mismo usuario entra siempre por la misma puerta, y el crecimiento es monotónico: al subir de 25 a 50, quienes ya la veían siguen viéndola y van entrando los demás de a poco; bajar el porcentaje apaga solo la cola. El salt `` `${flag}:` `` separa el sorteo de cada flag: una persona puede estar en el 25% de uno y fuera del otro sin que eso signifique nada. Si no tenés userId (tráfico anónimo), usá el id de sesión — pero aceptá que el mismo visitante puede cambiar de puerta si su sesión se regenera.

Y si algo se rompe a mitad del rollout: cambiás el env a `0`. Kill switch, cero código nuevo.

## 5. La parte que nadie hace: borrar

Un flag tiene tres momentos: nace, se libera y se muere. El tercero es el que se saltea, y por eso todos los repos tienen un flag de 2019 que nadie se anima a tocar. Cada flag vivo es dos caminos de código para mantener: los tests se duplican, el review se frena y a los seis meses nadie se acuerda por qué está off.

El circuito que uso, en este orden:

1. **Nace**: default `off`, comentario con fecha y motivo. Sin fecha de defunción, el flag no entra.
2. **Se libera**: `on` en el env; cuando la confianza alcanza, default `on`, dejando el override en el env para rollback rápido durante un ciclo.
3. **Se borra**: un par de semanas después del 100%, quitás la key de `defaults`, borrás el camino viejo y el env.

Y acá TypeScript labura gratis: como `FlagName` es `keyof typeof defaults`, quitar la key hace que cada `isEnabled("csvExport", …)` que quedó en el código deje de compilar. Tu lista de lugares a limpiar es literal, se autoactualiza y no se te pasa ninguno. Un `grep -rn "csvExport" src/` completa lo que el tipado no ve: strings en tests, comentarios, documentación.

## 6. Errores comunes

- **Default inseguro.** Poner `on` en el código "porque igual va a andar". El día que falta el env —un deploy en otra máquina, alguien que no sabía de la variable— liberás a medias algo que creías apagado.
- **Flags que son config.** `isPro`, `locale`, `maxItemsPerPlan`: eso no se apaga ni se borra; es configuración tipada. Tratala por otro lado, sin porcentajes ni prefijos `FLAG_`.
- **Toquetear el hash con el rollout activo.** Cambiar el salt o el algoritmo con el flag al 30% rebaraja todos los usuarios: gente que veía la función la pierde a mitad de camino. El salt nace y muere con el flag.
- **Bandera encima de bandera.** `isEnabled("newFlow", …) && isEnabled("newPricing", …) && !user.isAdmin`: combinaciones que nadie testeó y casos que nadie vio prender ni apagar. Un flag decide una cosa; si creés que necesitás dos, escribí por qué.
- **"Por las dudas lo dejo".** Un flag al 100% hace tres meses, o apagado desde hace dos, ya no protege nada: es código muerto con nombre lindo. Se borra, no se jubila.

## 7. Checklist

- [ ] Default seguro: `off` en el código; solo el env puede encender.
- [ ] Una sola puerta de decisión: `isEnabled`; un `grep` de `FLAG_` afuera del módulo da cero resultados.
- [ ] Rollout determinístico y monotónico: mismo usuario, misma respuesta, en cualquier orden de requests.
- [ ] Fecha de defunción y motivo escritos al lado del flag.
- [ ] Test mínimo por flag: `on`, `off` y justo el borde del porcentaje.
- [ ] Al llegar al 100%: default `on`, un ciclo de gracia y el borrado agendado — no "cuando haya tiempo".

El código es lo de menos: lo que te salva un viernes a la tarde es el hábito — separar deploy de release, concentrar la decisión en un archivo y borrar sin piedad. ¿Cuántos flags muertos tiene tu repo ahora mismo? Yo me animé a contar los míos mientras escribía esto y me arrepentí a mitad de la lista. De esas decisiones chicas y aburridas que devuelven noches enteras de sueño va, en el fondo, este oficio; en el blog de CROBF seguimos anotándolas, y si una te sirve para tu próximo viernes, mejor todavía.
