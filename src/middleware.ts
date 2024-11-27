import { defineMiddleware } from "astro:middleware";

// `context` y `next` son automáticamente tipados
export const onRequest = defineMiddleware((context, next) => {
    const validLangs = ["es", "en"];
    const lang = context.url.pathname.split('/')[1];

    // Redirige a "/en/" si el idioma no es válido
    if (!validLangs.includes(lang)) {
        return context.redirect('/en');
    }

    next();
});