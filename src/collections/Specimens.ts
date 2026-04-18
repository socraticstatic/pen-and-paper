import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { estimateReadingTime } from '../lib/format.ts';

export const Specimens: CollectionConfig = {
  slug: 'specimens',
  admin: {
    useAsTitle: 'title',
    group: 'Editorial',
    defaultColumns: ['specimenNumber', 'title', 'stage', 'draft'],
    preview: (doc) => (doc.slug ? `/catalogue/${String(doc.slug)}` : null),
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
        if (data.essay) {
          data.readingTime = estimateReadingTime(JSON.stringify(data.essay));
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'specimenNumber',
      type: 'number',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'Unique sequential integer. 1, 2, 3, …' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
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
    {
      name: 'stage',
      type: 'select',
      required: true,
      options: [
        { label: 'I — First Pen', value: 'first-pen' },
        { label: 'II — Curious', value: 'curious' },
        { label: 'III — Collector', value: 'collector' },
        { label: 'IV — Savant', value: 'savant' },
      ],
    },
    {
      name: 'acquired',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    {
      name: 'published',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    {
      name: 'pen',
      type: 'relationship',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'pens' as any,
      admin: { description: 'The pen used in this specimen.' },
    },
    {
      name: 'paper',
      type: 'relationship',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relationTo: 'papers' as any,
      admin: { description: 'The paper used in this specimen.' },
    },
    {
      name: 'ink',
      type: 'group',
      fields: [
        { name: 'maker', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'notes', type: 'text' },
      ],
    },
    {
      name: 'figures',
      type: 'array',
      fields: [
        { name: 'src', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
        { name: 'caption', type: 'text' },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'square',
          options: [
            { label: 'Square', value: 'square' },
            { label: 'Wide', value: 'wide' },
            { label: 'Portrait', value: 'portrait' },
          ],
        },
      ],
    },
    {
      name: 'essay',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'pairingRationale',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'affiliateOverrides',
      type: 'group',
      fields: [
        { name: 'penUrl', type: 'text' },
        { name: 'paperUrl', type: 'text' },
        { name: 'inkUrl', type: 'text' },
      ],
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-computed from essay word count.',
      },
    },
    {
      name: 'draft',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
};
