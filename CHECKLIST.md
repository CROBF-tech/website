# ✅ Checklist de Verificación - División de Proyectos

## Completado ✓

### Proyecto del Blog (carpeta `/Blog`)

- [x] Creada estructura de proyecto Astro independiente
- [x] Configurado `package.json` con nombre y scripts
- [x] Configurado `astro.config.mjs` con sitio del blog
- [x] Configurado `tsconfig.json`
- [x] Copiados todos los artículos del blog (`src/content/blog/`)
- [x] Copiado layout del blog (`BlogPost.astro`)
- [x] Copiado layout principal (`Layout.astro`)
- [x] Copiadas páginas del blog
- [x] Copiado archivo RSS
- [x] Copiados componentes necesarios (Header, Footer, Pagination, etc.)
- [x] Copiados estilos
- [x] Copiados archivos de i18n
- [x] Copiados archivos de configuración (consts.ts, middleware.ts, env.d.ts)
- [x] Actualizado Header con enlace a web principal
- [x] Creado `content/config.ts` solo con colección blog
- [x] Creadas páginas de redirección por idioma
- [x] Actualizado título del sitio en consts.ts
- [x] Creado README.md del blog
- [x] Creado DEPLOYMENT.md con instrucciones de Vercel
- [x] Creado vercel.json con configuración

### Web Principal (raíz `/`)

- [x] Eliminada carpeta `src/content/blog/`
- [x] Eliminada carpeta `src/pages/[lang]/blog/`
- [x] Eliminado archivo `src/pages/[lang]/rss.xml.ts`
- [x] Eliminado layout `src/layouts/BlogPost.astro`
- [x] Eliminados assets públicos del blog (`public/blog/`)
- [x] Actualizado `src/content/config.ts` (removida colección blog)
- [x] Actualizado Header con enlace externo al blog
- [x] Actualizado README.md con nueva estructura

### Documentación

- [x] Creado PROJECTS_README.md con información de ambos proyectos
- [x] Creado install.sh para instalación rápida
- [x] Actualizado README.md principal
- [x] Documentado proceso de despliegue

## 🔍 Próximos Pasos

### Para probar localmente:

```bash
# Web Principal
npm install
npm run dev

# En otra terminal - Blog
cd Blog
npm install
npm run dev
```

### Para desplegar:

1. **Web Principal**
    - Ya está desplegada en Vercel
    - Los cambios se desplegarán automáticamente

2. **Blog (Nuevo proyecto en Vercel)**
    - Ir a Vercel Dashboard
    - Crear nuevo proyecto desde el mismo repositorio
    - Configurar Root Directory: `Blog`
    - Desplegar

## 📝 Notas Importantes

- Los errores de TypeScript en el blog sobre `astro:content` son normales hasta ejecutar `npm run dev` o `astro sync`
- Ambos proyectos mantienen el sistema de i18n (es/en)
- El blog corre en puerto 4321 (configurable)
- Los proyectos son completamente independientes
- Cada proyecto tiene sus propias dependencias

## 🎯 Resultado Final

- ✅ Dos proyectos Astro separados y funcionales
- ✅ Navegación cruzada entre web principal y blog
- ✅ Estructura limpia y mantenible
- ✅ Documentación completa
- ✅ Scripts de instalación automatizados
