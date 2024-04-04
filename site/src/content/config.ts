import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),
		tags: z.array(z.string()),
		publishedDate: z.date(),
		updatedDate: z.date().optional(),
		lang: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
