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

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional().default(''),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        author: z.string().optional().default('CROBF'),
        tags: z.array(z.string()).optional().default([]),
        featured: z.boolean().optional().default(false),
        readingTime: z.number().int().positive().optional(),
    }),
});

export const collections = { founder, blog };
