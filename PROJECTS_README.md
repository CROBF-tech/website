# CROBF Website Projects

Este repositorio contiene dos proyectos Astro separados:

## 📁 Estructura

-   **`/` (raíz)** - Web principal de CROBF
-   **`/Blog`** - Blog independiente de CROBF

## 🚀 Configuración inicial

### Web Principal

```bash
# Instalar dependencias
npm install

# Desarrollo (puerto 4321 por defecto)
npm run dev

# Build
npm run build

# Vista previa
npm run preview
```

### Blog

```bash
# Navegar a la carpeta del blog
cd Blog

# Instalar dependencias
npm install

# Desarrollo (puerto 4321)
npm run dev

# Build
npm run build

# Vista previa
npm run preview
```

## 🔗 Enlaces

-   **Web Principal**: https://crobf.tech
-   **Blog**: https://blog.crobf.tech (configurar en Vercel)

## 📝 Notas de Despliegue

### Web Principal

-   Despliega desde la raíz del repositorio
-   Vercel detectará automáticamente el proyecto Astro

### Blog

-   Necesita configurarse como un proyecto separado en Vercel
-   Root Directory: `Blog`
-   Build Command: `npm run build`
-   Output Directory: `dist`

## 🌐 Navegación entre proyectos

-   La web principal tiene un enlace al blog en el navbar
-   El blog tiene un enlace de vuelta a la web principal
-   Ambos proyectos mantienen el sistema de internacionalización (es/en)
