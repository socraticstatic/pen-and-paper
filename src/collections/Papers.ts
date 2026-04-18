import type { CollectionConfig } from 'payload';

export const Papers: CollectionConfig = {
  slug: 'papers',
  admin: {
    useAsTitle: 'line',
    group: 'Catalogue',
    defaultColumns: ['mill', 'line', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'mill', type: 'text', required: true },
    { name: 'line', type: 'text', required: true },
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
            `${(data?.['mill'] as string | undefined) ?? ''}-${(data?.['line'] as string | undefined) ?? ''}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
        ],
      },
    },
    { name: 'draft', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
};
