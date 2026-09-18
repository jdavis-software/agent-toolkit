import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const schema = z.object({ name: z.string(), description: z.string() });
const skills = defineCollection({
  loader: glob({ base: './skills', pattern: '*/SKILL.md', generateId: ({ entry }) => entry.split('/')[0] }), schema,
});
const community = defineCollection({
  loader: glob({ base: './vendor', pattern: '*/*/SKILL.md', generateId: ({ entry }) => entry.split('/').slice(0, 2).join('-') }), schema,
});
export const collections = { skills, community };
