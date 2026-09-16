import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			period: z.string(),
			role: z.string(),
			stack: z.array(z.string()).default([]),
			// 랜딩에 올릴 3개를 featured로 표시하고, order로 순서를 고정한다.
			featured: z.boolean().default(false),
			order: z.number().default(99),
			metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
			heroImage: z.optional(image()),
			draft: z.boolean().default(false),
		}),
});

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		category: z.enum(['book', 'perfume']),
		date: z.coerce.date(),
		// 책이면 저자, 향수면 브랜드.
		by: z.string().optional(),
		rating: z.number().min(1).max(5).optional(),
		description: z.string(),
		keywords: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, projects, notes };
