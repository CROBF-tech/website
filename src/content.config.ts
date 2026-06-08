import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const founder = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/founder' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        heroImage: z.string().optional(),
    }),
});

export const collections = { founder };
