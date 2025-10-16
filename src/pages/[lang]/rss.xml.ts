import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

export async function GET(context: any) {

    const lang = context.params.lang;
    const posts = await getCollection('blog');

    // Filtrar posts por idioma
    const filteredPosts = posts.filter(post => post.id.startsWith(`${lang}/`));

    const getDateFromBlog = (b: CollectionEntry<"blog">) => new Date(b.data.pubDate);

    const sortedPosts = filteredPosts.sort(
        (a, b) => getDateFromBlog(b).valueOf() - getDateFromBlog(a).valueOf()
    );

    return rss({
        title: `${SITE_TITLE} - Blog ${lang.toUpperCase()}`,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: sortedPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            author: post.data.author,
            // Crear la URL del post removiendo el prefijo del idioma del ID
            link: `/${lang}/blog/${post.id.replace(`${lang}/`, '').replace(/\.mdx?$/, '')}/`,
        })),
        customData: `<language>${lang === 'es' ? 'es-ES' : 'en-US'}</language>`,
    });
}

export function getStaticPaths() {
    return [
        { params: { lang: 'es' } },
        { params: { lang: 'en' } }
    ];
}