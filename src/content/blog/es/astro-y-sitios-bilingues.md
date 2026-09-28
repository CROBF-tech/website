---
title: 'Astro y sitios bilingües: cómo estructurar un sitio corporativo en es y en'
description: 'Un sitio bilingüe no es solo traducir textos. En Astro podés separar rutas por idioma, content collections y middleware para que la experiencia sea coherente. Así lo encaramos en un sitio corporativo real.'
pubDate: 'Sep 28 2026'
heroImage: '/blog/astro_y_sitios_bilingues.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 4
---
Cuando un sitio corporativo necesita vivir en **español** y **inglés**, el problema no es solo “traducir el copy”. Hay que decidir cómo se estructuran las URLs, dónde vive el contenido, qué pasa si alguien entra sin idioma en la ruta, y cómo evitás que el blog en un idioma se mezcle con el otro.

En **CROBF** resolvimos esto con **Astro**: un solo proyecto, rutas con prefijo de idioma y colecciones de contenido separadas. En este post te cuento el enfoque que usamos y por qué escala mejor que duplicar todo el sitio a mano.

## Por qué Astro encaja bien

Astro brilla cuando la mayor parte del sitio es contenido (landing, about, blog) y solo algunas islas necesitan interactividad. Para un sitio bilingüe eso ayuda porque:

- Podés generar (o servir) páginas por idioma sin arrastrar un framework pesado en cada vista.
- El contenido puede vivir en **Markdown/MDX** con un esquema tipado.
- La estructura de carpetas deja muy claro qué pertenece a `es` y qué a `en`.

No necesitás un monorepo con dos apps “Web” y “Blog” solo por el idioma. Un solo app Astro alcanza si las rutas y el contenido están bien modelados.

## El patrón: prefijo de idioma en la URL

La base es simple: **todas las rutas reales viven bajo `/{lang}/...`**, donde `lang` es `es` o `en`.

Ejemplos:

- `/es` — home en español
- `/en` — home en inglés
- `/es/blog` — listado del blog
- `/es/blog/mi-articulo` — un post

La raíz `/` no intenta adivinar mil variantes: redirige al idioma por defecto (en nuestro caso, **español**).

Ese prefijo hace tres cosas a la vez:

1. Deja el idioma **explícito** (bueno para SEO y para compartir links).
2. Simplifica el routing: el primer segmento de la URL es la fuente de verdad.
3. Permite filtrar colecciones de contenido por idioma sin magia rara.

## Content collections: un blog, dos carpetas

En Astro, el blog no es una base de datos: son archivos. Nosotros usamos:

```text
src/content/blog/es/...
src/content/blog/en/...
```

Cada post lleva frontmatter (`title`, `pubDate`, `author`, `tags`, etc.) y el cuerpo en Markdown o MDX. El schema (con Zod) valida que no se cuele un post sin título o sin fecha.

Ventajas prácticas:

- Un redactor puede tocar solo el archivo del idioma que le corresponde.
- Podés publicar primero en un idioma y después completar el otro (sí, pasa).
- El listado del blog filtra por `lang` y listo: no mezclás artículos en inglés en `/es/blog`.

Tip: conviene acordar convenciones de nombre de archivo y frontmatter (`author: 'Juan Beresiarte'`, fechas legibles, tags consistentes). Un script que recalcule `description`, `tags` y `readingTime` te ahorra inconsistencias.

## UI strings vs contenido editorial

No todo es un post. Botones, “Volver al blog”, labels de compartir y mensajes vacíos viven en un módulo de **i18n** (diccionarios `es`/`en`), no en el Markdown.

Regla práctica:

- **Contenido editorial** (artículos, bios, páginas largas) → `src/content/...`
- **Chrome de la interfaz** (labels, CTAs cortos) → `src/i18n/...`

Mezclar las dos cosas termina en traducciones a medias y PRs imposibles de revisar.

## Middleware: recordar el idioma del visitante

Además del prefijo en la URL, usamos un middleware que:

- Lee una cookie de preferencia de idioma.
- Si alguien entra a una ruta sin idioma válido, lo manda al preferido o al default.
- Permite un override puntual con `?lang=en` sin pisar la cookie de inmediato.

La idea no es pelearse con el usuario: es que, una vez que eligió inglés, los links internos y las redirecciones no lo manden de vuelta al español por accidente.

Ojo con los assets: imágenes, `_astro`, `robots.txt` y similares **no** deben pasar por esa lógica de redirección. Si no, terminás “traduciendo” un `.png`.

## Checklist antes de sumar un idioma (o un post)

1. ¿La ruta incluye `/{lang}/`?
2. ¿El contenido editorial está en la carpeta del idioma correcto?
3. ¿Los strings de UI tienen clave en ambos diccionarios?
4. ¿El schema del frontmatter sigue cerrado (título, fecha, autor)?
5. ¿Probaste el build (`pnpm build`)? Un typo en Zod o un import roto se ve ahí.

## Errores comunes

- **Duplicar el proyecto entero** por idioma. Mantenimiento doble, bugs asimétricos.
- **Traducir solo el home** y dejar el blog en un solo idioma sin avisarlo.
- **Usar el mismo slug en dos idiomas sin estrategia**. A veces los filenames difieren (`astro-y-sitios-bilingues` vs `astro-and-bilingual-sites`); lo importante es que el listado y el detalle filtren por idioma.
- **Hardcodear textos en componentes** “porque después lo vemos”. Después nunca.
- **Olvidar el idioma default** en redirects y en SEO.

## Conclusión

Un sitio bilingüe en Astro funciona bien cuando tratás el idioma como **parte de la arquitectura**, no como un afterthought:

- URLs con prefijo `/{lang}`
- Colecciones de contenido por idioma
- Diccionarios para la UI
- Middleware que respeta la preferencia del visitante

Eso es lo que nos permitió unificar sitio corporativo y blog en un solo repo Astro, con español como idioma principal e inglés como ciudadano de primera.

Si estás armando algo similar y te trabás en el routing o en el modelado del contenido, en CROBF nos gusta pelear esas decisiones temprano: salen más baratas que traducir mal doscientos componentes después.
