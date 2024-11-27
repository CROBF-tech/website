import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    const validLangs = ["es", "en"];
    const lang = context.url.pathname.split('/')[1];

    if (!validLangs.includes(lang)) {
        return context.redirect('/en');
    }

    next();
});