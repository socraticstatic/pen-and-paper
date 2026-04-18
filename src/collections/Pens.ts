import type { CollectionConfig } from 'payload';

export const Pens: CollectionConfig = {
  slug: 'pens',
  admin: {
    useAsTitle: 'model',
    group: 'Catalogue',
    defaultColumns: ['make', 'model', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'make', type: 'text', required: true },
    { name: 'model', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ??
            `${(data?.['make'] as string | undefined) ?? ''}-${(data?.['model'] as string | undefined) ?? ''}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
        ],
      },
    },
    { name: 'draft', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
};
