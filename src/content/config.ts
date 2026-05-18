import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    mod: z.string(),
    modTitle: z.string().optional(),
    description: z.string().optional(),
    lastModified: z.string().optional(),
    order: z.number().optional(),
    icon: z.string().optional(),
    pageType: z.string().optional(),
  }),
});

export const collections = { docs };
