import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const founder = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/founder' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        heroImage: z.union([z.string(), z.array(z.string())]).optional(),
        profession: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        email: z.string().optional(),
        index: z.number().optional(),
        centerCol: z.boolean().optional(),
    }),
});

export const collections = { founder };
