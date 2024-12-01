import { defineMiddleware } from "astro:middleware";
import { getAvailableLanguages, getDefaultLanguage } from "./i18n/translate";

const language_cookie_name = "prefered_language";
const cookies_config = {
    path: "/", // Configuración para que la cookie esté disponible en la raíz
    httpOnly: false
};

export const onRequest = defineMiddleware(async (context, next) => {
    const defaultLang = getDefaultLanguage();
    const { cookies } = context;
    const validLangs = getAvailableLanguages() as string[];
    const [url_lang, ...url_path] = context.url.pathname.split('/').slice(1);

    // Obtén el idioma preferido desde la cookie
    let prefered_language = cookies.get(language_cookie_name)?.value;

    // Si no hay cookie configurada, establece una según la URL o el idioma por defecto
    if (!prefered_language) {
        prefered_language = validLangs.includes(url_lang) ? url_lang : defaultLang;
        cookies.set(language_cookie_name, prefered_language, cookies_config);

        if (!validLangs.includes(url_lang)) {
            return context.redirect(`/${prefered_language}/${url_path.join('/')}`);
        }
        return next();
    }

    // Si el idioma en la cookie no es válido, corrige la cookie y redirige
    if (!validLangs.includes(prefered_language)) {
        cookies.set(language_cookie_name, defaultLang, cookies_config);
        return context.redirect(`/${defaultLang}/${url_path.join('/')}`);
    }

    // Si el idioma en la URL no coincide con la cookie, redirige
    if (url_lang !== prefered_language) {
        return context.redirect(`/${prefered_language}/${url_path.join('/')}`);
    }

    // Procede con la solicitud
    return next();
});
