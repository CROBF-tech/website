# 📚 Guía para Crear Artículos


## 📂 Estructura de un Articulo

Cada Articulo se define en un archivo **`.mdx`** dentro de la carpeta `src/content/blog[es/en]`. Este archivo contiene dos secciones principales:

1. **Frontmatter**: Metadatos del Articulo, escritos en formato YAML.
2. **Contenido**: El contenido educativo, escrito en Markdown (con soporte para MDX).

### **Campos del Frontmatter**

| Campo         | Tipo      | Descripción                                                              |
| ------------- | --------- | ------------------------------------------------------------------------ |
| `title`       | `string`  | Título del Articulo. Ejemplo: "Cliente y Servidor".                      |
| `description` | `string`  | Breve resumen del contenido del Articulo.                                |
| `pubDate`        | `string`  | Fecha de la última actualización del Articulo. Formato: `DD-MM-AAAA`. |
| `heroImage`      | `string`  | Dirección de la imagen                            |
| `author`    | `string`  |   Nombre del autor del articulo  |

---

## 📋 Ejemplo de un Articulo

Aquí tienes un ejemplo de un archivo `.mdx` que define un Articulo:

```mdx

---
title: 'Día Internacional de La Mujer'
description: ''
pubDate: 'Mar 8 2025'
heroImage: '/blog/Dia_internacional_de_la_mujer.png'
author: "Ana Paula Toledo"
---

import YoutubeVideo from '../../../components/YoutubeVideo.astro'

El 8 de Marzo se conmemora el **Día Internacional de La Mujer** pero ¿Sabes por qué?

Mi nombre es Ana y soy parte de CROBF una empresa que cuenta con tres mujeres como parte de su equipo, por eso hoy quiero contarte sobre el trasfondo de este día y también sobre algunas mujeres que han sido pioneras en el mundo de la programación y el desarrollo de software. 
```

---

## 🚀 Cómo Crear un Nuevo Articulo

Sigue estos pasos para crear un nuevo Articulo:

1. **Crea un archivo `.mdx`** en `src/content/blog[es/en]`.

2. **Define los metadatos** en el frontmatter:

    - Completa todos los campos obligatorios.

3. **Escribe el contenido** en Markdown o MDX:

    - Usa encabezados (`#`, `##`, `###`) para estructurar el contenido.
    - Añade imágenes, videos o componentes interactivos si es necesario.

4. **Guarda el archivo**:

    - Asegúrate de que el archivo esté correctamente formateado.

5. **Verifica la validación**:

    - Si hay errores en los datos, el sistema te notificará. Corrige los errores antes de continuar.

---

## 📌 Buenas Prácticas para Crear Articulos

1. **Componentes Personalizados**:

    - Aprovecha los componentes MDX (como `YoutubeVideo` o `Quote`) para enriquecer el contenido.

---
