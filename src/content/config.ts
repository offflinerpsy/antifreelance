import { defineCollection, z } from 'astro:content';

const knowledgeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    industry: z.string(),
    icon: z.string(),
    heroHeadline: z.string(),
    heroSub: z.string(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
    benefits: z.array(z.object({
      title: z.string(),
      text: z.string(),
    })),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })),
    cta: z.string(),
    pubDate: z.date(),
  }),
});

const casestudiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    icon: z.string(),
    challenge: z.string(),
    approach: z.array(z.object({
      step: z.string(),
      description: z.string(),
    })),
    results: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }),
    images: z.array(z.string()),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    pubDate: z.date(),
  }),
});

export const collections = {
  'knowledge': knowledgeCollection,
  'services': servicesCollection,
  'casestudies': casestudiesCollection,
};
