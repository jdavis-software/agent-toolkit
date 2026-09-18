import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const skills = defineCollection({
  loader: glob({ base: './skills', pattern: '*/SKILL.md', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: z.object({ name: z.string(), description: z.string() }),
});
export const collections = { skills };
