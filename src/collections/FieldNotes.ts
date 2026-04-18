import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { estimateReadingTime } from '../lib/format.ts';
import { revalidateFieldNote } from '../lib/revalidate.ts';

export const FieldNotes: CollectionConfig = {
  slug: 'field-notes',
  admin: {
    useAsTitle: 'title',
    group: 'Editorial',
    defaultColumns: ['title', 'topic', 'published', 'draft'],
    preview: (doc) => (doc.slug ? `/field-notes/${String(doc.slug)}` : null),
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { draft: { equals: false } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.body) {
          data.readingTime = estimateReadingTime(JSON.stringify(data.body));
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc }: { doc: { slug: string; draft?: boolean } }) => {
        if (!doc.draft) {
          revalidateFieldNote(doc.slug);
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
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
            (data?.['title'] as string | undefined)
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
        ],
      },
    },
    { name: 'excerpt', type: 'textarea', required: true },
    {
      name: 'topic',
      type: 'select',
      required: true,
      options: [
        { label: 'Nib', value: 'nib' },
        { label: 'Ink', value: 'ink' },
        { label: 'Paper', value: 'paper' },
        { label: 'History', value: 'history' },
        { label: 'Technique', value: 'technique' },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'relatedSpecimens',
      type: 'relationship',
      relationTo: 'specimens',
      hasMany: true,
    },
    {
      name: 'published',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'draft',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
};
