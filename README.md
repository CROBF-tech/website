# **🌐 CROBF - Web Oficial & Blog**

Bienvenido al repositorio de **CROBF**. Este repositorio contiene **dos proyectos Astro independientes**:

1. **Web Principal** - Sitio corporativo de CROBF
2. **Blog** - Blog técnico con artículos sobre desarrollo de software

## **📂 Estructura del Repositorio**

```
/                     # Web Principal (raíz)
├── src/
├── public/
├── astro.config.mjs
├── package.json
└── ...

/Blog                 # Proyecto del Blog (independiente)
├── src/
├── public/
├── astro.config.mjs
├── package.json
└── ...
```

## **📌 Sobre CROBF**

Somos un equipo apasionado por la tecnología, el desarrollo de software y la innovación. Nuestro objetivo es aprender, crecer y crear soluciones que generen impacto en la comunidad tech.

## **📝 Sobre el Blog**

En nuestro blog encontrarás:  
✅ Artículos sobre desarrollo de software  
✅ Experiencias y aprendizajes del equipo  
✅ Novedades y avances en nuestros proyectos  
✅ Recursos y guías para la comunidad

## **🚀 Instalación Rápida**

### Opción 1: Script automático

```bash
./install.sh
```

### Opción 2: Manual

**Web Principal:**

```bash
npm install
npm run dev
```

**Blog:**

```bash
cd Blog
npm install
npm run dev
```

## **🛠️ Comandos Disponibles**

### Web Principal

| Comando           | Acción                                            |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio de producción                  |
| `npm run preview` | Vista previa de la construcción                   |

### Blog

| Comando           | Acción                                            |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio de producción                  |
| `npm run preview` | Vista previa de la construcción                   |

## **🌐 Despliegue**

-   **Web Principal**: https://crobf.tech
-   **Blog**: Configurar como proyecto separado en Vercel (ver `Blog/DEPLOYMENT.md`)

Ambos proyectos están configurados para desplegarse en Vercel. La web principal se despliega desde la raíz, mientras que el blog requiere configuración especial (Root Directory: `Blog`).

Para más detalles sobre el despliegue del blog, consulta [`Blog/DEPLOYMENT.md`](Blog/DEPLOYMENT.md).

## **🚀 Nuestro Compromiso**

Nos esforzamos por compartir contenido valioso, fomentar el aprendizaje y seguir creciendo como equipo.

¡Gracias por ser parte de CROBF! 💙
