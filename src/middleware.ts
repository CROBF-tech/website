import { defineMiddleware } from "astro:middleware";
import { getAvailableLanguages, getDefaultLanguage } from "./i18n/translate";

const language_cookie_name = "prefered_language";
const cookies_config = {
    path: "/", // Configuración para que la cookie esté disponible en la raíz
    httpOnly: false,
};

const defaultLang = getDefaultLanguage();
const validLangs = getAvailableLanguages() as string[];

// Rutas que no deben pasar por la lógica de redirección de idioma (assets, sitemap, etc.)
const IGNORED_PATHS = [
    /^\/(?:sitemap|robots\.txt|favicon|Logo|logo|_astro|_image|projects|images|fonts|videos?|assets|api)/,
    /\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|mjs|json|xml|txt|woff|woff2|ttf|otf|eot|mp4|webm|ogg|pdf)$/i,
];

function shouldIgnore(pathname: string): boolean {
    return IGNORED_PATHS.some((pattern) => pattern.test(pathname));
}

function buildRedirectUrl(
    targetLang: string,
    url_path: string[],
    originalUrl: URL
): string {
    const base = `/${targetLang}/${url_path.join("/")}`.replace(/\/$/, "");
    const redirectUrl = new URL(base || `/${targetLang}/`, originalUrl);
    redirectUrl.search = originalUrl.search;
    redirectUrl.hash = originalUrl.hash;
    return redirectUrl.toString();
}

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname, searchParams } = context.url;

    // Early-return: no procesar assets estáticos ni rutas especiales
    if (shouldIgnore(pathname)) {
        return next();
    }

    // Early-return defensivo: si no hay request headers (build/prerender), no tocar cookies
    if (!context.request.headers) {
        return next();
    }

    const { cookies } = context;
    const [url_lang, ...url_path] = pathname.split("/").slice(1);

    // Permitir override temporal por query param sin modificar la cookie
    const overrideLang = searchParams.get("lang");
    if (
        overrideLang &&
        validLangs.includes(overrideLang) &&
        url_lang !== overrideLang
    ) {
        return context.redirect(
            buildRedirectUrl(overrideLang, url_path, context.url)
        );
    }

    // Obtén el idioma preferido desde la cookie
    let prefered_language = cookies.get(language_cookie_name)?.value;

    // Si no hay cookie configurada, establece una según la URL o el idioma por defecto
    if (!prefered_language) {
        prefered_language = validLangs.includes(url_lang) ? url_lang : defaultLang;
        cookies.set(language_cookie_name, prefered_language, cookies_config);

        if (!validLangs.includes(url_lang)) {
            return context.redirect(
                buildRedirectUrl(prefered_language, url_path, context.url)
            );
        }
        return next();
    }

    // Si el idioma en la cookie no es válido, corrige la cookie y redirige
    if (!validLangs.includes(prefered_language)) {
        cookies.set(language_cookie_name, defaultLang, cookies_config);
        return context.redirect(
            buildRedirectUrl(defaultLang, url_path, context.url)
        );
    }

    // Si el idioma en la URL no coincide con la cookie, redirige
    if (url_lang !== prefered_language) {
        return context.redirect(
            buildRedirectUrl(prefered_language, url_path, context.url)
        );
    }

    // Procede con la solicitud
    return next();
});
