import { defineCollection, z } from 'astro:content';

const localizedText = z.object({
  hr: z.string().min(1),
  en: z.string().min(1)
});

const siteCollection = defineCollection({
  type: 'data',
  schema: z.object({
    siteTitle: z.string().min(1),
    metaDescription: z.string().min(1),
    htmlLang: z.string().default('hr'),
    nav: z.object({
      logoPrefix: z.string().min(1),
      logoHighlight: z.string().min(1)
    }),
    hero: z.object({
      label: localizedText,
      titleMain: localizedText,
      titleSub: localizedText,
      description: localizedText
    }),
    sections: z.object({
      integrations: z.object({
        number: z.string().min(1),
        title: localizedText
      }),
      scripts: z.object({
        number: z.string().min(1),
        title: localizedText
      }),
      projects: z.object({
        number: z.string().min(1),
        title: localizedText
      }),
      about: z.object({
        number: z.string().min(1),
        title: localizedText
      })
    }),
    about: z.object({
      avatar: z.string().url(),
      avatarAlt: z.string().min(1),
      fallbackAvatar: z.string().min(1).default('👤'),
      name: z.string().min(1),
      role: localizedText,
      bio: localizedText,
      socialLinks: z.array(
        z.object({
          label: z.string().min(1),
          url: z.string().url(),
          icon: z.string().min(1)
        })
      )
    }),
    footer: z.object({
      text: z.string().min(1)
    }),
    i18n: z.object({
      defaultLang: z.enum(['hr', 'en']).default('hr'),
      copyToast: localizedText
    })
  })
});

const integrationsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number().int().nonnegative(),
    name: z.string().min(1),
    icon: z.string().min(1),
    source: localizedText,
    description: localizedText,
    docsUrl: z.string().url(),
    repoUrl: z.string().url(),
    repoDisplay: z.string().min(1),
    repoChip: z.string().min(1).default('HACS'),
    accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  })
});

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number().int().nonnegative(),
    name: z.string().min(1),
    icon: z.string().min(1),
    description: localizedText,
    tag: z.string().min(1),
    url: z.string().url()
  })
});

const scriptsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number().int().nonnegative(),
    name: z.string().min(1),
    icon: z.string().min(1),
    description: localizedText,
    tag: z.string().min(1),
    url: z.string().url()
  })
});

export const collections = {
  site: siteCollection,
  integrations: integrationsCollection,
  projects: projectsCollection,
  scripts: scriptsCollection
};
