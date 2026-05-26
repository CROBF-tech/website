import { defineCollection, glob, z } from 'astro:content';

const founder = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/founder' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        heroImage: z.string().optional(),
    }),
});

export const collections = { founder };
